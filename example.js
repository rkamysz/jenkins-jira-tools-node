const updateFixVersions = require("jenkins-jira-tools-node");

updateFixVersions({
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
