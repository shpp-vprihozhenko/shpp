/**
 * Created by Uzer on 04.02.2016.
 */

var TodoModel=Backbone.Model.extend({
    defaults: {
        state: 'inProgress',
        doText: ''
    },
    initialize: function() {

    }
});

var TodoCollection =Backbone.Collection.extend({

    model: TodoModel,

    removeFinished: function(){
        for(var i=0; i<this.length;i++){
            var curModel=this.models[i];
            if (curModel.attributes.state=="finished"){
                curModel.destroy();
                i--;
            }
        }
    },

    addNewToDo: function(new_doText){
        this.add({doText: new_doText});
    },

    saveToDB: function(){
        var dataToSave=JSON.stringify(this.toJSON());
        localStorage.setItem("todoDB", dataToSave);
    },

    restoreFromDB: function(){
        var savedData=localStorage.getItem("todoDB");
        if(savedData){
            var dataFromDB=JSON.parse(savedData);
            this.reset(dataFromDB);
        }
    }
});