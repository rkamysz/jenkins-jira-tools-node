modules.export = function changeStatusUsingTypedDataObject(jira, tickets, data){
    return Promise.all(tickets.map((ticket) => {
        return jira.getTicketType(ticket)
            .then(type => {
                return getStatusChangeMethod(typeof data[type.name])(jira, tickets, data);
            })
        .catch(error => {
            console.log(wizard.crying + `Error`, error);
        });
    }));
}