import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { CfnOutput } from 'aws-cdk-lib'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as targets from 'aws-cdk-lib/aws-route53-targets'

export interface OriginProps extends StackProps {
    domain: string
}

export class Origin extends Construct {
    constructor(scope: Construct, id: string, props: OriginProps) {
        super(scope, id)

        const zone = new route53.PublicHostedZone(this, 'HostedZone', {
            comment: `domain for ${props.domain}`,
            zoneName: `${props.domain}`,
        })

        const certificate = new acm.DnsValidatedCertificate(
            this,
            'CrossRegionCertificate',
            {
                domainName:`*.${props.domain}`,
                subjectAlternativeNames: [`${props.domain}`],
                hostedZone: zone,
                region: 'us-east-1',
            }
        )

        const bucket = new s3.Bucket(this, 'OriginBucket', {
            bucketName: `originx.${props.domain}`,
            websiteIndexDocument: 'index.html',
            encryption: s3.BucketEncryption.S3_MANAGED,
            publicReadAccess: true,
            websiteErrorDocument: 'error.html',
        })

        const distribution = new cloudfront.Distribution(
            this,
            'OriginDistribution',
            {
                defaultBehavior: { origin: new origins.S3Origin(bucket) },
                domainNames: [`${props.domain}`],
                certificate: certificate,
            }
        )

        new route53.ARecord(this, 'OriginRecord', {
            target: route53.RecordTarget.fromAlias(
                new targets.CloudFrontTarget(distribution)
            ),
            zone: zone,
        })
    }
}
