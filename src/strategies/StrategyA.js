const findTransitionToStatus = function(transitions, statusName) {
    return transitions.find(t => {
        return t.to.name.toLowerCase() === statusName.toLowerCase();
    });
}

modules.export = function(jira, tickets, statusName){
    return Promise.all(tickets.map((ticket) => {
        return jira.getAvailableTicketTransitions(ticket)
        .then((result) => findTransitionToStatus(result.transitions, statusName))
        .then((transition) => jira.changeTicketTransitions(ticket, `{"id":${transition.id}}`));
    }));
}