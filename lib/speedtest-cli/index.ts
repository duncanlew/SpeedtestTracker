import * as cron from 'node-cron';
import {runSpeedtest, saveSpeedTestResult} from "./speedtest";

cron.schedule('* * * * * *', async (result) => {
    const currentTime = new Date();
    console.log('running cron: ', currentTime.toISOString());

    const speedtestResult = await runSpeedtest();
    const response = await saveSpeedTestResult(speedtestResult);

    console.log('response: ', response);
})