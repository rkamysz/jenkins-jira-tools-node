module.exports=function(t){var e={};function n(r){if(e[r])return e[r].exports;var o=e[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n.w={},n(n.s=13)}([function(t,e){t.exports={happy:"( •‿•)⊃━☆ﾟ.*･｡ﾟ  ",crying:"( ಥ_ಥ)⊃━☆ﾟ.*･｡ﾟ  ",ups:"('⊙＿⊙)⊃━☆ﾟ.*･｡ﾟ  ",hurrah:"( ＾∇＾)⊃━☆ﾟ.*･｡ﾟ  ",focused:"(∩｀-´)⊃━☆ﾟ.*･｡ﾟ  "}},function(t,e){t.exports=require("arkan.js")},function(t,e){t.exports=require("node-fetch")},function(t,e,n){const r=n(6);t.exports.getVersionFromPackageJson=function(){var t=r.readFileSync("package.json","utf8");if(t){var e=JSON.parse(t),n=new RegExp("[^/]*$","g");return e.name.match(n)[0]+"@"+e.version}},t.exports.getFormatedDate=function(){var t=(new Date).toString().split(" ");return[t[2],t[1],t[3]].join("/")},t.exports.buildTransitionsRequestBody=function(t,e){var n={transition:{id:t}};return void 0!==e.assignee&&(n.fields||(n.fields={}),n.fields.assignee={name:e.assignee}),e.resolution&&(n.fields||(n.fields={}),n.fields.resolution={name:e.resolution}),e.comment&&(n.update||(n.update={}),n.update.comment=[{add:{body:e.comment}}]),JSON.stringify(n)}},function(t,e){t.exports=require("xml-parse")},function(t,e,n){const r=n(4),o=n(2),s=n(0);t.exports=function(t){if(!t)throw new Error("Missing jenkins config.");var e=t;return{getTicketsIds:function(){return console.log(s.focused+"find Jira tickets in Jenkins build log."),o(e.buildXMLUrl).then(t=>t.text()).then(t=>{var n=function(t){for(var e,n=0;n<t.length;n++)if("changeSet"===(e=t[n]).tagName)return e;return null}(r.parse(t)[0].childNodes);if(n){var o=function(t){for(var n,r,o,s=new RegExp(e.ticketIdPattern,"g"),i=[],a=0;a<t.length;a++){r=t[a];for(var u=0;u<r.childNodes.length;u++)"comment"===(o=r.childNodes[u]).tagName&&null!==(n=s.exec(o.innerXML))&&i.push(n[0])}return i}(n.childNodes);return console.log(s.happy+"Found "+o.length+" tickets"),o}return console.log(s.ups+"No tickets found"),[]}).catch(t=>(console.error(s.crying+t),[]))}}}},function(t,e){t.exports=require("fs")},function(t,e,n){const r=n(2),o=n(0),s=n(3).buildTransitionsRequestBody,i=n(3).getVersionFromPackageJson;t.exports=function(t){if(!t)throw new Error("Missing jira config.");var e=t,n={"Content-Type":"application/json",Authorization:"Basic "+Buffer.from(e.user+":"+e.password).toString("base64")};return{createVersion:function(t){return console.log(o.focused+"create new version in Jira"),t.project=t.project||e.project,t.name=t.name||i(),r(e.url+"/version",{method:"POST",headers:n,body:JSON.stringify(t)}).then(e=>{if(201!=e.status)throw new Error("status:"+e.status);return console.log(o.happy+"New version has been created "+t.name),e.json()}).then(t=>t.id).catch(e=>{console.log(o.crying+"Version "+t.name+" has not been added.",e)})},changeTicketFixVersion:function(t,s){return console.log(o.focused+"update fixVersions in Jira tickets"),r(e.url+"/issue/"+t,{method:"PUT",headers:n,body:'{"update":{"fixVersions":[{"add":{"id":"'+s+'"}}]}}'}).then(e=>{if(204!=e.status)throw new Error("status:"+e.status);console.log(o.happy+"Ticket "+t+" has been updated with new version "+s)}).catch(e=>{console.log(o.crying+"Ticket "+t+" has not been updated.",e)})},getAvailableTicketTransitions:function(t){return r(e.url+"/issue/"+t+"/transitions",{method:"GET",headers:n}).then(t=>{if(200!=t.status)throw new Error("status:"+t.status);return t.json()}).catch(t=>{console.log(o.crying+"I couldn't get transitions.",t)})},changeTicketTransitions:function(t,i,a){return console.log(o.focused+"change Jira ticket status"),r(e.url+"/issue/"+t+"/transitions",{method:"POST",headers:n,body:s(i,a)}).then(e=>{if(204!=e.status)throw new Error("status:"+e.status);console.log(o.happy+`Status of ${t} has been changed`)}).catch(e=>{console.log(o.crying+`Status of ${t} has not been changed.`,e)})},assignTicketTo:function(t,s){return console.log(o.focused+"assign Jira ticket to the user"),s||(s=""),r(e.url+"/issue/"+t,{method:"PUT",headers:n,body:'{"update":{"assignee":[{"set":{"name":"'+s+'"}}]}}'}).then(e=>{if(204!=e.status)throw new Error("status:"+e.status);console.log(o.happy+"Ticket "+t+" has been "+(s?"assigned to "+s:"unassigned"))}).catch(e=>{console.log(o.crying+"Ticket "+t+" has not been assigned.",e)})},addCommentToTicket:function(t,s){return console.log(o.focused+"add comment to the Jira ticket"),r(e.url+"/issue/"+t+"/comment",{method:"POST",headers:n,body:'{"body":"'+s+'"}'}).then(e=>{if(201!=e.status)throw new Error("status:"+e.status);console.log(o.happy+"Comment has been added to the ticket "+t)}).catch(e=>{console.log(o.crying+"Coment has not been added to the ticket "+t+".",e)})}}}},function(t,e,n){const r=n(0);t.exports=function(t){var e=n(7)(t.jira),o=n(5)(t.jenkins);return{findTickets:function(){return o.getTicketsIds()},createVersion:function(t){return e.createVersion(t)},updateFixVersions:function(t,n){return Promise.all(t.map(t=>e.changeTicketFixVersion(t,n)))},changeStatus:function(t,n){var o,s={};return"string"==typeof n?o=n:(o=n.status,Object.assign(s,n)),e.getAvailableTicketTransitions(t[0]).then(t=>{if(transition=t.transitions.find(t=>t.name.toLowerCase()===o.toLowerCase()),void 0===transition)throw new Error(r.ups+"I couldn't find status id for "+o)}).then(()=>Promise.all(t.map(t=>e.changeTicketTransitions(t,transition.id,s))))},assignTo:function(t,n){return Promise.all(t.map(t=>e.assignTicketTo(t,n)))},addComment:function(t,n){return Promise.all(t.map(t=>e.addCommentToTicket(t,n)))}}}},function(t,e,n){const r=n(1).Arkan,o=n(1).args,s=function(t){_app=n(8)(t),_arkan=new r};s.prototype.findTickets=function(t){return _arkan.run(_app.findTickets,[],"tickets").run(e=>{e.forEach(e=>{t.push(e)})},[o("tickets")]),this},s.prototype.createVersion=function(t,e){return _arkan.run(_app.createVersion,[t],"versionId").run(t=>{e(t)},[o("versionId")]),this},s.prototype.updateFixVersions=function(t,e){var n=!isNaN(parseFloat(e))&&isFinite(e);return _arkan.run(_app.updateFixVersions,[t,n?e:o("versionId")]),this},s.prototype.changeStatus=function(t,e){return _arkan.run(_app.changeStatus,[t,e]),this},s.prototype.assignTo=function(t,e){return _arkan.run(_app.assignTo,[t,e]),this},s.prototype.addComment=function(t,e){return _arkan.run(_app.addComment,[t,e]),this},t.exports=s},function(t,e,n){n(2),n(1).Arkan;t.exports=function(){var t="",e={username:"",password:""},n="",r="",o="",s="",i="";return{setJiraApiUrl:function(e){return t=e,this},setJiraUser:function(t,n){return e={username:t,password:n},this},setJiraProjectName:function(t){return n=t,this},setJiraTicketIdPattern:function(t){return r=t,this},setJenkinsUrl:function(t){return o=t,this},setJenkinsJobName:function(t){return s=t,this},setJenkinsBuildXMLUrl:function(t){return i=t,this},build:function(){return r||(r=`(${n}-[0-9]{0,})[^d]{0}`),i||(i=`${o}/job/${s}/lastBuild/api/xml`),{jira:{url:t,user:e.username,password:e.password,project:n},jenkins:{buildXMLUrl:i,ticketIdPattern:r}}}}}},function(t,e){t.exports=function(){var t,e,n,r;return{setComment:function(t){return e=t,this},setResolution:function(t){return r=t,this},setStatus:function(t){return n=t,this},setAssignee:function(e){return t=e,this},build:function(){var o={};return t&&(o.assignee=t),e&&(o.comment=e),n&&(o.status=n),r&&(o.resolution=r),o}}}},function(t,e){t.exports=function(){var t=!1,e=!0,n="",r="",o="";return{setDescription:function(t){return n=t,this},setReleased:function(t){return e=t,this},setArchived:function(e){return t=e,this},setProject:function(t){return r=t,this},setName:function(t){return o=t,this},build:function(){return{name:o,project:r,archived:t,released:e,description:n}}}}},function(t,e,n){t.exports.versionDataBuilder=n(12)(),t.exports.transitionDataBuilder=n(11)(),t.exports.configBuilder=n(10)(),t.exports.JJT=n(9)}]);