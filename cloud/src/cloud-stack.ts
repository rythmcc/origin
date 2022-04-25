import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as origin from './web';

export class CloudStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const certificateArn = cdk.Fn.importValue(
            'rythm-origin-certificatearn',
        );
        const hostedZoneId = cdk.Fn.importValue('rythm-origin-hostedzoneid');

        const rythmOrigin = new origin.Web(this, 'OriginWeb', {
            name: 'Originx',
            domain: 'rythm.cc',
            certificateArn: certificateArn,
            hostedZoneId: hostedZoneId,
        });
    }
}
