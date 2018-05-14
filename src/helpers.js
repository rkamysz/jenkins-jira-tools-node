module.exports.getFormatedDate = function() {
    var date = new Date().toString().split(" ");
    return [date[2],date[1],date[3]].join("/");
}

module.exports.isNumeric = function(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}