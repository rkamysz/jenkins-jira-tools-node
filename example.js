//updateJira.js
const jjt = require("jenkins-jira-tools");

jjt.updateFixVersions({
    jira:{
        url:"",
        user:"",
        password:"",
        project:""
    },
    jenkins:{
        buildXMLUrl:"<JENKINS URL>/job/asset-export-pipeline_Publish/lastBuild/api/xml"
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

/*

In Jenkinsfile:
...
sh "node updateJira.js"
...

*/
