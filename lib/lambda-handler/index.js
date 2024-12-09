const axios = require("axios");

exports.handler = async (event) => {
    // Extract specific properties from the event object
    const { resource, path, httpMethod, headers, queryStringParameters, body } = event;
    const response = {
        resource,
        path,
        httpMethod,
        headers,
        queryStringParameters,
        body,
    };

    const axiosTodos = await axios.get('https://jsonplaceholder.typicode.com/todos/1');

    const combined = {
        ...response,
        axiosTodos
    }

    return {
        statusCode: 200,
        body: JSON.stringify(combined, null, 2),
    };
};