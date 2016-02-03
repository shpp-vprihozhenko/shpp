var RocketView = Backbone.View.extend({

    tagName: 'tr',

    events: {
        'click .changeState':  'changeState',
        'click .deleteRow':  'deleteRow',
        'blur .do': 'editValue'
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
        var res = this.model.set({
            _do: this.$('.do').text()
        },{validate: true});
        if (!res) this.render();
    },
    changeState: function(e){
        if(this.model.attributes.stateLetter=='_'){
            this.model.set({
                stateLetter: 'V'
            },{validate: true});
        } else {
            this.model.set({
                stateLetter: '_'
            },{validate: true});
        }
        this.render();
    }
});
