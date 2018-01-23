const xml = require("xml-parse");
const fetch = require("node-fetch");

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

function getTicketsIds(url) {
    fetch(url)
    .then(response => {
      response.text().then(data => {
        var parsedXML = xml.parse(data);
        var changeSet = getChangeSetNode(parsedXML[0].childNodes);
        var tickets = extractTicketFromCommit(changeSet.childNodes);

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
        var name = pckJson.match(reg);
        return name[0] + "@" + pckJson.version;
    }
}

function updateTicketFixVersion(ticket, versionId, user, password) {
    fetch(url+'/issue/'+ticket, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+user+':'+password
        },
        body:'{"update":{"fixVersions":[{"add":{"id":"'+versionId+'"}}]}}'
    }).then(response => {
        console.log("(•‿•)  Ticket "+ticket+" has been updated.");
    }).catch(error => {
        console.log(error);
    });
}

function updateFixVersions(config) {
    console.log("(∩｀-´)⊃━☆ﾟ.*･｡ﾟ Jenkins -> Jira Magic : update fixVersions");
    var tickets = getTicketsIds(config.jenkinsBuildXMLDataUrl);
    var versionName = getVersionFromPackageJson();
    
    //addVersionToJira
    fetch(url+'/version', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+user+':'+password
        },
        body:JSON.stringify({ 
            name:versionName, 
            description:config.versionDescription,
            project:config.project,
            archived:(config.versionArchived || false),
            released:(config.versionReleased || true),
            userReleaseDate:(new Date().toISOString().substring(0,10))
        })
    }).then(response => {
        return response.json();
    }).then(json => {
        var obj = JSON.parse(json);
        if(obj.id) {
            tickets.forEach(ticket => {
                updateTicketFixVersion(ticket, obj.id);
            });
            onsole.log("(　＾∇＾)  Done.");
        } else {
            console.log("(⊙＿⊙')  Something went wrong. I didn't get version id.");
        }
    }).catch(error => {
        console.log("(⊙＿⊙')  Something went wrong. ", error);
    });
}
module.exports = updateFixVersions;