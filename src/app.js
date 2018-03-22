const wizard = require("./wizard.js");

module.exports = function(config) {
    
    var _jira = require("./jira.js")(config.jira);
    var _jenkins = require("./jenkins.js")(config.jenkins);

    return {
        findTickets:function() {
            return _jenkins.getTicketsIds();//.then(result => { output(result); });
        },
        createVersion:function(data){
            return _jira.createVersion(data);//.then(result => { output(result); });
        },
        updateFixVersions:function(tickets, versionId) {
            return Promise.all(tickets.map((ticket) => {
                return _jira.changeTicketFixVersion(ticket, versionId);
            }));
        },
        changeStatus:function(tickets, data) {
            return _jira.getAvailableTicketTransitions(tickets[0])
            .then(result => { 
                transition = result.transitions.find(t => {
                    return t.name.toLowerCase() === status.toLowerCase();
                });
                if(transition === undefined) {
                    throw new Error(wizard.ups + "I couldn't find status id for " + data.status)
                }
            })
            .then(() => {
                return Promise.all(tickets.map((ticket) => {
                    return _jira.changeTicketTransitions(ticket, transition.id, data);
                }));
            });
        },
        assignTo:function(tickets, username) {
            return Promise.all(tickets.map((ticket) => {
                return _jira.assignTicketTo(ticket,username);
            }));
        },
        addComment:function(tickets, comment) {
            return Promise.all(tickets.map((ticket) => {
                return _jira.addCommentToTicket(ticket, comment);
            }));
        }
    }
}
