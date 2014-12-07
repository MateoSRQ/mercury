'use strict';

App.module("LayoutModule", function (LayoutModule) {
    LayoutModule.startWithParent = false;
    LayoutModule.views = {};
    LayoutModule.options = {};
});

App.LayoutModule.on('before:start', function(options){
    App.execute('debug', 'Module App::LayoutModule before:start event invoked [LOADER.JS]', 0); 
    this.options = options;
});

requirejs.config({
    shim: {
        'packery':  { deps: [], exports: 'packery' },

    },
    paths: {
        'packery': '../../app/modules/layout/libs/packery/dist/packery.pkgd.min'
    }
});

require([
    
],
    function() {
        require([
            'packery'
        ],   
        function () {

            
            App.module("LayoutModule", function (LayoutModule, App, Backbone, Marionette, $, _) {
                LayoutModule.initializeMap = function() {
                };
                this.addInitializer(function(){
                    console.log('[MAP LOADER.JS] LayoutModule::initialize function invoked');
                    //this.views.MapView = new App.LayoutModule.MapView({ map_id: this.options.map_id });
                    //this.options.region.show(this.views.MapView);
                });
            });
            App.vent.trigger("LayoutModule:start");
        }
        
    )}
)
