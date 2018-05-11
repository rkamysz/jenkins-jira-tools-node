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