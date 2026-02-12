import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

export interface UiStackProps extends cdk.StackProps {
  domainName: string;
  uiDomainName: string;
  certificateArn: string;
  apiDomainName: string;
}

export class UiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: UiStackProps) {
    super(scope, id, props);

    const uiDomainName = props.uiDomainName;

    const bucket = new s3.Bucket(this, 'UiBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      props.certificateArn,
    );

    const distribution = new cloudfront.Distribution(this, 'UiDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      domainNames: [uiDomainName],
      certificate,
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    new route53.ARecord(this, 'UiARecord', {
      zone: hostedZone,
      recordName: uiDomainName,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    });

    const apiKey = ssm.StringParameter.valueForStringParameter(
      this,
      '/headless-cms/api-key',
    );

    new cdk.CfnOutput(this, 'UiBuildEnvironment', {
      value: cdk.Fn.join('', [
        '{"API_BASE_URL":"https://', props.apiDomainName, '","API_KEY":"', apiKey, '"}',
      ]),
    });

    new cdk.CfnOutput(this, 'UiDevelopEnvironment', {
      value: cdk.Fn.join('', [
        '{"API_BASE_URL":"https://', props.apiDomainName, '","API_KEY":"', apiKey, '"}',
      ]),
    });

    new cdk.CfnOutput(this, 'UiDeployEnvironment', {
      value: JSON.stringify({
        S3_BUCKET_NAME: bucket.bucketName,
        DISTRIBUTION_ID: distribution.distributionId,
      }),
    });
  }
}
