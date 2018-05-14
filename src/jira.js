const jiraFetch = require("./jiraFetch.js");
const wizard = require("./wizard.js");
const createVersionHelpers = require('./helpers/createVersionHelpers.js');
const assignTicketHelpers = require('./helpers/assignTicketHelpers.js');
const changeTicketTransitionsHelpers = require('./helpers/changeTicketTransitionsHelpers.js');

function Jira(config) {
    if (!config) {
        throw new Error('Missing JIRA config.');
    }
    let _config = config,
        _jiraFetch = new JiraFetch(_config.user, _config.password, _config.url);
}

Jira.prototype.createVersion = function (data) {
    console.log(`${wizard.focused}create new version in Jira`);

    return _jiraFetch.post('/version', createVersionHelpers.getRequestBody(data), 201)
        .then(result => createVersionHelpers.getVersionId(result))
        .catch(error => console.log(`${wizard.crying} Version ${data.name} has not been added. `, error));
};

Jira.prototype.changeTicketFixVersion = function (ticket, versionId) {
    console.log(`${wizard.focused}update fixVersions in Jira tickets`);

    return _jiraFetch.put(`/issue/${ticket}`, `{"update":{"fixVersions":[{"add":{"id":"${versionId}"}}]}}`, 204)
        .then(response => console.log(`${wizard.happy}Ticket ${ticket} has been updated with new version ${versionId}`))
        .catch(error => console.log(`${wizard.crying}Ticket ${ticket} has not been updated.`, error));
}

Jira.prototype.getTicketTransitions = function (ticket) {
    return _jiraFetch.get(`/issue/${ticket}/transitions`, "", 200)
        .catch(error => console.log(`${wizard.crying}I couldn't get transitions.`, error));
}

Jira.prototype.changeTicketTransitions = function (ticket, transitionId, transitionData) {
    console.log(`${wizard.focused}change Jira ticket status`);

    return _jiraFetch.post(`/issue/${ticket}/transitions`, changeTicketTransitionsHelpers.getRequestBody(transitionId, transitionData), 204)
        .catch(error => console.log(`${wizard.crying}Status of ${ticket} has not been changed.`, error));
}

Jira.prototype.getAllTicketsTypes = function () {
    console.log(`${wizard.focused}get all tickets types`);

    return _jiraFetch.get('/issuetype', "", 200)
        .catch(error => {
            console.log(`${wizard.crying} Ticket types not received.`, error);
            return [];
        });
}

Jira.prototype.getTicketType = function (ticket) {
    console.log(`${wizard.focused}get ticket type`);

    return _jiraFetch.get(`/issuetype/${ticket}`, "", 200)
        .catch(error => {
            console.log(`${wizard.crying}Ticket types not received.`, error);
            return {};
        });
}

Jira.prototype.assignTicketTo = function (ticket, username) {
    console.log(`${wizard.focused}assign Jira ticket to the user`);

    return _jiraFetch.put(`/issue/${ticket}`, assignTicketHelpers.getRequestBody(username), 204)
        .catch(error => console.log(`${wizard.crying}Ticket ${ticket} has not been assigned.`, error));
}

Jira.prototype.addCommentToTicket = function (ticket, comment) {
    console.log(`${wizard.focused}add comment to the Jira ticket`);

    return _jiraFetch.post(`/issue/${ticket}/comment`, `{"body":"${comment}"}`, 201)
        .catch(error => console.log(wizard.crying + "Coment has not been added to the ticket " + ticket + ".", error));
}

module.exports = new Jira(config);