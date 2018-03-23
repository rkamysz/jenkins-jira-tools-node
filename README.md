# Jenkins-Jira-Tools (Gitlab)

Several tools that can speed up work by automating certain workflow processes. Jenkins -> Jira <- GitLab

## Setup
```
npm install jenkins-jira-tools --save
```

## Configuration:
```
const config = require("jenkins-jira-tools").configBuilder
.setJenkinsUrl("<JENKINS_URL>")
.setJenkinsJobName("jenkins_job_name")
.setJiraProjectName("XXXX")
.setJiraApiUrl("https://<JIRA_URL>/rest/api/latest")
.setJiraUser("username", "password")
.build();

var jjt = new JJT(config);
```
### ConfigBuilder API
#### setJiraUrl(url)
#### setJiraUser(username, password)
#### setJiraProjectName(name)
#### [optional] setJiraTicketIdPattern(pattern)
With this method you set pattern to extract ticket numbers from commits.<br>
Default value: `(${jiraProjectName}-[0-9]{0,})[^d]{0}`
#### setJenkinsUrl(url)
#### setJenkinsJobName(name)
#### [optional] setJenkinsBuildXMLUrl(url)
This method sets the url to the jenkins build XML file.<br>
Default value: `${jenkinsUrl}/job/${jenkinsJobName}/lastBuild/api/xml`
#### build()

## API
### findTickets(output)
Get tickets numbers from the jenkins job change log. The data will be saved in the array, which should be given as an argument.
### createVersion(data, setterFn)
Create new version - based on given data - in Jira. Use `versionDataBuilder` to provide proper input data. As a second argument use function to save ___version id___ as a defined variable.<br>
EXAMPLE BELOW
### updateFixVersions(tickets, versionId)
Update ___Fix Version/s___ field in given tickets.
### changeStatus(tickets, data)
Change ___Status___ of given tickets. As a `data` argument you can pass string value - status name - or use `transitionDataBuilder` to set more options.

*MAKE SURE THAT: options you want to set are available in status edit window*
EXAMPLE BELOW
### assignTo(tickets, username)
Assign selected tickets to the user. If username is *not set* or `""`, than ticket will be *unassigned*
### addComment(tickets, comment)
Add comment to tickets.

### VersionDataBuilder API
#### setDescription(value)
#### setReleased(value)
#### setArchived(value)
#### [optional] setProject(value)
Default value is taken from main config `jiraProjectName`
#### [optional] setName(value)
Default value is read from *package.json* file.
#### build()

### TransitionDataBuilder API
#### setComment(value)
#### setResolution(value)
#### setStatus(value)
#### setAssignee(value)
#### build()

## How to use it:

Usage is very simple. You have to create some js file which you can call in jenkins pipeline step.
In most cases, this step should be triggered only when releasing from **master** branch.

#### JS (updateJira.js):
```
const JJT = require("./src/index.js").JJT;

const config = require("jenkins-jira-tools").configBuilder
.setJenkinsUrl("<JENKINS_URL>")
.setJenkinsJobName("jenkins_job_name")
.setJiraProjectName("XXXX")
.setJiraApiUrl("https://<JIRA_URL>/rest/api/latest")
.setJiraUser("username", "password")
.build();

const versionData = require("jenkins-jira-tools").versionDataBuilder
.setArchived(false)
.setReleased(true)
.setDescription("New is always better")
.build();

const transitionData = require("jenkins-jira-tools").transitionDataBuilder
.setResolution("Done")
.setStatus("Closed")
.setComment("This ticket is closed. Well done!")
.build();

var versionId;
var tickets = [];
var jjt = new JJT(config);

versionIdPtr = function(value) {
    if(value) {
        versionId = value;
        return;
    } else {
        return versionId;
    }
}

jjt.findTickets(tickets)
.createVersion(versionData, versionIdPtr)
.updateFixVersions(tickets, versionIdPtr)
.changeStatus(tickets, transitionData) /* or .changeStatus(tickets, "Closed") */
.assignTo(tickets, "");

```
#### JENKINS:
```
...
sh "node updateJira.js"
...
```