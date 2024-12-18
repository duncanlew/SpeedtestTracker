import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context} from "aws-lambda";
import {SpeedtestResult, SpeedtestResultConverted, SpeedtestTrackerPayload} from "./models";
import {putItem} from "./dynamodb";
import {SpeedtestTrackerValidationError} from "./errors";
import {logger, withRequest} from "./logger";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    withRequest(event, context);
    try {
        const payload = extractPayload(event);
        logger.info({data: payload}, 'Received SpeedtestTrackerPayload');

        const primaryKey = payload.pk;
        const speedtestResultConverted = getSpeedtestResultConverted(payload.result);
        const putResponse = await putItem(primaryKey, speedtestResultConverted);

        const response = {
            speedtestTrackerPayload: payload,
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

const getSpeedtestResultConverted = (speedtestResult: SpeedtestResult): SpeedtestResultConverted => {
    return {
        ...speedtestResult,
        downloadMbps: speedtestResult.download.bandwidth / 125000,
        uploadMbps: speedtestResult.upload.bandwidth / 125000,
        pingMs: speedtestResult.ping.latency,
    }
}

