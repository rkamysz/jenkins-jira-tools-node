const fetch = require("node-fetch");

module.exports = function() {
    return {
    validateString:function (property) {
        if (property === undefined || property.length == 0) {
            validationErrors.push(property + " is not set");
        }
        return Promise.resolve();
    },

    validateUrl:function (url) {
        return fetch(url, {
            method: 'GET'
        }).then(response => {
            if (response.status != 200) {
                throw new Error();
            }
        }).catch(error => {
            validationErrors.push(jenkinsBuildXMLUrl + " is a wrong URL");
        });
    }
}
}