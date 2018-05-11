modules.export = function changeStatusUsingId(jira, tickets, id, requestData){
    let requestBody = buildTransitionsRequestBody(id, requestData);
    return Promise.all(tickets.map((ticket) => {
        return jira.changeTicketTransitions(ticket, requestBody);
    }));
}