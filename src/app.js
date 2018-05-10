const wizard = require("./wizard.js");

function App(config) {
    let _jira = require("./jira.js")(config.jira);
    let _jenkins = require("./jenkins.js")(config.jenkins);
}

App.prototype.findTickets = function() {
    return _jenkins.getTicketsIds();
}

App.prototype.createVersion = function(data) {
    return _jira.createVersion(data);
}

App.prototype.updateFixVersions = function(tickets, version) {
    return Promise.all(tickets.map((ticket) => {
        return _jira.changeTicketFixVersion(ticket, version);
    }));
}

App.prototype.assignTo = function(tickets, username) {
    return Promise.all(tickets.map((ticket) => {
        return _jira.assignTicketTo(ticket,username);
    }));
}

App.prototype.addComment = function(tickets, comment) {
    return Promise.all(tickets.map((ticket) => {
        return _jira.addCommentToTicket(ticket, comment);
    }));
}

App.prototype.changeStatus = function(tickets, input) {
    return getStatusChangeMethod(typeof input)(_jira, tickets, input);
}

module.exports = new App(config);

function(config) {

    return {

        changeStatus:function(tickets, data) {
            var status,
                transitionData = {};

            if(typeof data === "string") {
                status = data;
            } else {
                status = data.status;
                Object.assign(transitionData, data);
            }
            
            return Promise.all(tickets.map((ticket) => {

// GET /rest/api/2/issuetype/{id}
// Returns a full representation of the issue type that has the given id.

// Responses
// STATUS 200 - application/jsonReturned if the issue type exists and is visible by the calling user.
// EXAMPLE
// {
//     "self": "http://localhost:8090/jira/rest/api/2.0/issueType/3",
//     "id": "3",
//     "description": "A task that needs to be done.",
//     "iconUrl": "http://localhost:8090/jira/images/icons/issuetypes/task.png",
//     "name": "Task",
//     "subtask": false,
//     "avatarId": 1
// }
// SCHEMA
// STATUS 404Returned if the issue type does not exist, or is not visible to the calling user.


                return _jira.getAvailableTicketTransitions(ticket)
                .then(result => { 
                    transition = result.transitions.find(t => {
                        return t.name.toLowerCase() === status.toLowerCase();
                    });
                    if(transition === undefined) {
                        throw new Error(wizard.ups + "I couldn't find status id for " + status)
                    }
                })
                .then(() => {
                    return Promise.all(tickets.map((ticket) => {
                        return _jira.changeTicketTransitions(ticket, transition.id, transitionData);
                    }));
                });
            }));

            return _jira.getAvailableTicketTransitions(tickets[0])
            .then(result => { 
                transition = result.transitions.find(t => {
                    return t.name.toLowerCase() === status.toLowerCase();
                });
                if(transition === undefined) {
                    throw new Error(wizard.ups + "I couldn't find status id for " + status)
                }
            })
            .then(() => {
                return Promise.all(tickets.map((ticket) => {
                    return _jira.changeTicketTransitions(ticket, transition.id, transitionData);
                }));
            });
        }
    }
}
