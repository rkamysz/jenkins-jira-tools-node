const fs = require('fs');

module.exports = {
    getVersionId: function (result) {
        if (result.id) {
            return result.id;
        }
        throw new Error(`'id' not found in requests result: ${result}`);
    },
    getVersionFromPackageJson: function () {
        var content = fs.readFileSync('package.json', 'utf8');
        if (content) {
            var pckJson = JSON.parse(content);
            var reg = new RegExp('[^/]*$', 'g');
            var name = pckJson.name.match(reg);
            return name[0] + "@" + pckJson.version;
        }
    },
    getRequestBody: function (data) {
        data.project = data.project || _config.project;
        data.name = data.name || this.getVersionFromPackageJson();
        return JSON.stringify(data);
    }
};