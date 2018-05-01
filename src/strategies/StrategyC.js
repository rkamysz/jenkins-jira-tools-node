const getStrategy = function(type) {
    let strategies = {
        "string" : StrategyA,
        "number" : StrategyB
    };
    return strategies[type] || StrategyDefault;
}

e = function(jira, tickets, data) {
    
}

modules.export = function(jira, tickets, data){
    let strategy = getStrategy(typeof data.status);
    
    return strategy(jira, tickets, data);
}