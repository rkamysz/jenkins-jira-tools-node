modules.export = function changeStatusUsingDataObject(jira, tickets, data){
    if(data.status) {
        if(isNumeric(data.status)) {
            return changeStatusUsingId(jira, tickets, Number(data.status));
        } 
        return changeStatusUsingName(jira, tickets, data.status);
    } else {
        jira.getAllTicketsTypes()
        .then(types => {
            return Promise.all(tickets.map((ticket) => {
                return jira.getTicketType(ticket)
                .then(type => {
                    if(data[type.name]) {
                        return getStatusChangeMethod(typeof data[type.name])(jira, tickets, data);
                    }
                })
                .catch(error => {
                    console.log(wizard.crying + `Ticket types not received.`, error);
                });
            }));
        })
    }
}

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