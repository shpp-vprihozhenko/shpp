var RocketModel = Backbone.Model.extend({
    defaults: {
        stateLetter: '_',
        _do: '-'
    },
    initialize: function() {},
    validate: function (attrs) {
    }
});

var RocketsCollection = Backbone.Collection.extend({
    model: RocketModel,
    url: '/data',
    finishAll: function(){
        console.log(this);
        var arModels=this.models;
        for(var i=0; i<arModels.length;i++){
            if(arModels[i].attributes.stateLetter=="V")
                continue;
            else
                arModels[i].set({stateLetter:"V"});
        }
    },

    showFinishedOnly: false,

    saveToDB: function(){
        var collection = this;
        var options = {
            success: function (model, resp, xhr) {
                collection.reset(model);
            }
        };
        Backbone.sync('update', this, options);
    },

    restoreFromDB: function(){
        var collection = this;
        var options = {
            success: function (model, resp, xhr) {
                collection.reset(model);
            }
        };
        Backbone.sync('read', this, options);
    }

});
//var message = {
//    data : JSON.stringify(this.coll.toJSON())
//};
//$.post('/data', message, function (data){
//    $('#text').val('').focus();
//}, 'json');

//Backbone.ajax({
//    url: this.coll.url,
//    dataType: 'html',
//    contentType: 'application/json',
//    type: 'POST',
//    data: JSON.stringify(this.coll.toJSON())
//});
