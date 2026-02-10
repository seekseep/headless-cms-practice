import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface ApiStackProps extends cdk.StackProps {
  postsTable: dynamodb.Table;
  categoriesTable: dynamodb.Table;
  assetBucket: s3.Bucket;
  userPool: cognito.UserPool;
  domainName: string;
  apiDomainName: string;
  certificateArn: string;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const apiDomainName = props.apiDomainName;

    const fn = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(
        'exports.handler = async () => ({ statusCode: 200, body: "placeholder" });',
      ),
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: {
        POSTS_TABLE_NAME: props.postsTable.tableName,
        CATEGORIES_TABLE_NAME: props.categoriesTable.tableName,
        ASSET_BUCKET_NAME: props.assetBucket.bucketName,
        USER_POOL_ID: props.userPool.userPoolId,
      },
    });

    props.postsTable.grantReadWriteData(fn);
    props.categoriesTable.grantReadWriteData(fn);
    props.assetBucket.grantPut(fn);

    fn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['cognito-idp:GetUser'],
        resources: [props.userPool.userPoolArn],
      }),
    );

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.certificateArn,
    );

    const domainName = new apigatewayv2.DomainName(this, 'DomainName', {
      domainName: apiDomainName,
      certificate,
    });

    const httpApi = new apigatewayv2.HttpApi(this, 'HttpApi', {
      defaultIntegration: new apigatewayv2Integrations.HttpLambdaIntegration(
        'LambdaIntegration',
        fn,
      ),
      defaultDomainMapping: {
        domainName,
      },
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    new route53.ARecord(this, 'ApiARecord', {
      zone: hostedZone,
      recordName: apiDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.ApiGatewayv2DomainProperties(
          domainName.regionalDomainName,
          domainName.regionalHostedZoneId,
        ),
      ),
    });

    new cdk.CfnOutput(this, 'ApiBuildEnvironment', {
      value: JSON.stringify({}),
    });

    new cdk.CfnOutput(this, 'ApiDevelopEnvironment', {
      value: JSON.stringify({
        POSTS_TABLE_NAME: props.postsTable.tableName,
        CATEGORIES_TABLE_NAME: props.categoriesTable.tableName,
        ASSET_BUCKET_NAME: props.assetBucket.bucketName,
        USER_POOL_ID: props.userPool.userPoolId,
        AWS_REGION: this.region,
      }),
    });

    new cdk.CfnOutput(this, 'ApiDeployEnvironment', {
      value: JSON.stringify({
        FUNCTION_NAME: fn.functionName,
        AWS_REGION: this.region,
      }),
    });
  }
}
