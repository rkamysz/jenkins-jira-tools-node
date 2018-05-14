module.exports = {
    getRequestBody: function (username) {
        if (!username) {
            username = "";
        }
        return `{"update":{"assignee":[{"set":{"name":"${username}"}}]}}`;
    }
};