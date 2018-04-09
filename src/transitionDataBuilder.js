module.exports = function() {
    var assignee,
        comment,
        status,
        statusId,
        resolution;

    return {
        setComment:function(value) {
            comment = value;
            return this;
        },
        setResolution:function(value) {
            resolution = value;
            return this;
        },
        setStatus:function(value) {
            status = value;
            return this;
        },
        setStatusId:function(value) {
            statusId = value;
            return this;
        },
        setAssignee:function(value) {
            assignee = value;
            return this;
        },
        build:function() {
            var result = {};
            if(assignee) {
                result.assignee = assignee;
            }
            if(comment) {
                result.comment = comment;
            }
            if(status) {
                result.status = status;
            }
            if(resolution) {
                result.resolution = resolution;
            }
            
            return result;
        }
    }
};