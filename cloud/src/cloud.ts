#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudStack } from './cloud-stack';

const app = new cdk.App();
new CloudStack(app, 'RythmOriginCloudStack', {
    stackName: 'rythm-origin-stack',
    env: {
        account: process.env.AWS_TARGET_ACCOUNT,
        region: process.env.AWS_REGION,
    },
});
