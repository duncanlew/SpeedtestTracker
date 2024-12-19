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
      bundling: {
        sourceMap: true
      },
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
        BOT_TOKEN: process.env.BOT_TOKEN!,
        CHAT_ID: process.env.CHAT_ID!,
      },
    });

    const table = new dynamodb.TableV2(this, 'Table', {
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'epochTime', type: dynamodb.AttributeType.NUMBER },
      tableName: "speedtest-tracker",
    });
    table.grantReadWriteData(fn);

    const api = new apigw.LambdaRestApi(this, `ApiGwEndpoint`, {
      handler: fn,
      restApiName: `SpeedtestTrackerApi`,
      deployOptions: {
        stageName: 'prod',
      },
      defaultMethodOptions: {
        apiKeyRequired: true,
      }
    });

    const plan = api.addUsagePlan('UsagePlan', {
      name: 'SpeedtestTrackerUsagePlan',
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      }
    });

    const apiKey = api.addApiKey('ApiKey', {
      apiKeyName: 'SpeedtestTrackerApiKey',
    });

    plan.addApiKey(apiKey);
    plan.addApiStage({
      stage: api.deploymentStage
    });
  }
}