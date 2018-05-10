module.exports = function getStatusChangeMethod(type) {
    let strategies = {
        "string" : StrategyA,
        "number" : StrategyB,
        "object" : StrategyC
    };
    return strategies[type] || StrategyDefault;
}