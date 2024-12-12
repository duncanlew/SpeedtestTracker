import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import {Todo} from "../models/todo.interface";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const putItem = async (todo: Todo) => {
    const now = new Date();

    const command = new PutCommand({
        TableName: "speedtest-tracker",
        Item: {
            pk: "AmazonePapegaai",
            epochTime: toEpochSeconds(now.getTime()),
            date: now.toLocaleDateString('nl-NL'),
            payload: todo,
        },
    });

    return await docClient.send(command);
}

const toEpochSeconds = (epochMs: number) => {
    return Math.floor(epochMs / 1000);
};