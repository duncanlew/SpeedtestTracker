import { exec } from 'child_process';
import axios from "axios";

export function runSpeedtest(): Promise<any> {
    const command = 'speedtest --format=json';

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

export const saveSpeedTestResult = async (speedtestResult: any) => {
    // Add more operations here
    const url = 'url';
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'YOUR_API_KEY_HERE' // Replace with your actual API key
    };

    const payload = {
        pk: 'pk',
        result: speedtestResult
    }

    // Make the POST request
    const response = await axios.post(url, payload, {headers});

    console.log('POST Response:', response.data);
}

// Use the function and store the result
(async () => {
    try {
        const speedtestResult = await runSpeedtest();
        console.log('Speedtest Result:', speedtestResult);

        // Add more operations here
        const url = 'url';
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': 'YOUR_API_KEY_HERE' // Replace with your actual API key
        };

        const payload = {
            pk: 'pk',
            result: speedtestResult
        }

        // Make the POST request
        const response = await axios.post(url, payload, { headers });

        console.log('POST Response:', response.data);

    } catch (error) {
        console.error(error);
    }
})();