const xml = require("xml-parse");
const fetch = require("node-fetch");
const fs = require('fs');
const FormData = require("form-data")

function getChangeSetNode(nodes) {
    var node;
    for(var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if(node.type === "changeSet") {
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
        for(var j = 0; i < commit.childNodes; j++) {
            commitAttr = commit[j];
            if(commitAttr === "comment") {
                var ticketId = commitAttr.innerXML.match(reg);
                if(ticketId[0]) {
                    tickets.push(ticketId);
                }
            }
        }
    }
    return tickets;
}

function getTicketsIds(url, pattern) {
    fetch(url)
    .then(response => {
      response.text().then(data => {
        var parsedXML = xml.parse(data);
        var changeSet = getChangeSetNode(parsedXML[0].childNodes);
        var tickets = extractTicketFromCommit(changeSet.childNodes, pattern);

        return tickets;
      });
    })
    .catch(error => {
      console.log(error);
    });
    return [];
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

function updateTicketFixVersion(ticket, versionId, jiraUrl, auth) {
    var form = new FormData();
    form.append('Authorization', 'Basic '+ auth);
    form.append('Content-Type', 'application/json');
    
    fetch(jiraUrl + '/issue/' + ticket, { 
        method: 'POST',
        headers: form.getHeaders(),
        body:'{"update":{"fixVersions":[{"add":{"id":"' + versionId + '"}}]}}'
    }).then(response => {
        console.log("(•‿•)  Ticket " + ticket + " has been updated.");
    }).catch(error => {
        console.log(error);
    });
}

function updateFixVersions(config) {
    console.log("(∩｀-´)⊃━☆ﾟ.*･｡ﾟ Jenkins -> Jira Magic : update fixVersions");
    var tickets = getTicketsIds(config.jenkins.buildXMLUrl, config.git.ticketIdPattern);
    var versionName = getVersionFromPackageJson();
    var auth64 = Buffer.from(config.jira.user+':'+config.jira.password).toString('base64');
    var form = new FormData();
    form.append('Authorization', 'Basic '+ auth64);
    form.append('Content-Type', 'application/json');
    
    fetch(config.jira.url+'/version', { 
        method: 'POST',
        headers: form.getHeaders(),
        body:JSON.stringify({ 
            name:versionName,
            project:config.jira.project,
            description:config.versionData.description,
            archived:(config.versionData.archived || false),
            released:(config.versionData.released || true),
            userReleaseDate:(new Date().toISOString().substring(0,10))
        })
    }).then(response => {
        return response.json();
    }).then(json => {
        var version = JSON.parse(json);
        if(version.id) {
            tickets.forEach(ticket => {
                updateTicketFixVersion(ticket, version.id, config.jira.url, auth64);
            });
            onsole.log("(　＾∇＾)  Done.");
        } else {
            console.log("(⊙＿⊙')  Something went wrong. I didn't get version id.");
        }
    }).catch(error => {
        console.log("(⊙＿⊙')  Something went wrong. ", error);
    });
}

module.exports.updateFixVersions = updateFixVersions;
