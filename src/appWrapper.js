const Arkan = require('arkan.js').Arkan;

const JJT = function (config) {
    _app = require("./app.js")(config);
    _arkan = new Arkan();
}
JJT.prototype.findTickets = function (output) {
    _arkan.run(_app.findTickets, [output]);
    return this;
}
JJT.prototype.createVersion = function (data, output) {
    _arkan.run(_app.createVersion, [data, output]);
    return this;
}
JJT.prototype.updateFixVersions = function (tickets, data) {
    _arkan.run(_app.updateFixVersions, [tickets, data]);
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