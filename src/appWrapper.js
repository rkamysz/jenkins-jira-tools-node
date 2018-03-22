const Arkan = require('arkan.js').Arkan;
const args = require('arkan.js').args;

const JJT = function (config) {
    _app = require("./app.js")(config);
    _arkan = new Arkan();
}
JJT.prototype.findTickets = function (output) {
    _arkan.run(_app.findTickets, [], "tickets")
    .run((tickets) => {
        tickets.forEach(ticket => {
            output.push(ticket);
        });
    },[args("tickets")]);
    return this;
}
JJT.prototype.createVersion = function (data, output) {
    _arkan.run(_app.createVersion, [data], "versionId")
    .run((versionId) => {
        output(versionId);
    },[args("versionId")]);
    return this;
}
JJT.prototype.updateFixVersions = function (tickets, versionId) {
    var isNumeric = !isNaN(parseFloat(versionId)) && isFinite(versionId);
    _arkan.run(_app.updateFixVersions, [tickets, isNumeric ? versionId : args("versionId")]);
    return this;
}
JJT.prototype.changeStatus = function (tickets, data) {
    _arkan.run(_app.changeStatus, [tickets, data]);
    return this;
}
JJT.prototype.assignTo = function (tickets, username) {
    _arkan.run(_app.assignTo, [tickets, username]);
    return this;
}
JJT.prototype.addComment = function (tickets, comment) {
    _arkan.run(_app.addComment, [tickets, comment]);
    return this;
}

module.exports = JJT;