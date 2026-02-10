import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export interface AdminUiStackProps extends cdk.StackProps {
  domainName: string;
  adminUiDomainName: string;
  certificateArn: string;
  apiDomainName: string;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
}

export class AdminUiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AdminUiStackProps) {
    super(scope, id, props);

    const adminUiDomainName = props.adminUiDomainName;

    const bucket = new s3.Bucket(this, 'AdminUiBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.certificateArn,
    );

    const distribution = new cloudfront.Distribution(this, 'AdminUiDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      domainNames: [adminUiDomainName],
      certificate,
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    new route53.ARecord(this, 'AdminUiARecord', {
      zone: hostedZone,
      recordName: adminUiDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    });

    new cdk.CfnOutput(this, 'AdminUiBuildEnvironment', {
      value: JSON.stringify({
        VITE_COGNITO_USER_POOL_ID: props.userPool.userPoolId,
        VITE_COGNITO_CLIENT_ID: props.userPoolClient.userPoolClientId,
        VITE_API_BASE_URL: `https://${props.apiDomainName}`,
      }),
    });

    new cdk.CfnOutput(this, 'AdminUiDevelopEnvironment', {
      value: JSON.stringify({
        VITE_COGNITO_USER_POOL_ID: props.userPool.userPoolId,
        VITE_COGNITO_CLIENT_ID: props.userPoolClient.userPoolClientId,
        VITE_API_BASE_URL: `https://${props.apiDomainName}`,
      }),
    });

    new cdk.CfnOutput(this, 'AdminUiDeployEnvironment', {
      value: JSON.stringify({
        S3_BUCKET_NAME: bucket.bucketName,
        DISTRIBUTION_ID: distribution.distributionId,
      }),
    });
  }
}
