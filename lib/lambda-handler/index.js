const axios = require("axios");

exports.handler = async (event) => {

    try {
        // Extract specific properties from the event object
        const { resource, path, httpMethod, headers, queryStringParameters, body } = event;

        const axiosResponse = await axios.get('https://jsonplaceholder.typicode.com/todos/1');

        const response = {
            resource,
            path,
            httpMethod,
            headers,
            queryStringParameters,
            body,
            todos: axiosResponse.data,

        };

        return {
            statusCode: 200,
            body: JSON.stringify(response, null, 2),
        };
    } catch (error) {
        console.error("Error in the lambda handler", error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        }
    }

};