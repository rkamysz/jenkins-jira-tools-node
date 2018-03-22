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
            var status,
                transitionData = {};

            if(typeof data === "string") {
                status = data;
            } else {
                status = data.status;
                Object.assign(transitionData, data);
                console.log(transitionData)
            }
            
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
