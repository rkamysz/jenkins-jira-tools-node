const fetch = require("node-fetch");
const wizard = require("./wizard.js");

const JiraFetch = function(user, password, url) {
    _jiraUrl = url;
    _auth64 = Buffer.from(`${user}:${password}`).toString('base64'),
    _headers = {
        'Content-Type': 'application/json'/*,
        'Authorization': `Basic ${_auth64}`*/
    };

    _call = function(url, method, body, expectedStatus) {
        console.log("WTF!");
        return fetch(_jiraUrl + url, {
            method: method,
            headers: _headers,
            body: body
        })
        .then(response => onResult(response, expectedStatus))
        .catch(error => error)
        .then(result => {
            if (result instanceof Error) {
              throw result;
            } else {
              return result;
            }
          })
    }
};

const onResult = function(response,expectedStatus) {
    console.log("onResult",response);
    if(expectedStatus && response.status != expectedStatus) { 
        throw new Error(response.status);
    }
    return response.json();
};

const onError = function(error) {
    console.log(wizard.crying, error);
    throw new Error(error);
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