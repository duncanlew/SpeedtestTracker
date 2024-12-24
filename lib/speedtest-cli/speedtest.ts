import { exec } from "child_process";
import axios from "axios";
import { SpeedtestTrackerPayload } from "../lambda-handler/models";
import { logger } from "../lambda-handler/logger";

export function runSpeedtest(): Promise<any> {
  const command = "speedtest --format=json";

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
      }

      if (stderr) {
        reject(`Standard Error: ${stderr}`);
      }

      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (parseError) {
        reject(`Failed to parse JSON output: ${parseError}`);
      }
    });
  });
}

export const saveSpeedTestResult = async (
  speedtestResult: any,
  url: string,
  apiKey: string,
  address: string,
) => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
  };

  const payload: SpeedtestTrackerPayload = {
    pk: address,
    result: speedtestResult,
  };

  const response = await axios.post(url, payload, { headers });

  logger.info({ data: response.data }, "POST Response");
};
