import * as cron from 'node-cron';
import {runSpeedtest, saveSpeedTestResult} from "./speedtest";

cron.schedule('*/5 * * * *', async (result) => {
    const currentTime = new Date();
    console.log('running cron: ', currentTime.toISOString());

    try {
        const speedtestResult = await runSpeedtest();
        const response = await saveSpeedTestResult(speedtestResult);
        console.log('response: ', response);
    } catch (error) {
        console.error('Error in runing cron: ', error);
    }
})