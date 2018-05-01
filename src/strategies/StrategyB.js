modules.export = function(jira, tickets, statusId){
    return Promise.all(tickets.map((ticket) => {
        return jira.changeTicketTransitions(ticket, `{"id":${statusId}}`);
    }));
}