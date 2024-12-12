import axios, {AxiosResponse} from "axios";
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context} from "aws-lambda";
import {Todo} from "../models/todo.interface";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import {putItem} from "./dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        // Extract specific properties from the event object
        const { resource, path, httpMethod, headers, queryStringParameters, body } = event;

        const axiosResponse: AxiosResponse<Todo> = await axios.get<Todo>('https://jsonplaceholder.typicode.com/todos/1');
        const todo = axiosResponse.data
        const dynamoResponse = await putItem(todo);

        const response = {
            resource,
            path,
            httpMethod,
            headers,
            queryStringParameters,
            body,
            todo,
            dynamoResponse
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response, null, 2),
        };
    } catch (error) {
        console.error("Error in the lambda handler", error);

        return {
            statusCode: 500,
            body: JSON.stringify(error),
        }
    }
}

