const xml = require("xml-parse");
const fetch = require("node-fetch");
const wizard = require("./wizard.js");

module.exports = function(config) {
    if (!config) {
      throw new Error('Missing jenkins config.');
    }
    
    var _config = config;

    function getChangeSetNode(nodes) {
        var node;
        for(var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if(node.tagName === "changeSet") {
                return node;
            }
        }
        return null;
    }

    function extractTicketFromCommit(commits) {
        var regex = new RegExp(_config.ticketIdPattern,'g');
        var regexResult;
        var commit;
        var commitAttr;
        var tickets = [];
        for(var i = 0; i < commits.length; i++) {
            commit = commits[i];
            for(var j = 0; j < commit.childNodes.length; j++) {
                commitAttr = commit.childNodes[j];
                if(commitAttr.tagName === "comment") {
                    regexResult = regex.exec(commitAttr.innerXML);
                    if(regexResult !== null) {
                        tickets.push(regexResult[0]);
                    }
                }
            }
        }
        return tickets;
    }
    
    return {
        getTicketsIds:function() {
            console.log(wizard.focused + "find Jira tickets in Jenkins build log.");
            return fetch(_config.buildXMLUrl)
            .then(response => {
                return response.text();
            }).then(data => {
                var parsedXML = xml.parse(data);
                var changeSet = getChangeSetNode(parsedXML[0].childNodes);
                if(changeSet) {
                    var tickets = extractTicketFromCommit(changeSet.childNodes);
                    console.log(wizard.happy + "Found " + tickets.length + " tickets");
                    return tickets;
                }
                console.log(wizard.ups + "No tickets found");
                return [];
            })
            .catch(error => {
                console.error(wizard.crying + error);
                return [];
            });
        }
    }
}