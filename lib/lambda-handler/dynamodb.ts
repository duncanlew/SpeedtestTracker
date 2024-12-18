import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {SpeedtestResult, SpeedtestTrackerPayload} from "./models";
import {logger} from "./logger";

const TABLE_NAME = "speedtest-tracker"
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const putItem = async (primaryKey: string, speedtestResult: SpeedtestResult) => {
    const now = new Date();

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            pk: primaryKey,
            epochTime: toEpochSeconds(now.getTime()),
            date: now.toISOString(),
            payload: speedtestResult,
            downloadMbps: speedtestResult.downloadMbps,
            uploadMbps: speedtestResult.uploadMbps,
            pingMs: speedtestResult.pingMs
        },
    });

    return await docClient.send(command);
}

export const getItems = async (pk: string) => {
    const command = new QueryCommand({
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk",
            ExpressionAttributeValues: {
                ":pk": pk,
            }
        }
    )

    const response = await docClient.send(command);
    logger.info({data: response}, `getItems response`);
    return response.Items;
}

const toEpochSeconds = (epochMs: number) => {
    return Math.floor(epochMs / 1000);
};