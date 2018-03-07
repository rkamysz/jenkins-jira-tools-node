const xml = require("xml-parse");
const fetch = require("node-fetch");
const fs = require('fs');
const wizard = {
    happy:"( •‿•)⊃━☆ﾟ.*･｡ﾟ  ",
    crying:"( ಥ_ಥ)⊃━☆ﾟ.*･｡ﾟ  ",
    ups:"('⊙＿⊙)⊃━☆ﾟ.*･｡ﾟ  ",
    hurrah:"( ＾∇＾)⊃━☆ﾟ.*･｡ﾟ  ",
    dont_you_mess_with_the_force:"(∩｀-´)⊃━☆ﾟ.*･｡ﾟ  "
}

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
    var regex = new RegExp(pattern,'g');
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

function getTicketsIds(url, pattern) {

    return Promise.resolve(["HTML-3720"]);

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
    return fetch(jiraUrl + '/issue/' + ticket, { 
        method: 'PUT',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Basic ' + auth64
        },
        body:'{"update":{"fixVersions":[{"add":{"id":"' + versionId + '"}}]}}'
    }).then(response => {
        console.log(wizard.happy + "Ticket " + ticket + " has been updated with new version " + versionId);
    }).catch(error => {
        console.log(wizard.crying + "Ticket " + ticket + " has not been updated. Error:", error);
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
        console.log(wizard.happy + "New version has been created " + data.name);
        return response.json();
    }).catch(error => {
        console.log(wizard.crying + "Version " + data.name + " has not been added. Error:", error);
    });
}

function updateJiraTickets(tickets, versionId, jiraUrl, auth64) {
    return Promise.all(tickets.map((ticket) => {
        return updateTicketFixVersion(ticket, versionId, jiraUrl, auth64);
    }));
}

function getFormatedDate() {
    var date = new Date().toString().split(" ");
    return [date[2],date[1],date[3]].join("/");
}

function updateFixVersions(config) {
    console.log(wizard.dont_you_mess_with_the_force + "Jenkins -> Jira Magic : update fixVersions in Jira tickets");
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
    .then(versionInfo => { 
        if(versionInfo.id) {
            return versionInfo.id;
        } else {
            throw new Error(wizard.ups + "Something went wrong. I didn't get version id.")
        }
    })
    .then(versionId => {
        if(tickets.length == 0) {
            console.log(wizard.happy + "No tickets to update.");
        } else {
            console.log(wizard.happy + "We have "+ tickets.length + " ticket(s) to update");
            return updateJiraTickets(tickets, versionId, config.jira.url, auth64); 
        } 
    })
    .then(() => {
        console.log(wizard.hurrah + "Done.");
    })
    .catch(error => {
        console.log(wizard.ups + "Something went wrong. ", error);
    });
}


function getAvailableTicketTransitions(jiraUrl, auth64, ticket) {
    return fetch(jiraUrl + '/issue/' + ticket + '/transitions', { 
        method: 'GET',
        headers: {
            'Content-Type':'application/json',
            'Authorization':'Basic ' + auth64
        }
    }).then(response => {
        return response.json();
    }).catch(error => {
        console.log(wizard.crying + "I couldn't get transitions. Error:", error);
    });
}

function changeStatus(config, transitionData) {
    console.log(wizard.dont_you_mess_with_the_force + "Jenkins -> Jira Magic : change status of the Jira tickets");
    var tickets = [];
    var auth64 = Buffer.from(config.jira.user+':'+config.jira.password).toString('base64');
    var transition = -1;

    getTicketsIds(config.jenkins.buildXMLUrl, config.git.ticketIdPattern)
    .then(result => { 
        tickets = result;
        return getAvailableTicketTransitions(config.jira.url, auth64, tickets[0]);
    })
    .then(result => { 
        transition = result.transitions.find(t => {
            return t.name.toLowerCase() === transitionData.status.toLowerCase();
        });
        if(transition === undefined) {
            throw new Error(wizard.ups + "I couldn't find statusID for " + transitionData.status)
        }

        // need some request Body builder :)

    })
    .then(() => {

        // {
        //     "update": {
        //         "comment": [
        //             {
        //                 "add": {
        //                     "body": "${transitionData.comment}"
        //                 }
        //             }
        //         ]
        //     },
        //     "fields": {
        //         "assignee": {
        //             "name": "${transitionData.assignee}"
        //         },
        //         "resolution": {
        //             "name": "${transitionData.resolution}"
        //         }
        //     },
        //     "transition": {
        //         "id": "${transition.id}"
        //     }
        // }

        return Promise.all(tickets.map((ticket) => {
            return fetch(config.jira.url + '/issue/' + ticket + '/transitions', { 
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Basic ' + auth64
                },
                body:`{
                    "fields": {
                        "resolution": {
                            "name": "${transitionData.resolution}"
                        }
                    },
                    "transition": {
                        "id": "${transition.id}"
                    }
                }`
            }).then(response => {
                console.log(wizard.happy + `Status of ${ticket} has been changed`);
            }).catch(error => {
                console.log(wizard.crying + `Status of ${ticket} has not been changed. Error:`, error);
            });
        }));
    })
    .then(() => {
        console.log(wizard.hurrah + "Done.");
    })
    .catch(error => {
        console.log(wizard.ups + "Something went wrong. ", error);
    });
}

function assignTo(config, username) {
    console.log(wizard.dont_you_mess_with_the_force + "Jenkins -> Jira Magic : assign Jira ticket to the user");
    var tickets = [];
    var auth64 = Buffer.from(config.jira.user+':'+config.jira.password).toString('base64');

    getTicketsIds(config.jenkins.buildXMLUrl, config.git.ticketIdPattern)
    .then(result => { tickets = result; })
    .then(() => {
        return Promise.all(tickets.map((ticket) => {
            return fetch(config.jira.url + '/issue/' + ticket, { 
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Basic ' + auth64
                },
                body:'{"update":{"assignee":[{"set":{"name":"' + username + '"}}]}}'
            }).then(response => {
                console.log(wizard.happy + "Ticket " + ticket + " has been assigneed to " + username);
            }).catch(error => {
                console.log(wizard.crying + "Ticket " + ticket + " has not been assigned. Error:", error);
            });
        }));
    })
    .then(() => {
        console.log(wizard.hurrah + "Done.");
    })
    .catch(error => {
        console.log(wizard.ups + "Something went wrong. ", error);
    });
}

function addComment(config, comment) {
    console.log(wizard.dont_you_mess_with_the_force + "Jenkins -> Jira Magic : add comment to the Jira ticket");
    var tickets = [];
    var auth64 = Buffer.from(config.jira.user+':'+config.jira.password).toString('base64');

    getTicketsIds(config.jenkins.buildXMLUrl, config.git.ticketIdPattern)
    .then(result => { tickets = result; })
    .then(() => {
        return Promise.all(tickets.map((ticket) => {
            return fetch(config.jira.url + '/issue/' + ticket + '/comment', { 
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Authorization':'Basic ' + auth64
                },
                body:'{"body":"' + comment + '"}'
            }).then(response => {
                console.log(wizard.happy + "Comment has been added to the ticket " + ticket);
            }).catch(error => {
                console.log(wizard.crying + "Coment has not been added to the ticket " + ticket + ". Error:", error);
            });
        }));
    })
    .then(() => {
        console.log(wizard.hurrah + "Done.");
    })
    .catch(error => {
        console.log(wizard.ups + "Something went wrong. ", error);
    });
}

module.exports.updateFixVersions = updateFixVersions;
module.exports.createNewVersionInJira = createNewVersionInJira;
module.exports.changeStatus = changeStatus;
module.exports.assignTo = assignTo;
module.exports.addComment = addComment;
