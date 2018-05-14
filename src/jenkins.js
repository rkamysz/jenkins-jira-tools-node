const xml = require("xml-parse");
const fetch = require("node-fetch");
const wizard = require("./wizard.js");

const getChangeSetNode = function (nodes) {
    let node;
    for (let i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if (node.tagName === "changeSet") {
            return node;
        }
    }
    return null;
};

const extractTicketFromCommit = function (commits, pattern) {
    var regex = new RegExp(pattern, 'g');
    var regexResult;
    var commit;
    var commitAttr;
    var tickets = [];
    for (var i = 0; i < commits.length; i++) {
        commit = commits[i];
        for (var j = 0; j < commit.childNodes.length; j++) {
            commitAttr = commit.childNodes[j];
            if (commitAttr.tagName === "comment") {
                regexResult = regex.exec(commitAttr.innerXML);
                if (regexResult !== null) {
                    tickets.push(regexResult[0]);
                }
            }
        }
    }
    return tickets;
};

const getTicketsFromChangeSet = function (changeSet, pattern) {
    let tickets = [];
    if (changeSet) {
        tickets = extractTicketFromCommit(changeSet.childNodes, pattern);
        console.log(`${wizard.happy}Found ${tickets.length} tickets`);
    } else {
        console.log(`${wizard.ups}No tickets found`);
    }
    return [];
};

function Jenkins(config) {
    if (!config) throw new Error('Missing Jenkins config.');
    let _config = config;
}

Jira.prototype.getTicketsIds = function (data) {
    console.log(`${wizard.focused}find Jira tickets in Jenkins build log.`);

    return fetch(_config.buildXMLUrl)
        .then(response => xml.parse(response.text()))
        .then(parsedXML => getChangeSetNode(parsedXML[0].childNodes))
        .then(changeSet => getTicketsFromChangeSet(changeSet, _config.ticketIdPattern))
        .catch(error => {
            console.error(wizard.crying, error);
            return [];
        });
};

module.exports = new Jenkins(config);