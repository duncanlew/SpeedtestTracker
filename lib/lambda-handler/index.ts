import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import {
  SpeedtestResultDto,
  SpeedtestResult,
  SpeedtestTrackerPayload,
} from "./models";
import { putItem } from "./dynamodb";
import { SpeedtestTrackerValidationError } from "./errors";
import { logger, withRequest } from "./logger";
import { sendTelegramMessage } from "./telegram";
import {validate} from "./schema";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  try {
    withRequest(event, context);
    logger.info({ data: event }, "Received event");

    const payload = extractPayload(event);
    const { pk: primaryKey, result: speedtestResultDto } = payload;
    const speedtestResult = getSpeedtestResult(speedtestResultDto);
    const telegramMessage = constructSuccessMessage(
      primaryKey,
      speedtestResult,
    );

    const putResponse = await putItem(primaryKey, speedtestResult);

    await sendTelegramMessage(telegramMessage);
    return successResponse(JSON.stringify(putResponse, null, 2));
  } catch (error) {
    logger.error("Error in the lambda handler");
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

    const stringifiedMessage = JSON.stringify(message, null, 2);
    const telegramMessage = constructFailureMessage(stringifiedMessage);

    await sendTelegramMessage(telegramMessage);
    return errorResponse(statusCode, stringifiedMessage);
  }
};

const successResponse = (message: string): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: message,
  };
};

const errorResponse = (
  errorCode: number,
  message: string,
): APIGatewayProxyResult => {
  return {
    statusCode: errorCode,
    body: message,
  };
};

const extractPayload = (event: APIGatewayProxyEvent) => {
  if (event.body === null) {
    throw new SpeedtestTrackerValidationError("Payload may not be empty");
  }

  const parsedBody = JSON.parse(event.body);

  const isValid = validate(parsedBody)
  if (!isValid) {
    throw new SpeedtestTrackerValidationError(`JSON validation failed with error: ${JSON.stringify(validate.errors)}`);
  }

  return parsedBody as SpeedtestTrackerPayload;
};

const getSpeedtestResult = (
  speedtestResultDto: SpeedtestResultDto,
): SpeedtestResult => {
  return {
    ...speedtestResultDto,
    downloadMbps: speedtestResultDto.download.bandwidth / 125000,
    uploadMbps: speedtestResultDto.upload.bandwidth / 125000,
    pingMs: speedtestResultDto.ping.latency,
  };
};

const constructSuccessMessage = (
  primaryKey: string,
  speedtestResult: SpeedtestResult,
) => {
  const { downloadMbps, uploadMbps, pingMs } = speedtestResult;
  return `📢Speedtest was successfully run for ${primaryKey} with the following results:
- ⬇️download speed: ${downloadMbps} mbps
- ⬆️upload speed: ${uploadMbps} mbps
- ⚡ping: ${pingMs} ms`;
};

const constructFailureMessage = (errorMessage: string) => {
  return `❌An error occurred in the SpeedtestTracker Lambda: ${errorMessage}`;
};
