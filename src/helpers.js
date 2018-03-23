const fs = require('fs');

module.exports.getVersionFromPackageJson = function() {
    var content = fs.readFileSync('package.json', 'utf8');
    if(content) {
        var pckJson = JSON.parse(content);
        var reg = new RegExp('[^/]*$','g'); 
        var name = pckJson.name.match(reg);
        return name[0] + "@" + pckJson.version;
    }
};

module.exports.getFormatedDate = function() {
    var date = new Date().toString().split(" ");
    return [date[2],date[1],date[3]].join("/");
}

module.exports.buildTransitionsRequestBody = function(id, data) {
    var body = {
        transition:{ id: id }
    };

    if(data.assignee !== undefined) {
        if(!body.fields) {
            body.fields = {};
        }
        body.fields.assignee = { name:data.assignee };
    }
    
    if(data.resolution) {
        if(!body.fields) {
            body.fields = {};
        }
        body.fields.resolution = { name:data.resolution };
    }
    
    if(data.comment) {
        if(!body.update) {
            body.update = {};
        }
        body.update.comment = [{
            add:{ body:data.comment }
        }];
    }
    return JSON.stringify(body);
}