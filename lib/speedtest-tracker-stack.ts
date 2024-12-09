import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from 'node:path';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export class SpeedtestTrackerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props)
    // const fn = new lambda.Function(this, 'SaveSpeedtestFunction', {
    //   runtime: lambda.Runtime.NODEJS_LATEST,
    //   handler: 'index.handler',
    //   code: lambda.Code.fromAsset(path.join(__dirname, 'lambda-handler')),
    // });

    const fn = new NodejsFunction(this, 'SaveSpeedtestFunction', {
      entry: path.resolve(__dirname, 'lambda-handler/index.js'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
    })

    const endpoint = new apigw.LambdaRestApi(this, `ApiGwEndpoint`, {
      handler: fn,
      restApiName: `SpeedtestTrackerApi`,
    });



  }
}