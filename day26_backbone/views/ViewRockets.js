var RocketsView = Backbone.View.extend({

    events: {
        "click .restoreData": "restoreData",
        "click .saveData": "saveData",
        "click .removeFinished": "removeFinished",
        "click .allFinished": "allFinished",
        "click .finishedOnly": "finishedOnly",
        "click .inWorkOnly": "inWorkOnly",
        "click .allTasks": "allTasks",
        "click .toJSON": "toJSON",
        "keypress .new_todoElement": "addNewToDo"
    },

    initialize: function() {
        this.template = _.template($('#templToDoList').html());
        this.$el.html(this.template());
        this.coll = new RocketsCollection();
        this.listenTo(this.coll, "all", this.render);
        this.listenTo(this.coll, "add", this.addOne);
    },

    render: function() {
        var finished = 0;
        this.coll.each(function(obj,index){
            if(obj.get('stateLetter')=="V")
                finished++;
        });
        this.$('.rockets-count').text(this.coll.length);
        this.$('.finished').text(finished);

        this.$('.rocketsList').html("");
        for(var i=0; i<this.coll.length;i++){
            var curModel=this.coll.models[i];

            if(this.filter==undefined){
                    var view = new RocketView({model: curModel});
                    this.$('.rocketsList').append(view.render());
            } else if(this.filter=="finished"){
                if (curModel.attributes.stateLetter=="V"){
                    var view = new RocketView({model: curModel});
                    this.$('.rocketsList').append(view.render());
                }
            } else {
                if (curModel.attributes.stateLetter=="_"){
                    var view = new RocketView({model: curModel});
                    this.$('.rocketsList').append(view.render());
                }
            }
        }

        return this;
    },

    allFinished: function() {
        this.coll.finishAll();
    },

    addOne: function(model) {
        var view = new RocketView({model: model});
        this.$('.rocketsList').append(view.render());
    },

    toJSON: function() {
        var json = this.coll.toJSON();
        this.$('.json-out').html(JSON.stringify(json));
    },

    addNewToDo: function(e) {
        if(event.which === 13){
            console.log("new to do added."+this.$(".new_todoElement").val());
            this.coll.add({_do:this.$(".new_todoElement").val()})
            this.$(".new_todoElement").val("");
        }
    },

    finishedOnly: function() {
        console.log("all finished filter required");
        this.filter="finished";
        this.render();
        this.highLightFiltered(1);
    },
    inWorkOnly: function() {
        console.log("in work only filter required");
        this.filter="inWork";
        this.render();
        this.highLightFiltered(2);
    },
    allTasks: function() {
        console.log("all tasks required");
        this.filter=undefined;
        this.render();
        this.highLightFiltered(3);
    },
    highLightFiltered: function (mode) {
        function changeBorder(btn, state) {
            if(state){
                this.$(btn).css("border-color","black");
                this.$(btn).css("border-width","3px");
            } else {
                this.$(btn).css("border-width","0px");
            }
        }
        if(mode==3){
            changeBorder(".finishedOnly",false);
            changeBorder(".inWorkOnly",false);
            changeBorder(".allTasks",true);
        } else if(mode==2){
            changeBorder(".finishedOnly",false);
            changeBorder(".inWorkOnly",true);
            changeBorder(".allTasks",false);
        } else if(mode==1){
            changeBorder(".finishedOnly",true);
            changeBorder(".inWorkOnly",false);
            changeBorder(".allTasks",false);
        }
    },

    removeFinished: function() {
        console.log("remove all finished from list");
        for(var i=0; i<this.coll.length;i++){
            var curModel=this.coll.models[i];
            if (curModel.attributes.stateLetter=="V"){
                curModel.destroy();
                i--;
            }
        }
    },

    saveData: function() {
        console.log("save data request");
        this.coll.saveToDB();
    },
    restoreData: function() {
        console.log("restore data request");
        this.coll.restoreFromDB();
    }
});
