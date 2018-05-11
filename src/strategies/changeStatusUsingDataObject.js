modules.export = function changeStatusUsingDataObject(jira, tickets, data){
    if(data.status) {
        if(isNumeric(data.status)) {
            return changeStatusUsingId(jira, tickets, Number(data.status), data);
        }
        return changeStatusUsingName(jira, tickets, data.status, data);
    }
    return changeStatusUsingTypedDataObject(jira, tickets, data);
}