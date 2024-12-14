import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import {runSpeedtest, saveSpeedTestResult} from "./speedtest";

dotenv.config();

cron.schedule('0 13 * * *', async (result) => {
    console.log('running cron with timestamp: ', new Date().toISOString());

    const url = process.env.URL as string;
    const apiKey = process.env.API_KEY as string;
    const address = process.env.ADDRESS as string;

    try {
        const speedtestResult = await runSpeedtest();
        const response = await saveSpeedTestResult(speedtestResult, url, apiKey, address);
        console.log('response: ', response);
    } catch (error) {
        console.error('Error in running cron: ', error);
    }

    console.log('Cron execution finished with timestamp: ', new Date().toISOString());
})