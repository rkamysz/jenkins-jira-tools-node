module.exports = function getStatusChangeMethod(type) {
    let strategies = {
        "string" : changeStatusUsingName,
        "number" : changeStatusUsingId,
        "object" : changeStatusUsingDataObject
    };
    return strategies[type] || StrategyDefault;
}