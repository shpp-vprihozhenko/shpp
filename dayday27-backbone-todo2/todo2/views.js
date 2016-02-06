/**
 * Created by Uzer on 04.02.2016.
 */
var TodoView = Backbone.View.extend({

    events: {
        'click .chkState':  'changeState',
        'click .deleteRow':  'deleteRow',
        'blur .todoText': 'editValue',
        "keypress .todoText": "finEditDo"

    },
    initialize: function () {
        this.template = _.template($('#templToDo').html());
        this.listenTo(this.model,'change', this.render);
        this.listenTo(this.model,'destroy', this.remove);
    },
    render: function () {
        var view = this.template(this.model.toJSON());
        this.$el.html(view);
        return this.$el;
    },
    deleteRow: function() {
        this.model.destroy();
    },
    editValue: function () {
        this.model.set({
            doText: this.$('.todoText').text()
        });
    },
    finEditDo: function(e){
        if(e.keyCode == 13){
            this.model.set({
                doText: this.$('.todoText').text()
            });
        }
    },
    changeState: function(){
        if(this.model.attributes.state=='inProgress'){
            this.model.set("state", 'finished');
        } else {
            this.model.set("state", 'inProgress');
        }
        this.render();
    }
});


var TodoListView = Backbone.View.extend({

    events: {
        "click .restoreData": "restoreData",
        "click .saveData": "saveData",
        "click .removeFinished": "removeFinished",
        "click .finishAll": "finishAll",
        "click .finishedOnly": "finishedOnly",
        "click .inWorkOnly": "inWorkOnly",
        "click .allTasks": "allTasks",
        "keypress .new_todoElement": "addNewToDo"
    },

    initialize: function() {
        this.template = _.template($('#templToDoList').html());
        this.coll = new TodoCollection();
        this.restoreData();
        this.$el.html(this.template());
        this.render();
        this.listenTo(this.coll, "all", this.render);
        this.listenTo(this.coll, "add", this.addOne);
    },

    render: function() {
        var finished = 0;
        this.coll.each(function(obj,index){
            if(obj.get('state')=="finished")
                finished++;
        });
        this.$('.todo-count').text(this.coll.length);
        this.$('.todo-finished').text(finished);

        this.$('.todoList').html("");
        for(var i=0; i<this.coll.length;i++){
            var curModel=this.coll.models[i];

            if(this.filter==undefined){
                var view = new TodoView({model: curModel});
                this.$('.todoList').append(view.render());
            } else if(this.filter=="finished"){
                if (curModel.attributes.state=="finished"){
                    var view = new TodoView({model: curModel});
                    this.$('.todoList').append(view.render());
                }
            } else {
                if (curModel.attributes.state=="inProgress"){
                    var view = new TodoView({model: curModel});
                    this.$('.todoList').append(view.render());
                }
            }
        }
        return this;
    },

    finishAll: function() {
        this.coll.finishAll();
    },

    addOne: function(model) {
        var view = new TodoView({model: model});
        this.$('.todoList').append(view.render());
        this.saveData();
    },

    addNewToDo: function(e) {
        if(event.which === 13){ // e.keyCode==13
            console.log("new to do added."+this.$(".new_todoElement").val());
            this.coll.addNewToDo(this.$(".new_todoElement").val());
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
        this.coll.removeFinished();
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
