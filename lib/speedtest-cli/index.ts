import * as cron from 'node-cron';
import * as dotenv from 'dotenv';
import {runSpeedtest, saveSpeedTestResult} from "./speedtest";

dotenv.config();

cron.schedule('*/5 * * * *', async (result) => {
    const url = process.env.URL as string;
    const apiKey = process.env.API_KEY as string;
    const address = process.env.ADDRESS as string;

    console.log({ apiKey, address, url });
    console.log('running cron: ', new Date().toISOString());

    try {
        // const speedtestResult = await runSpeedtest();
        // const response = await saveSpeedTestResult(speedtestResult);
        // console.log('response: ', response);
    } catch (error) {
        console.error('Error in runing cron: ', error);
    }
})