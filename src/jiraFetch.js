const fetch = require("node-fetch");
const isNumeric = require('./helpers.js').isNumeric;

const buildHeaders = function (user, password) {
    let _auth64 = Buffer.from(`${user}:${password}`).toString('base64');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${_auth64}`
    };
}

const shouldThrowError = function (value, expectedStatus) {
    return value instanceof Error || (isNumeric(expectedStatus) && value.status != expectedStatus);
};

const onResult = function (response, expectedStatus) {
    if (shouldThrowError(response, expectedStatus)) {
        throw new Error(response.status);
    }
    return response.json();
};

const fetchMethod = function(path, body, expectedStatus) {
    console.log(this.url);
    return fetch(this.url + path, {
        method: this.method,
        headers: this.headers,
        body: body
    })
    .then(response => onResult(response, expectedStatus));
}

module.exports.JiraFetchComponents = {
    onResult: onResult,
    buildHeaders: buildHeaders,
    shouldThrowError: shouldThrowError,
    fetchMethod: fetchMethod
};

module.exports.JiraFetch = (user, password, url) => {
    let requestDO = {
            url: url,
            headers: buildHeaders(user, password)
        };
    return {
        post: fetchMethod.bind(Object.assign({ method:'POST' }, requestDO)),
        put: fetchMethod.bind(Object.assign({ method:'PUT' }, requestDO)),
        get: fetchMethod.bind(Object.assign({ method:'GET' }, requestDO)),
    }
};