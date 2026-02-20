import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface GitHubOidcStackProps extends cdk.StackProps {
  gitHubOrg: string;
  gitHubRepo: string;
}

export class GitHubOidcStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GitHubOidcStackProps) {
    super(scope, id, props);

    const { gitHubOrg, gitHubRepo } = props;

    const provider = new iam.OpenIdConnectProvider(this, 'GitHubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });

    const role = new iam.Role(this, 'GitHubActionsRole', {
      roleName: `${gitHubRepo}-github-actions`,
      assumedBy: new iam.FederatedPrincipal(
        provider.openIdConnectProviderArn,
        {
          StringLike: {
            'token.actions.githubusercontent.com:sub': [
              `repo:${gitHubOrg}/${gitHubRepo}:ref:refs/heads/main`,
              `repo:${gitHubOrg}/${gitHubRepo}:environment:*`,
            ],
          },
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // CDK Bootstrap roles (for cdk deploy)
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: [
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-*-${this.account}-${this.region}`,
        ],
      }),
    );

    // CloudFormation DescribeStacks (for get-stack-output composite action)
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudformation:DescribeStacks'],
        resources: [
          `arn:aws:cloudformation:${this.region}:${this.account}:stack/ApiStack/*`,
          `arn:aws:cloudformation:${this.region}:${this.account}:stack/UiStack/*`,
          `arn:aws:cloudformation:${this.region}:${this.account}:stack/AdminUiStack/*`,
        ],
      }),
    );

    // Lambda (for API deploy — code update + environment configuration)
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          'lambda:UpdateFunctionCode',
          'lambda:GetFunctionConfiguration',
          'lambda:UpdateFunctionConfiguration',
        ],
        resources: [
          `arn:aws:lambda:${this.region}:${this.account}:function:*`,
        ],
      }),
    );

    // S3 sync (for UI and Admin UI deploy)
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: [
          's3:ListBucket',
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject',
        ],
        resources: [
          `arn:aws:s3:::*`,
          `arn:aws:s3:::*/*`,
        ],
      }),
    );

    // SSM GetParameter (for API and UI deploy — fetch API key)
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['ssm:GetParameter'],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/headless-cms/api-key`,
        ],
      }),
    );

    // CloudFront invalidation (for UI and Admin UI deploy)
    role.addToPolicy(
      new iam.PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: [
          `arn:aws:cloudfront::${this.account}:distribution/*`,
        ],
      }),
    );

    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: role.roleArn,
    });
  }
}
