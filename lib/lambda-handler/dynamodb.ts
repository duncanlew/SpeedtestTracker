import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, GetCommand, PutCommand} from "@aws-sdk/lib-dynamodb";
import {Todo} from "../models/todo.interface";

const TABLE_NAME = "speedtest-tracker"
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const putItem = async (todo: Todo) => {
    const now = new Date();

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
            pk: "AmazonePapegaai",
            epochTime: toEpochSeconds(now.getTime()),
            date: now.toLocaleDateString('nl-NL'),
            payload: todo,
        },
    });

    return await docClient.send(command);
}

export const getItem = async (id: string) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            pk: "Shiba Inu",
        },
    });

    const response = await docClient.send(command);
    console.log(response);
    return response;
}

const toEpochSeconds = (epochMs: number) => {
    return Math.floor(epochMs / 1000);
};