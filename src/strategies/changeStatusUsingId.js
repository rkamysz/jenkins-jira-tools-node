modules.export = function changeStatusUsingId(jira, tickets, id){
    return Promise.all(tickets.map((ticket) => {
        return jira.changeTicketTransitions(ticket, `{"id":${id}}`);
    }));
}