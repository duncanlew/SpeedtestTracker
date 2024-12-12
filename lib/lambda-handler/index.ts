import axios, {AxiosResponse} from "axios";
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context} from "aws-lambda";
import {Todo} from "../models/todo.interface";
import {getItems, putItem} from "./dynamodb";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const body = event.body;
        console.log('what is is in the body:');
        console.log(body);


        const axiosResponse: AxiosResponse<Todo> = await axios.get<Todo>('https://jsonplaceholder.typicode.com/todos/1');
        const todo = axiosResponse.data
        const putResponse = await putItem(todo);
        const getResponse = await getItems('placeholder');

        const response = {
            body,
            todo,
            putResponse,
            getResponse
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

const logEvent = (event: APIGatewayProxyEvent) => {
    console.log('Incoming event:', event);
}

