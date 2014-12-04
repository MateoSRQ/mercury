/** app.js file */
'use strict';

require([
    'marionette'
],
    function (Marionette) {
        // App definition
        window.App = new Backbone.Marionette.Application({
            
        });
        
        App.layers = null;
     
        // App main regions, css in root/css/index.css
        App.addRegions({
           mapRegion: '#app-map-region',
           carouselRegion: '#app-carousel-region',
           bubblemenuRegion: '#app-bubblemenu-region'
        });
        
        App.setBaseLayer = function(layerName) {
            console.log('set Base Layer to ' + layerName)
            App.layers.each( function(item){
                if (item.get('isBase')) {
                    console.log('checking ' + item.get('name'));
                    if (item.get('name') == layerName) {
                        App.MapModule.setLayerVisibility(item.get('name'), true);
                        console.log('should be true')
                    }
                    else {

                        App.MapModule.setLayerVisibility(item.get('name'), false);
                        console.log('should be false')
                    }
                }
            }) 
        }

        // App debug command, only show messages greater than global debug set.
        App.commands.setHandler("debug", function(text, level){
            if (level >=  window.debug){
                console.log('debug: ' + text);
            }
        });
        
        // RequireJS module load command, to load module located in root\app\modules\dirname, with name module, and start options objects.
        App.commands.setHandler("load", function(dirname, module, options){
            App.execute('debug', 'App.commands.setHandler() called.', 0);
            if (!eval('App.' + module)) {
                require([
                    'modules/' + dirname + '/loader',
                ], function() {
                    eval('App.' + module + '.start(options);');
                });    
            }
        });

        // App before:start event function
        App.on('before:start', function(options){
            App.execute('debug', 'App before:start event called.', 0);
        });
        
        // App start event function, which enable
        App.on('start', function(options){
            App.execute('debug', 'App start event called.', 0); 
            if (Backbone.history){
                Backbone.history.start();
                App.execute('debug', 'App history started', 0); 
            }
        });
        
        // App.MapModule start event function, used to initialize map layers based on App.layers collection.
        // Also ends splash screen.
        App.vent.on('MapModule:start', function(){
            App.execute('debug', 'App.MapModule start event called.', 0);
            App.MapModule.initializeMap();
            var item = App.layers.at(0);
               App.MapModule.createLayer(item.get('type'), item.get('name'), {});

            //App.MapModule.createLayer('mapquest_osm', 'mapquest_osm', {});
            //App.MapModule.loadTopoJSON('../../data/distritos_3857_1000x.json') //
            //App.MapModule.D3FromTopoJSON('data/us.json') //*/
            $('#splash-screen').velocity("fadeOut", { delay: 500, duration: 900 });
        });
        
        // App.CarouselModule start event function, used to initialize carousel cards based on App.lateyers collection.
        // Also creates deck
        App.vent.on('CarouselModule:start', function(){
            App.execute('debug', 'App.CarouselModule start event called', 0);
            App.layers.forEach(function(item){
                App.CarouselModule.createCard(item);
            });
            App.CarouselModule.createDeck();
        });
        
        // App BubbleMenuModule start event function, used to add tooltips to menu items
        App.vent.on('BubbleMenuModule:start', function(){
            App.execute('debug', 'App.BubbleMenuModule start event called.', 0);
            $('.bubblemenu-item').tooltip({
                placement: 'left'
            });
        });
        
        App.vent.on('LayerItemCollection:add', function(layer){
            console.log('layer added');
            //App.MapModule.createLayer('mapquest_hyb', 'mapquest_hyb', {});
            //console.log(layer);
            //App.MapModule.createLayer(layer.get('type'), layer.get('name'), {});
            
        });
        
        App.vent.on('CarouselView:button:click', function(item){
            console.log(item)
            console.log('yyyclick')
            App.MapModule.createLayer(item.get('type'), item.get('name'), {});
            App.setBaseLayer(item.get('name'))
            $('#app-carousel-region').velocity('fadeOut', 1000);
        });

        App.vent.on("BubbleMenuModule:item:click", function(args){
            console.log($(args.delegateTarget).attr('id'))
            App.execute('load', 'carousel', 'CarouselModule', {region: App.carouselRegion, carousel_id: 'carousel' });
            $('#app-carousel-region').velocity('fadeIn', 1000);
        });
        
        require([
            'modules/map/loader',
            'bootstrap',
            'models/layer-item',
            'css!css_bootstrap/bootstrap.min.css',
            'css!css_font-awesome/flaticon.css',
            
            'css!fonts/open_sans/open_sans.css',
            'velocity'
        ], function() {
            require([
                'css!css_material_design/material.min.css',
                'material_design',
                'models/layer-collection'
            ], function(){
                App.start();
                App.MapModule.start({ region: App.mapRegion, map_id: 'map'});
                /* this should be on bubble's start! */
                var _bubblemenuitems = [];
                _bubblemenuitems.push({id: 'menu_item_1', name: 'menu_item_1', icon: 'flaticon-fire16', icon_alt: 'flaticon-cogs3'});
                _bubblemenuitems.push({id: 'menu_item_2', name: 'menu_item_2', icon: 'flaticon-comment33', icon_alt: 'flaticon-fire16'});
                _bubblemenuitems.push({id: 'menu_item_3', name: 'menu_item_3', icon: 'flaticon-flickr8', icon_alt: 'flaticon-plus26'});

                App.layers = new App.LayerItemCollection;
                App.layers.add([
                    {
                        type: 'mapquest_osm',
                        name: 'MapQuest OSM',
                        image: 'data/images/image_001.fw.png',
                        isBase: true
                    },
                    {
                        type: 'mapquest_hyb',
                        name: 'MapQuest Hibrido',
                        image: 'data/images/image_003.fw.png',
                        isBase: true
                    },
                    {
                        type: 'mapquest_sat',
                        name: 'MapQuest Satelital',
                        image: 'data/images/image_002.fw.png',
                        isBase: true
                    }
                ]);                
                
                /*
                App.layers.on("add", function(layer) {
                    console.log('added!')
                    App.vent.trigger('LayerItemCollection:add', layer);
                });
                */

                //App.execute('load', 'map', 'MapModule', {region: App.mapRegion, map_id: 'map'});            
                App.execute('load', 'bubblemenu', 'BubbleMenuModule', {region: App.bubblemenuRegion, bubblemenu_id: 'bubblemenu', items: _bubblemenuitems});            


                    

                
            })
        })
    }
);
