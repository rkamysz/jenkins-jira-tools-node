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
    return [];
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
        return extractTicketFromCommit(changeSet.childNodes, pattern);
    })
    .catch(error => {
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
    fetch(jiraUrl + '/issue/' + ticket, { 
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Basic ' + auth64
        },
        body:'{"update":{"fixVersions":[{"add":{"id":"' + versionId + '"}}]}}'
    }).then(response => {
        console.log("(•‿•)  Ticket " + ticket + " has been updated.");
    }).catch(error => {
        console.log(error);
    });
}

function getFormatedDate() {
    var date = new Date().toString().split(" ");
    return [date[2],date[1],date[3]].join("/");
  }

function updateFixVersions(config) {
    console.log("(∩｀-´)⊃━☆ﾟ.*･｡ﾟ Jenkins -> Jira Magic : update fixVersions");
    var tickets = [];
    var versionName = getVersionFromPackageJson();
    var auth64 = Buffer.from(config.jira.user+':'+config.jira.password).toString('base64');
    getTicketsIds(config.jenkins.buildXMLUrl, config.git.ticketIdPattern).then(result => {
        tickets = result;
    }).then(() =>{
        fetch(config.jira.url+'/version', { 
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':'Basic ' + auth64
            },
            body:JSON.stringify({ 
                name:versionName,
                project:config.jira.project,
                description:config.versionData.description,
                archived:(config.versionData.archived || false),
                released:(config.versionData.released || true),
                userReleaseDate:getFormatedDate()
            })
        }).then(response => {
            return response.json();
        }).then(versionData => {
            if(versionData.id) {
                tickets.forEach(ticket => {
                    updateTicketFixVersion(ticket, versionData.id, config.jira.url, auth64);
                });
                console.log("(　＾∇＾)  Done.");
            } else {
                console.log("(⊙＿⊙')  Something went wrong. I didn't get version id.");
            }
        }).catch(error => {
            console.log("(⊙＿⊙')  Something went wrong. ", error);
        });
    });
}

module.exports.updateFixVersions = updateFixVersions;
