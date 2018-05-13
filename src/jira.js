const jiraFetch = require("./jiraFetch.js");
const wizard = require("./wizard.js");
const buildTransitionsRequestBody = require("./helpers.js").buildTransitionsRequestBody;
const getVersionFromPackageJson = require("./helpers").getVersionFromPackageJson;

function Jira(config) {
    if (!config) {
        throw new Error('Missing jira config.');
    }
    let _config = config,
        _jiraFetch = new JiraFetch(_config.user, _config.password, _config.url);
}

Jira.prototype.createVersion = function (data) {
    console.log(wizard.focused + "create new version in Jira");

    data.project = data.project || _config.project;
    data.name = data.name || getVersionFromPackageJson();

    return _jiraFetch.post('/version', JSON.stringify(data), 201)
            .then(version => {
                if(version.id) {
                    return version.id;
                }
            })
            .catch(error => {
                console.log(`${wizard.crying} Version ${data.name} has not been added. `, error);
            });
}
    // return fetch(_config.url + '/version', {
    //     method: 'POST',
    //     headers: _headers,
    //     body: JSON.stringify(data)
    // }).then(response => {
    //     if (response.status != 201) {
    //         throw new Error('status:' + response.status);
    //     } else {
    //         console.log(wizard.happy + "New version has been created " + data.name);
    //         return response.json();
    //     }
    // })
    //     .then((version) => {
    //         return version.id;
    //     })
    //     .catch(error => {
    //         console.log(wizard.crying + "Version " + data.name + " has not been added.", error);
    //     });
//}

Jira.prototype.changeTicketFixVersion = function (ticket, versionId) {

}

Jira.prototype.getTicketTransitions = function (ticket) {

}

Jira.prototype.changeTicketTransitions = function (ticket, transitionId, transitionData) {

}

Jira.prototype.getAllTicketsTypes = function () {

}

Jira.prototype.getTicketType = function (ticket) {

}

Jira.prototype.assignTicketTo = function (ticket, username) {

}

Jira.prototype.addCommentToTicket = function (ticket, comment) {

}

module.exports = new Jira(config);

module.exports = function (config) {
    if (!config) {
        throw new Error('Missing jira config.');
    }

    var _config = config,
        _auth64 = Buffer.from(_config.user + ':' + _config.password).toString('base64'),
        _headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + _auth64
        };

    return {
        createVersion: function (data) {
            console.log(wizard.focused + "create new version in Jira");

            data.project = data.project || _config.project;
            data.name = data.name || getVersionFromPackageJson();

            return fetch(_config.url + '/version', {
                method: 'POST',
                headers: _headers,
                body: JSON.stringify(data)
            }).then(response => {
                if (response.status != 201) {
                    throw new Error('status:' + response.status);
                } else {
                    console.log(wizard.happy + "New version has been created " + data.name);
                    return response.json();
                }
            })
                .then((version) => {
                    return version.id;
                })
                .catch(error => {
                    console.log(wizard.crying + "Version " + data.name + " has not been added.", error);
                });
        },
        changeTicketFixVersion: function (ticket, versionId) {
            console.log(wizard.focused + "update fixVersions in Jira tickets");
            return fetch(_config.url + '/issue/' + ticket, {
                method: 'PUT',
                headers: _headers,
                body: '{"update":{"fixVersions":[{"add":{"id":"' + versionId + '"}}]}}'
            }).then(response => {
                if (response.status != 204) {
                    throw new Error('status:' + response.status);
                } else {
                    console.log(wizard.happy + "Ticket " + ticket + " has been updated with new version " + versionId);
                }
            }).catch(error => {
                console.log(wizard.crying + "Ticket " + ticket + " has not been updated.", error);
            });
        },
        getAvailableTicketTransitions: function (ticket) {
            return fetch(_config.url + '/issue/' + ticket + '/transitions', {
                method: 'GET',
                headers: _headers
            }).then(response => {
                if (response.status != 200) {
                    throw new Error('status:' + response.status);
                } else {
                    return response.json();
                }
            }).catch(error => {
                console.log(wizard.crying + "I couldn't get transitions.", error);
            });
        },
        changeTicketTransitions: function (ticket, transitionId, transitionData) {
            console.log(wizard.focused + "change Jira ticket status");
            return fetch(_config.url + '/issue/' + ticket + '/transitions', {
                method: 'POST',
                headers: _headers,
                body: buildTransitionsRequestBody(transitionId, transitionData)
            }).then(response => {
                if (response.status != 204) {
                    throw new Error('status:' + response.status);
                } else {
                    console.log(wizard.happy + `Status of ${ticket} has been changed`);
                }
            }).catch(error => {
                console.log(wizard.crying + `Status of ${ticket} has not been changed.`, error);
            });
        },
        getAllTicketsTypes: function () {
            console.log(wizard.focused + "get all tickets types");
            return fetch(_config.url + '/issuetype', {
                method: 'GET',
                headers: _headers
            }).then(response => {
                if (response.status != 200) {
                    throw new Error('status:' + response.status);
                } else {
                    console.log(wizard.happy + `Got all ticket types`);
                    return response.json();
                }
            }).catch(error => {
                console.log(wizard.crying + `Ticket types not received.`, error);
                return [];
            });
        },
        getTicketType: function (ticket) {
            console.log(wizard.focused + "get ticket type");
            return fetch(_config.url + '/issuetype/' + ticket, {
                method: 'GET',
                headers: _headers
            }).then(response => {
                if (response.status != 200) {
                    throw new Error('status:' + response.status);
                } else {
                    console.log(wizard.happy + `Got all ticket types`);
                    return response.json();
                }
            }).catch(error => {
                console.log(wizard.crying + `Ticket types not received.`, error);
                return {};
            });
        },
        assignTicketTo: function (ticket, username) {
            console.log(wizard.focused + "assign Jira ticket to the user");

            if (!username) {
                username = "";
            }

            return fetch(_config.url + '/issue/' + ticket, {
                method: 'PUT',
                headers: _headers,
                body: '{"update":{"assignee":[{"set":{"name":"' + username + '"}}]}}'
            }).then(response => {
                if (response.status != 204) {
                    throw new Error('status:' + response.status);
                } else {
                    console.log(wizard.happy + "Ticket " + ticket + " has been " + (username ? "assigned to " + username : "unassigned"));
                }
            }).catch(error => {
                console.log(wizard.crying + "Ticket " + ticket + " has not been assigned.", error);
            });
        },
        addCommentToTicket: function (ticket, comment) {
            console.log(wizard.focused + "add comment to the Jira ticket");
            return fetch(_config.url + '/issue/' + ticket + '/comment', {
                method: 'POST',
                headers: _headers,
                body: '{"body":"' + comment + '"}'
            }).then(response => {
                if (response.status != 201) {
                    throw new Error('status:' + response.status);
                } else {
                    console.log(wizard.happy + "Comment has been added to the ticket " + ticket);
                }
            }).catch(error => {
                console.log(wizard.crying + "Coment has not been added to the ticket " + ticket + ".", error);
            });
        }
    }
}