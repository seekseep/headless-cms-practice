#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib/core';
import { GitHubOidcStack } from '../lib/GitHubOidcStack';
import { AuthenticationStack } from '../lib/AuthenticationStack';
import { DataStack } from '../lib/DataStack';
import { ApiStack } from '../lib/ApiStack';
import { UiStack } from '../lib/UiStack';
import { AdminUiStack } from '../lib/AdminUiStack';

const env: cdk.Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

// GitHubOidcStack は他の環境変数に依存しないため単独でデプロイ可能
new GitHubOidcStack(app, 'GitHubOidcStack', {
  env,
  gitHubOrg: 'seekseep',
  gitHubRepo: 'headless-cms-practice',
});

const acmCertificateArn = process.env.ACM_CERTIFICATE_ARN;
const acmRegionalCertificateArn = process.env.ACM_REGIONAL_CERTIFICATE_ARN;
const domainName = process.env.DOMAIN_NAME;

if (acmCertificateArn && acmRegionalCertificateArn && domainName) {
  const apiDomainName = `api.${domainName}`;
  const assetsDomainName = `assets.${domainName}`;
  const uiDomainName = domainName;
  const adminUiDomainName = `admin.${domainName}`;

  const authStack = new AuthenticationStack(app, 'AuthenticationStack', { env });

  const dataStack = new DataStack(app, 'DataStack', {
    env,
    domainName,
    assetsDomainName,
    certificateArn: acmCertificateArn,
  });

  const apiStack = new ApiStack(app, 'ApiStack', {
    env,
    postsTable: dataStack.postsTable,
    categoriesTable: dataStack.categoriesTable,
    assetBucket: dataStack.assetBucket,
    userPool: authStack.userPool,
    userPoolClient: authStack.userPoolClient,
    domainName,
    apiDomainName,
    assetsDomainName,
    certificateArn: acmRegionalCertificateArn,
  });
  apiStack.addDependency(authStack);
  apiStack.addDependency(dataStack);

  new UiStack(app, 'UiStack', {
    env,
    domainName,
    uiDomainName,
    certificateArn: acmCertificateArn,
    apiDomainName,
  });

  const adminUiStack = new AdminUiStack(app, 'AdminUiStack', {
    env,
    domainName,
    adminUiDomainName,
    certificateArn: acmCertificateArn,
    apiDomainName,
    userPool: authStack.userPool,
    userPoolClient: authStack.userPoolClient,
  });
  adminUiStack.addDependency(authStack);
}

app.synth();
