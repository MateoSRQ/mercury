'use strict';
App.module("BubbleMenuModule", function (BubbleMenuModule) {
    BubbleMenuModule.startWithParent = false;
    BubbleMenuModule.views = {};
    BubbleMenuModule.options = {};
    BubbleMenuModule.models = {};
});

App.BubbleMenuModule.on('before:start', function(options){
    App.execute('debug', 'Module App::BubbleMenuModule before:start event invoked [LOADER.JS]', 0); 
    this.options = options;
});

requirejs.config({
    shim: {
    },
    paths: {
    }
});

require([
    'modules/bubblemenu/views/bubblemenu-item-view',
    'modules/bubblemenu/models/bubblemenu-item',
    'css!modules/bubblemenu/css/bubblemenu.css'
],
    function() {
        require([
        'modules/bubblemenu/views/bubblemenu-view',
        'modules/bubblemenu/models/bubblemenu-collection',
        ],   
        function () {
            App.module("BubbleMenuModule", function (BubbleMenuModule, App, Backbone, Marionette, $, _) {
                this.addInitializer(function(){
                    console.log('BubbleMenuModule::initialize function invoked');
        
                    this.models.BubbleMenuItemCollection = new App.BubbleMenuModule.BubbleMenuItemCollection(this.options.items);                    
                    
                    this.views.BubbleMenuView = new App.BubbleMenuModule.BubbleMenuView({
                        bubblemenu_id: this.options.bubblemenu_id,
                        collection: this.models.BubbleMenuItemCollection
                    });
                    this.options.region.show(this.views.BubbleMenuView);
                    
                });
            });
            App.vent.trigger("BubbleMenuModule:start");
        }
        
    )}
)
