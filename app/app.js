/** app.js file */
'use strict';

require([
    'marionette'
],
    function (Marionette) {
        window.App = new Backbone.Marionette.Application({
        });
     
        App.addRegions({
           mapRegion: '#app-map-region',
           carouselRegion: '#app-carousel-region',
           bubblemenuRegion: '#app-bubblemenu-region'
        });

        App.commands.setHandler("debug", function(text, level){
            if (level >=  window.debug){
                console.log('debug: ' + text);
            }
        });
        
        App.commands.setHandler("load", function(dirname, module, options){
            App.execute('debug', 'Application load command for module ' + module);
            if (!eval('App.' + module)) {
                require([
                    'modules/' + dirname + '/loader',
                ], function() {
                    eval('App.' + module + '.start(options);');
                });    
            }
        });

        App.on('before:start', function(options){
            App.execute('debug', 'Application before:start event launched', 0);
        });
        
        App.on('start', function(options){
            App.execute('debug', 'Application start event launched', 0); 
            if (Backbone.history){
                Backbone.history.start();
                App.execute('debug', 'Application history started', 0); 
            }
        });
        
        App.addLayer = function(collection) {
            console.log(collection);
        };
        
        App.vent.on('MapModule:start', function(){
            App.execute('debug', 'App MapModule MapModule:start event triggered', 0);
            App.MapModule.initializeMap();
            App.layers.forEach(function(item){
               console.log(item.get('type'));
               App.MapModule.createLayer(item.get('type'), item.get('name'), {});
            });
            //App.MapModule.createLayer('mapquest_osm', 'mapquest_osm', {});
            //App.MapModule.loadTopoJSON('../../data/distritos_3857_1000x.json') //
            //App.MapModule.D3FromTopoJSON('data/us.json') //*/
            $('#splash-screen').velocity("fadeOut", { delay: 500, duration: 900 });
        });

        App.vent.on('CarouselModule:start', function(){
            App.execute('debug', 'App CarouselModule CarouselModule:start event triggered', 0);
            console.log(App.layers)
            App.layers.forEach(function(item){
               console.log(item.get('name'));
               App.CarouselModule.createCard(item);
            });
            App.CarouselModule.createDeck();
        });
        
        App.vent.on('BubbleMenuModule:start', function(){
            App.execute('debug', 'App BubbleMenuModule BubbleMenuModule:start event triggered', 0);
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
        
        
       
        App.vent.on("BubbleMenuModule:item:click", function(args){
            console.log($(args.delegateTarget).attr('id'))
            App.execute('load', 'carousel', 'CarouselModule', {region: App.carouselRegion, carousel_id: 'carousel' });
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
                        image: 'data/images/image_001.fw.png'
                    },
                    {
                        type: 'mapquest_hyb',
                        name: 'MapQuest Hibrido',
                        image: 'data/images/image_003.fw.png'
                    },
                    {
                        type: 'mapquest_sat',
                        name: 'MapQuest Satelital',
                        image: 'data/images/image_002.fw.png'
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
