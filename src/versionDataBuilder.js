module.exports = function() {
    var assignee = "",
        comment = "",
        status = "",
        resolution = "";

    return {
        setComment:function(value) {
            description = value;
            return this;
        },
        setResolution:function(value) {
            released = value;
            return this;
        },
        setStatus:function(value) {
            archived = value;
            return this;
        },
        setAssignee:function(value) {
            project = value;
            return this;
        },
        build:function() {
            return {
                assignee:assignee,
                comment:comment,
                status:status,
                resolution:resolution
            };
        }
    }
};