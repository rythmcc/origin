import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export interface WebProps extends StackProps {
    name: string;
    certificateArn: string;
    hostedZoneId: string;
    domain: string;
}

export class Web extends Construct {
    constructor(scope: Construct, id: string, props: WebProps) {
        super(scope, id);

        const zone = route53.HostedZone.fromHostedZoneAttributes(
            this,
            'HostedZone',
            {
                hostedZoneId: props.hostedZoneId,
                zoneName: props.domain,
            },
        );

        const bucket = new s3.Bucket(this, 'Bucket', {
            bucketName: `${props.name.toLocaleLowerCase()}.${props.domain}`,
            websiteIndexDocument: 'index.html',
            encryption: s3.BucketEncryption.S3_MANAGED,
            publicReadAccess: true,
            websiteErrorDocument: 'error.html',
        });

        const certificate = acm.Certificate.fromCertificateArn(
            this,
            'Certificate',
            props.certificateArn,
        );

        const distribution = new cloudfront.Distribution(this, 'Distribution', {
            defaultBehavior: { origin: new origins.S3Origin(bucket) },
            domainNames: [`${props.domain}`],
            certificate: certificate,
        });

        new route53.ARecord(this, 'ARecord', {
            target: route53.RecordTarget.fromAlias(
                new targets.CloudFrontTarget(distribution),
            ),
            zone: zone,
        });
    }
}
