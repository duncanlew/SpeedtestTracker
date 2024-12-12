import axios, {AxiosResponse} from "axios";
import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context} from "aws-lambda";
import {SpeedtestTrackerPayload, Todo} from "./models";
import {getItems, putItem} from "./dynamodb";
import {SpeedtestTrackerValidationError} from "./errors";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        const speedtestTrackerPayload = extractPayload(event);
        console.log('what is is in the speedtestTrackerPayload:');
        console.log(speedtestTrackerPayload);


        const axiosResponse: AxiosResponse<Todo> = await axios.get<Todo>('https://jsonplaceholder.typicode.com/todos/1');
        const todo = axiosResponse.data
        const putResponse = await putItem(todo);
        const getResponse = await getItems('placeholder');

        const response = {
            speedtestTrackerPayload,
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

        let statusCode: number;
        let message: string;

        switch (true) {
            case error instanceof SpeedtestTrackerValidationError:
                statusCode = 400;
                message = (error as SpeedtestTrackerValidationError).message;
                break;
            case error instanceof SyntaxError:
                statusCode = 400;
                message = (error as SyntaxError).message;
                break;
            default:
                statusCode = 500;
                message = `Unknown error occurred: ${error}`;
                break;
        }

        return {
            statusCode,
            body: JSON.stringify(message),
        }
    }
}

const extractPayload = (event: APIGatewayProxyEvent) => {
    if (event.body === null) {
        throw new SpeedtestTrackerValidationError("Payload may not be empty");
    }

    return JSON.parse(event.body) as SpeedtestTrackerPayload;
}

