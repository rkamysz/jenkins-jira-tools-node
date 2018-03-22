!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t.w={},t(t.s=9)}([function(e,n){e.exports={happy:"( •‿•)⊃━☆ﾟ.*･｡ﾟ  ",crying:"( ಥ_ಥ)⊃━☆ﾟ.*･｡ﾟ  ",ups:"('⊙＿⊙)⊃━☆ﾟ.*･｡ﾟ  ",hurrah:"( ＾∇＾)⊃━☆ﾟ.*･｡ﾟ  ",focused:"(∩｀-´)⊃━☆ﾟ.*･｡ﾟ  "}},function(e,n){e.exports=require("node-fetch")},function(e,n){e.exports=require("fs")},function(e,n,t){const o=t(2);e.exports.getVersionFromPackageJson=function(){var e=o.readFileSync("package.json","utf8");if(e){var n=JSON.parse(e),t=new RegExp("[^/]*$","g");return n.name.match(t)[0]+"@"+n.version}},e.exports.getFormatedDate=function(){var e=(new Date).toString().split(" ");return[e[2],e[1],e[3]].join("/")},e.exports.buildTransitionsRequestBody=function(e,n){var t={transition:{id:e}};return n.assignee&&(t.fields||(t.fields={}),t.fields.assignee={name:n.assignee}),n.resolution&&(t.fields||(t.fields={}),t.fields.resolution={name:n.resolution}),n.comment&&(t.update={comment:[{add:{body:n.comment}}]}),JSON.stringify(t)}},function(e,n,t){const o=t(1),r=t(0),s=t(3).buildTransitionsRequestBody;e.exports=function(e){if(!e)throw new Error("Missing jira config.");return _config=e,_auth64=Buffer.from(_config.user+":"+_config.password).toString("base64"),_headers={"Content-Type":"application/json",Authorization:"Basic "+_auth64},{createVersion:function(e){return console.log(r.focused+"create new version in Jira"),o(_config.url+"/version",{method:"POST",headers:_headers,body:JSON.stringify(e)}).then(n=>{if(201!=n.status)throw new Error("status:"+n.status);return console.log(r.happy+"New version has been created "+e.name),n.json()}).catch(n=>{console.log(r.crying+"Version "+e.name+" has not been added.",n)})},changeTicketFixVersion:function(e,n){return console.log(r.focused+"update fixVersions in Jira tickets"),o(_config.url+"/issue/"+e,{method:"PUT",headers:_headers,body:'{"update":{"fixVersions":[{"add":{"id":"'+n+'"}}]}}'}).then(t=>{if(204!=t.status)throw new Error("status:"+t.status);console.log(r.happy+"Ticket "+e+" has been updated with new version "+n)}).catch(n=>{console.log(r.crying+"Ticket "+e+" has not been updated.",n)})},getAvailableTicketTransitions:function(e){return o(_config.url+"/issue/"+e+"/transitions",{method:"GET",headers:_headers}).then(e=>{if(200!=e.status)throw new Error("status:"+e.status);return e.json()}).catch(e=>{console.log(r.crying+"I couldn't get transitions.",e)})},changeTicketTransitions:function(e,n,t){return console.log(r.focused+"change Jira ticket status"),o(_config.url+"/issue/"+e+"/transitions",{method:"POST",headers:_headers,body:s(n,t)}).then(n=>{if(204!=n.status)throw new Error("status:"+n.status);console.log(r.happy+`Status of ${e} has been changed`)}).catch(n=>{console.log(r.crying+`Status of ${e} has not been changed.`,n)})},assignTicketTo:function(e,n){return console.log(r.focused+"assign Jira ticket to the user"),n||(n=""),o(_config.url+"/issue/"+e,{method:"PUT",headers:_headers,body:'{"update":{"assignee":[{"set":{"name":"'+n+'"}}]}}'}).then(t=>{if(204!=t.status)throw new Error("status:"+t.status);console.log(r.happy+"Ticket "+e+" has been assigneed to "+n)}).catch(n=>{console.log(r.crying+"Ticket "+e+" has not been assigned.",n)})},addCommentToTicket:function(e,n){return console.log(r.focused+"add comment to the Jira ticket"),o(_config.url+"/issue/"+e+"/comment",{method:"POST",headers:_headers,body:'{"body":"'+n+'"}'}).then(n=>{if(201!=n.status)throw new Error("status:"+n.status);console.log(r.happy+"Comment has been added to the ticket "+e)}).catch(n=>{console.log(r.crying+"Coment has not been added to the ticket "+e+".",n)})}}}},function(e,n){e.exports=require("xml-parse")},function(e,n,t){const o=t(5),r=t(1),s=t(0);e.exports=function(e){if(!e)throw new Error("Missing jenkins config.");return _config=e,{getTicketsIds:function(){return console.log(s.focused+"find Jira tickets in Jenkins build log."),r(_config.buildXMLUrl).then(e=>e.text()).then(e=>{var n=function(e){for(var n,t=0;t<e.length;t++)if("changeSet"===(n=e[t]).tagName)return n;return null}(o.parse(e)[0].childNodes);return n?function(e){for(var n,t,o,r=new RegExp(_config.ticketIdPattern,"g"),s=[],i=0;i<e.length;i++){t=e[i];for(var a=0;a<t.childNodes.length;a++)"comment"===(o=t.childNodes[a]).tagName&&null!==(n=r.exec(o.innerXML))&&s.push(n[0])}return s}(n.childNodes):[]}).catch(e=>(console.error(e),[]))}}}},function(e,n,t){const o=t(0);e.exports=function(e){return _jenkins=t(6)(e.jenkins),_jira=t(4)(e.jira),{findTickets:function(e){return _jenkins.getTicketsIds().then(e=>{e})},createVersion:function(e,n){return _jira.createVersion(e).then(e=>{e})},updateFixVersions:function(e,n){return Promise.all(e.map(e=>_jira.changeTicketFixVersion(e,n)))},changeStatus:function(e,n){return _jira.getAvailableTicketTransitions(e[0]).then(e=>{if(transition=e.transitions.find(e=>e.name.toLowerCase()===status.toLowerCase()),void 0===transition)throw new Error(o.ups+"I couldn't find status id for "+n.status)}).then(()=>Promise.all(e.map(e=>_jira.changeTicketTransitions(e,transition.id,n))))},assignTo:function(e,n){return Promise.all(e.map(e=>_jira.assignTicketTo(e,n)))},addComment:function(e,n){return Promise.all(e.map(e=>_jira.addCommentToTicket(e,n)))}}}},function(e,n){e.exports=require("arkan.js")},function(e,n,t){const o=t(8);e.exports=function(e){return _app=t(7)(e),_arkan=new o,{findTickets:function(e){return _arkan.add(_app.findTickets,e),this},createVersion:function(e,n){return _arkan.add(_app.createVersion,e,n),this},updateFixVersions:function(e,n){return _arkan.add(_app.updateFixVersions,e,n),this},changeStatus:function(e,n){return _arkan.add(_app.changeStatus,e,n),this},assignTo:function(e,n){return _arkan.add(_app.assignTo,e,n),this},addComment:function(e,n){return _arkan.add(_app.addComment,e,n),this}}}}]);