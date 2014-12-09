'use strict';

App.module("LayoutModule", function (LayoutModule) {
    LayoutModule.startWithParent = false;
    LayoutModule.views = {};
    LayoutModule.collection = {};
    LayoutModule.options = {};
    LayoutModule.layoutHandler = null;
    LayoutModule.vent = new Backbone.Wreqr.EventAggregator();
});

App.LayoutModule.on('before:start', function(options){
    App.execute('debug', 'Module App::LayoutModule before:start event invoked [LOADER.JS]', 0); 
    this.options = options;
});

requirejs.config({
    shim: {
        'jquery-bridget': { deps:['jquery'], exports: '' },
        'packery':  { deps: ['jquery-bridget'], exports: '' },
        'jquery-ui': { deps:['jquery'] }
    },
    paths: {
        'packery': '../../app/modules/layout/libs/packery/dist/packery.pkgd.min',
        'jquery-bridget': '../../app/modules/layout/libs/packery/dist/jquery-bridget.min',
        'jquery-ui': '../../app/modules/layout/libs/jquery-ui-1.11.2/jquery-ui.min',
        'jquery-ui-css': '../../app/modules/layout/libs/jquery-ui-1.11.2',
    }
});

require([
    'modules/layout/views/layout-item-view',
    'modules/layout/models/layout-item'    
],
    function() {
        require([
            //'packery',
            'jquery-ui',
            'modules/layout/views/layout-view',
            'modules/layout/models/layout-collection',
            'css!modules/layout/css/layout.css',
            'css!jquery-ui-css/jquery-ui.css'
        ],   
        function (Packery) {
            App.module("LayoutModule", function (LayoutModule, App, Backbone, Marionette, $, _) {
                this.addInitializer(function(){
                    App.execute('debug', 'App.LayoutModule addInitializer function called.', 0);
                    this.collection = new App.LayoutModule.LayoutItemCollection();
                    //App.LayoutModule.options = this.options;
                    this.views.LayoutView = new App.LayoutModule.LayoutView({collection: this.collection, layout_id: this.options.layout_id });
                    this.options.region.show(this.views.LayoutView);
                    //this.layoutHandler = $( '#' + this.options.layout_id).packery();
                });
                
                LayoutModule.add = function(layouts) {
                    App.execute('debug', 'App.LayoutModule add function called.', 0);
                    this.collection.add(layouts);
                    /*
                    this.layoutHandler.packery({
                        containerStyle: null,
                        gutter: 10,
                        isHorizontal: true
                    });
                    */
                    var self = this;
                    _.each(layouts, function(layout){
                        console.log(layout.id)

                        $('#layout_'+ layout.id )
                        .resizable({
                            alwaysRelative: true
                        })
                        .draggable({
                            containment: 'parent',
                            snap: layout.snap
                        })
                    })
                    App.vent.trigger('LayoutModule:add', layouts);
                };
            });

            App.LayoutModule.vent.on('LayoutItemView::render', function(args){
                App.execute('debug', 'App.LayoutItemView::render event called.', 0);
                App.vent.trigger('LayoutItemView::render', args);
                //App.LayoutModule.layoutHandler.packery( 'appended', args.el );
                
            })

            App.vent.trigger("LayoutModule:start");
        }
        
    )}
)
