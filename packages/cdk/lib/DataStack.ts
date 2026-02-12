import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface DataStackProps extends cdk.StackProps {
  domainName: string;
  assetsDomainName: string;
  certificateArn: string;
}

export class DataStack extends cdk.Stack {
  public readonly postsTable: dynamodb.Table;
  public readonly categoriesTable: dynamodb.Table;
  public readonly assetBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    this.postsTable = new dynamodb.Table(this, 'PostsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.postsTable.addGlobalSecondaryIndex({
      indexName: 'CategoryIdIndex',
      partitionKey: { name: 'categoryId', type: dynamodb.AttributeType.STRING },
    });

    this.categoriesTable = new dynamodb.Table(this, 'CategoriesTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    this.categoriesTable.addGlobalSecondaryIndex({
      indexName: 'ParentIdIndex',
      partitionKey: { name: 'parentId', type: dynamodb.AttributeType.STRING },
    });

    this.assetBucket = new s3.Bucket(this, 'AssetBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    const assetsDomainName = props.assetsDomainName;

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.certificateArn,
    );

    const distribution = new cloudfront.Distribution(this, 'AssetDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.assetBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [assetsDomainName],
      certificate,
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    new route53.ARecord(this, 'AssetARecord', {
      zone: hostedZone,
      recordName: assetsDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    });

    new cdk.CfnOutput(this, 'ToolEnvironment', {
      value: JSON.stringify({
        POSTS_TABLE_NAME: this.postsTable.tableName,
        CATEGORIES_TABLE_NAME: this.categoriesTable.tableName,
        ASSET_BUCKET_NAME: this.assetBucket.bucketName,
      }),
    });
  }
}
