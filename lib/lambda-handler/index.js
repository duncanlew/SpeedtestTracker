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

    const todos = await fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())

    const combined = {
        ...response,
        todos
    }

    return {
        statusCode: 200,
        body: JSON.stringify(combined, null, 2),
    };
};