const fetch = require("node-fetch");

const JiraFetch = function(user, password, url) {
    _jiraUrl = url;
    _auth64 = Buffer.from(`${user}:${password}`).toString('base64'),
    _headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${_auth64}`
    };

    _call = function(url, method, body, expectedStatus) {
        return fetch(_jiraUrl + url, {
            method: method,
            headers: _headers,
            body: body
        })
        .then(response => onResult(response, expectedStatus));
    }
};

const onResult = function(response,expectedStatus) {
    if(shouldThrowError(response,expectedStatus)) { 
        throw new Error(response.status);
    }
    return response.json();
};

const shouldThrowError = function(value, expectedStatus) {
    return value instanceof Error || (expectedStatus && value.status != expectedStatus);
};

JiraFetch.prototype.post = function(url, body, expectedStatus) {
    return _call(url, 'POST', body, expectedStatus);
};

JiraFetch.prototype.put = function(url, body, expectedStatus) {
    return _call(url, 'PUT', body, expectedStatus);
};

JiraFetch.prototype.get = function(url, body, expectedStatus) {
    return _call(url, 'GET', body, expectedStatus);
};

module.exports = JiraFetch;