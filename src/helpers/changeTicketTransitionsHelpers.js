module.exports = {
    getRequestBody: function (id, data) {
        var body = {
            transition: { id: id },
            fields: {},
            update: {}
        };
        if (data) {
            if (data.assignee !== undefined) {
                body.fields.assignee = { name: data.assignee };
            }

            if (data.resolution) {
                body.fields.resolution = { name: data.resolution };
            }

            if (data.comment) {
                body.update.comment = [{
                    add: { body: data.comment }
                }];
            }
        }
        return JSON.stringify(body);
    }
};
