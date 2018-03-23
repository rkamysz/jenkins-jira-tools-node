module.exports = function() {
    var archived = false,
        released = true,
        description = "",
        project = "",
        name = "";

    return {
        setDescription:function(value) {
            description = value;
            return this;
        },
        setReleased:function(value) {
            released = value;
            return this;
        },
        setArchived:function(value) {
            archived = value;
            return this;
        },
        setProject:function(value) {
            project = value;
            return this;
        },
        setName:function(value) {
            name = value;
            return this;
        },
        build:function() {
            return {
                name:name,
                project:project,
                archived:archived,
                released:released,
                description:description
            };
        }
    }
};