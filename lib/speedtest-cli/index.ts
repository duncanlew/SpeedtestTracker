import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import {runSpeedtest, saveSpeedTestResult} from "./speedtest";
import {logger} from "../lambda-handler/logger";

dotenv.config();

cron.schedule('0 13 * * *', async (result) => {
    logger.info(`running cron with timestamp: ${new Date().toISOString()}`);

    const url = process.env.URL as string;
    const apiKey = process.env.API_KEY as string;
    const address = process.env.ADDRESS as string;

    try {
        const speedtestResult = await runSpeedtest();
        await saveSpeedTestResult(speedtestResult, url, apiKey, address);
    } catch (error) {
        logger.error({error}, 'Error in running the cron job');
    }

    logger.info(`Cron execution finished with timestamp: ${new Date().toISOString()}`);
})