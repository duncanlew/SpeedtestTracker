import * as cron from 'node-cron';

cron.schedule('* * * * * *', (result) => {
    const currentTime = new Date();
    console.log('running cron: ', currentTime.toISOString());
})