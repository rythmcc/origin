import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as origin from "./origin"

export class CloudStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props)

        const rythmOrigin = new origin.Origin(this, "RythmOrigin", {
            domain: 'rythm.cc'
        })
    }
}
