import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigw from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as path from 'node:path';
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";

export class SpeedtestTrackerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props)

    const fn = new NodejsFunction(this, 'SaveSpeedtestFunction', {
      entry: path.resolve(__dirname, 'lambda-handler/index.ts'),
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'handler',
    })

    const endpoint = new apigw.LambdaRestApi(this, `ApiGwEndpoint`, {
      handler: fn,
      restApiName: `SpeedtestTrackerApi`,
    });

    const table = new dynamodb.TableV2(this, 'Table', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'epochTime', type: dynamodb.AttributeType.NUMBER },
      tableName: "speedtest-tracker",
    });

    table.grantReadWriteData(fn);

  }
}