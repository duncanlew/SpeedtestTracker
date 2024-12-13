import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand, QueryCommand} from "@aws-sdk/lib-dynamodb";
import {SpeedtestTrackerPayload} from "./models";

const TABLE_NAME = "speedtest-tracker"
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const putItem = async (speedtestTrackerPayload: SpeedtestTrackerPayload) => {
    const now = new Date();

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            pk: speedtestTrackerPayload.pk,
            epochTime: toEpochSeconds(now.getTime()),
            date: now.toISOString(),
            payload: speedtestTrackerPayload.result,
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
    console.log(response);
    return response.Items;
}

const toEpochSeconds = (epochMs: number) => {
    return Math.floor(epochMs / 1000);
};