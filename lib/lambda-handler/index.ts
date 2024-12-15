import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context} from "aws-lambda";
import {SpeedtestTrackerPayload, Todo} from "./models";
import {putItem} from "./dynamodb";
import {SpeedtestTrackerValidationError} from "./errors";
import {logger, withRequest} from "./logger";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    withRequest(event, context);
    try {
        const speedtestTrackerPayload = extractPayload(event);
        logger.info({data: speedtestTrackerPayload}, 'Received SpeedtestTrackerPayload');

        const putResponse = await putItem(speedtestTrackerPayload);

        const response = {
            speedtestTrackerPayload,
            putResponse,
        };

        return {
            statusCode: 200,
            body: JSON.stringify(response, null, 2),
        };
    } catch (error) {
        logger.error("Error in the lambda handler", error);

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

