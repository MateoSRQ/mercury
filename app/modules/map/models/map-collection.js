'use strict'   
App.MapModule.MapItemCollection = Backbone.Collection.extend({
    model: App.MapModule.MapItem,
    
    initialize: function(){
        this.on('add', this.addItem, this); 
    },
    
    addItem: function(args) {
        App.execute('debug', 'App.MapModule.MapItemCollection.addItem function called.', 0);
        App.MapModule.vent.trigger('App.MapModule.MapItemCollection.addItem', args);
    }
});

