const fetch = require("node-fetch");
const Arkan = require('arkan.js').Arkan;

module.exports = function() {
    var jiraUrl = "",
        jiraUser = { username:"", password:"" },
        jiraProjectName = "",
        jiraTicketIdPattern = "",
        jenkinsUrl = "",
        jenkinsJobName = "",
        jenkinsBuildXMLUrl = "";

    return {
        setJiraUrl:function(url) {
            jiraUrl = url;
            return this;
        },
        setJiraUser:function(username, password) {
            jiraUser = { username: username, password: password };
            return this;
        },
        setJiraProjectName:function(name) {
            jiraProjectName = name;
            return this;
        },
        setJiraTicketIdPattern:function(pattern) {
            jiraTicketIdPattern = pattern;
            return this;
        },
        setJenkinsUrl:function(url) {
            jenkinsUrl = url;
            return this;
        },
        setJenkinsJobName:function(name) {
            jenkinsJobName = name;
            return this;
        },
        setJenkinsBuildXMLUrl:function(url) {
            jenkinsBuildXMLUrl = url;
            return this;
        },
        build:function() {
            if (!jiraTicketIdPattern) {
                jiraTicketIdPattern = `(${jiraProjectName}-[0-9]{0,})[^d]{0}`;
            }

            if (!jenkinsBuildXMLUrl) {
                jenkinsBuildXMLUrl = `${jenkinsUrl}/job/${jenkinsJobName}/lastBuild/api/xml`;
            }
            return {
                jira: {
                    url: jiraUrl,
                    user: jiraUser.username,
                    password: jiraUser.password,
                    project: jiraProjectName
                },
                jenkins: {
                    buildXMLUrl: jenkinsBuildXMLUrl,
                    ticketIdPattern: jiraTicketIdPattern
                }
            }
        }
    }
};