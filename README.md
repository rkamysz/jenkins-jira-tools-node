# Jenkins-Jira-Tools

## Setup
```
npm install jenkins-jira-tools --save
```

## Configuration:
```
{
    jira:{
        // Jira API url
        url:"https://<URL>/rest/api/latest",
        // user which has rights to create versions and moderate issues
        user:"",
        password:"",
        // project name in JIRA
        project:""
    },
    jenkins:{
        // url to Jenkins job build.xml file. 
        // This XML is nessary to get all commits messages from build's changelog.
        // Dunno if this path is dependent on the Jenkins version.
        // It should work if you fill <JENKINS_URL> and <JOB_TITLE>
        buildXMLUrl:"<JENKINS_URL>/job/<JOB_TITLE>/lastBuild/api/xml"
        // This pattern will be used to get tickets ids from the commits.
        // Mostly, ticket id is the combination of jira project name and index eg. WWW-1234
        // If it is in your case, then just replace XXXX with the proper name and it will work.
        ticketIdPattern:"(XXXX-[0-9]{0,})[\^d]*"
    },
}
```
## API
### findTickets(output)
### createVersion(data, output)
### updateFixVersions(tickets, data)
### changeStatus(tickets, data)
### assignTo(tickets, username)
### addComment(tickets, comment)

## How to use it:

Usage is very simple. You have to create some js file which you can call in jenkins pipeline step.
In most cases, this step should be triggered only when releasing from master branch.

#### JS (updateJira.js):
```
const jjt = require("jenkins-jira-tools")({
    jira:{
        url:"",
        user:"",
        password:"",
        project:""
    },
    jenkins:{
        buildXMLUrl:"<JENKINS URL>/job/<JOB_TITLE>/lastBuild/api/xml",
        ticketIdPattern:"(XXXX-[0-9]{0,})[\^d]*"
    }
});



jjt.findTickets().updateFixVersions({
    archived:false,
    released:true,
    description:"New is always better"
}).unassign().addComment("It's alive").changeStatus("closed");

```
#### JENKINS:
```
...
sh "node updateJira.js"
...
```
