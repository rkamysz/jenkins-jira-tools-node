const findTransitionToStatus = function (transitions, statusName) {
    return transitions.find(t => {
        return t.to.name.toLowerCase() === statusName.toLowerCase();
    });
}

const getTransitionId = function (transition) {
    if (transition && transition.id) {
        return transition.id;
    }
    throw new Error("Transition ID has not been found")
}

modules.export = function changeStatusUsingName(jira, tickets, statusName, requestData) {
    return Promise.all(tickets.map((ticket) => {
        return jira.getAvailableTicketTransitions(ticket)
            .then(result => findTransitionToStatus(result.transitions, statusName))
            .then(transition => getTransitionId(transition))
            .then(id => buildTransitionsRequestBody(id, requestData))
            .then(requestBody => jira.changeTicketTransition(ticket, requestBody))
            .catch(error => { console.log("ERROR:", error); });
    }));
}