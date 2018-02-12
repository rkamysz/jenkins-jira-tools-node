const xml = require("xml-parse");
const fetch = require("node-fetch");
const fs = require('fs');

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

function extractTicketFromCommit(commits, pattern) {
    var reg = new RegExp(pattern);
    var commit;
    var commitAttr;
    var tickets = [];
    for(var i = 0; i < commits.length; i++) {
        commit = commits[i];
        for(var j = 0; j < commit.childNodes.length; j++) {
            commitAttr = commit.childNodes[j];
            if(commitAttr.tagName === "comment") {
                var ticketId = commitAttr.innerXML.match(reg);
                if(ticketId[1]) {
                    tickets.push(ticketId[1]);
                }
            }
        }
    }
    return tickets;
}

function getTicketsIds(url, pattern) {
    return fetch(url)
    .then(response => {
        return response.text();
    }).then(data => {
        var parsedXML = xml.parse(data);
        var changeSet = getChangeSetNode(parsedXML[0].childNodes);
        if(changeSet) {
            return extractTicketFromCommit(changeSet.childNodes, pattern);
        }
        return [];
    })
    .catch(error => {
        console.error(error);
        return [];
    });
}

function getVersionFromPackageJson() {
    var content = fs.readFileSync('package.json', 'utf8');
    if(content) {
        var pckJson = JSON.parse(content);
        var reg = new RegExp('[^/]*$','g'); 
        var name = pckJson.name.match(reg);
        return name[0] + "@" + pckJson.version;
    }
}

function updateTicketFixVersion(ticket, versionId, jiraUrl, auth64) {
    console.log("Trying to update:", ticket);
    return fetch(jiraUrl + '/issue/' + ticket, { 
        method: 'PUT',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Basic ' + auth64
        },
        body:'{"update":{"fixVersions":[{"add":{"id":"' + versionId + '"}}]}}'
    }).then(response => {
        console.log("(•‿•)  Ticket " + ticket + " has been updated.");
    }).catch(error => {
        console.log("(ಥ_ಥ)  Ticket " + ticket + " has not been updated. Error:", error);
    });
}

function createNewVersionInJira(jiraUrl, auth64, data) {
    return fetch(jiraUrl + '/version', { 
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Basic ' + auth64
        },
        body:JSON.stringify(data)
    }).then(response => {
        console.log("(•‿•)  New version has been created " + data.name);
        return response.json();
    }).catch(error => {
        console.log("(ಥ_ಥ)  Version " + data.name + " has not been added. Error:", error);
    });
}

function updateJiraTickets(tickets, versionData) {
    return new Promise((resolve, reject) =>{
        if(tickets.length == 0) {
            console.log("(•‿•)  No tickets to update.");
        } else {
            console.log("We have "+ tickets.length + " tickets to update");
            if(versionData.id) {
                console.log("We have version with id:", versionData.id);
                var promise = Promise.resolve();
                tickets.forEach(ticket => {
                    promise = promise.then(() => { return updateTicketFixVersion(ticket, 
                        versionData.id, config.jira.url, auth64); });
                });
            } else {
                reject(new Error("(⊙＿⊙')  Something went wrong. I didn't get version id."));
            }
        }
        resolve();
    });
}

function getFormatedDate() {
    var date = new Date().toString().split(" ");
    return [date[2],date[1],date[3]].join("/");
}


function updateFixVersions(config) {
    console.log(" (∩｀-´)⊃━☆ﾟ.*･｡ﾟ Jenkins -> Jira Magic : update fixVersions in Jira tickets");
    var tickets = [];
    var auth64 = Buffer.from(config.jira.user+':'+config.jira.password).toString('base64');
    var versionConfig = { 
        name:getVersionFromPackageJson(),
        project:config.jira.project,
        description:config.versionData.description,
        archived:(config.versionData.archived || false),
        released:(config.versionData.released || true),
        userReleaseDate:getFormatedDate()
    }

    getTicketsIds(config.jenkins.buildXMLUrl, config.git.ticketIdPattern)
    .then(result => { tickets = result; })
    .then(() => { return createNewVersionInJira(config.jira.url, auth64, versionConfig); })
    .then(versionInfo => { return updateJiraTickets(tickets, versionInfo); })
    .then(() => {
        console.log("(　＾∇＾)  Done.");
    })
    .catch(error => {
        console.log("(⊙＿⊙')  Something went wrong. ", error);
    });
}

module.exports.updateFixVersions = updateFixVersions;
