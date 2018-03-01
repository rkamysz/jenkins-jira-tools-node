# Jenkins-Jira-Tools

## updateFixVersions

This function updates "Fix version" field in all JIRA tickets, listed in build's changelog.

### How it works:
- First, it search tickets names to update - by filtering commits messages.
- Secondly, it reads `package.json` file to get version name. If your project name contains separator "/" eg. some_organization/our_awesome_project, script will extract only the last part.
- Thirdlly, it creates new version in Jira and parse response to get version id. 
This version will be listed in JIRA's Releases page.
- In the last, step it adds received version id in all found tickets.

### Configuration:

To make function work, you need config object and pass it to the function.
The configuration object must be constructed in the following way:
```
{
    jira:{
        url:"",
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
    },
    git:{
        // This pattern will be used to get tickets ids from commits messages.
        // Mostly, ticket id is the combination of jira project name and index eg. WWW-1234
        // If it is in your case, then just replace XXXX with the proper name and it will work.
        ticketIdPattern:"(XXXX-[0-9]{0,})[\^d]*"
    },
    // These information will be used for creating a new version in Jira.
    versionData:{
        archived:false,
        released:true,
        description:""
    }
}
```
### How to use it:

Usage is very simple. You have to create some js file which you can call in jenkins pipeline step.
In most cases, this step should be triggered only when releasing from master branch.

#### JS (updateJira.js):
```
const jjt = require("jenkins-jira-tools");

jjt.updateFixVersions({
    jira:{
        url:"",
        user:"",
        password:"",
        project:""
    },
    jenkins:{
        buildXMLUrl:"<JENKINS URL>/job/<JOB_TITLE>/lastBuild/api/xml"
    },
    git:{
        ticketIdPattern:"(XXXX-[0-9]{0,})[\^d]*"
    },
    versionData:{
        archived:false,
        released:true,
        description:""
    }
});
```
#### JENKINS:
```
...
sh "node updateJira.js"
...
```
## createNewVersionInJira

### How to use it:
```
const jjt = require("jenkins-jira-tools");

var auth64 = Buffer.from(JIRA_USER + ':' + JIRA_PASSWORD).toString('base64');

jjt.createNewVersionInJira(JIRA_URL, auth64, 
    name:"awesome_stuff@1.1.1",
    project:"XXXX",
    description:"Some awesome stuff",
    archived:false,
    released:true,
    userReleaseDate:"26/Feb/2018"
});
```

## changeStatus
    WIP
## assignTo
    WIP
## addComment
    WIP


Check also

If you do not use `node.js` you can check bash version of this tool:
https://github.com/rkamysz/jenkins-jira-tools
