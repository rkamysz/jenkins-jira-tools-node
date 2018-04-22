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

App.prototype.changeStatus = function(tickets, ...data) {
    /*
        data:
            >check if data is string (A)|number (B)|object (C) (0)

            - STRING eg. "closed" (A)
            -------------------------
                >find transition id by string
                    |_ OK: (B)
                        >build transition DO
                        >iterate through tickets and apply transition change
                            |_OK: log ok
                            |_NO: log error
                    |_ NO: ERROR

            - NUMBER eg. 123456
            -------------------
                (B)
            
            - OBJECT { comment:"", resolution:"", status:"Closed", //1234 assignee:"" } || 
                     { "Task":{ ... }, "Bug":{ ... }} ||
                     { "Task":"Closed", "Bug":"Close" } ||
                     { "Task":12345, "Bug":67890 } (C)
            ---------------------------------------------------------------------------
                >check if object contains "status" key
                    |_YES: (3)
                        >check if value is numeric
                            |_YES: 
                                (B)
                            |_NO: 
                                >isString
                                    |_YES:
                                        (A)
                                    |_NO: ERROR
                    |_NO:
                        >find ticket types
                        >iterate through tickets
                            >grab ticket type
                            >check if object contains type - key
                                |_YES:
                                    >check if data is string (A)|number (B)|object (C)
                                    >build transition DO
                                    >apply transition change
                                |_NO:
                                    >log error
                            |_NO: 
                                ERROR
     */
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
