const fetch = require("node-fetch");
const isNumeric = require('./helpers.js').isNumeric;

const callJira = function (url, method, body, expectedStatus) {
    return fetch(url, {
        method: method,
        headers: _headers,
        body: body
    })
    .then(response => onResult(response, expectedStatus));
}

const buildHeaders = function (user, password) {
    let _auth64 = Buffer.from(`${user}:${password}`).toString('base64');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${_auth64}`
    };
}

const onResult = function (response, expectedStatus) {
    if (shouldThrowError(response, expectedStatus)) {
        throw new Error(response.status);
    }
    return response.json();
};

const shouldThrowError = function (value, expectedStatus) {
    return value instanceof Error || (isNumeric(expectedStatus) && value.status != expectedStatus);
};

const JiraFetch = function (user, password, url) {
    _headers = buildHeaders(user, password),
        _jiraUrl = url;
};

JiraFetch.prototype.post = function (path, body, expectedStatus) {
    return callJira(_jiraUrl + path, 'POST', body, expectedStatus);
};

JiraFetch.prototype.put = function (path, body, expectedStatus) {
    return callJira(_jiraUrl + path, 'PUT', body, expectedStatus);
};

JiraFetch.prototype.get = function (path, body, expectedStatus) {
    return callJira(_jiraUrl + path, 'GET', body, expectedStatus);
};

module.exports = {
    JiraFetch: JiraFetch,
    onResult: onResult,
    buildHeaders: buildHeaders,
    shouldThrowError:shouldThrowError
};