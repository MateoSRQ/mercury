'use strict';
require([
    'marionette'
],
    function (Marionette) {
        window.App = new Backbone.Marionette.Application({
        });
        
        App.layers = null;

        App.addRegions({
            layoutRegion: '#app-layout-region', 
            //mapRegion: '#app-map-region',
            //carouselRegion: '#app-carousel-region',
            //bubblemenuRegion: '#app-bubblemenu-region'
        });
        
        /* APPLICATION FUNCTIONS */
        App.commands.setHandler("debug", function(text, level){
            if (level >=  window.debug){
                console.log('debug: ' + text);
            }
        });
        
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
        
        /* LAYOUT EVENTS */
        App.vent.on('LayoutItemView.render', function(args){
            App.execute('debug', 'App.LayoutItemView.render called.', 0);
            console.log(args);
        });
        
        App.vent.on('LayoutModule:start', function(){
            App.execute('debug', 'App.LayoutModule start event called.', 0);
            App.LayoutModule.add([
                {
                    name: 'layout_1',
                    id: 'layout_1',
                    options: {
                        draggable: {
                            grid: [ 1, 1 ],
                            containment: 'parent'
                        },
                        resizable: {
                            grid: [ 1, 1 ],
                            containment: 'parent',
                            minHeight: 250,
                            minWidth: 250
                        }   
                    }
                },
                {
                    name: 'layout_2',
                    id: 'layout_2',
                    options: {
                        draggable: {
                            grid: [ 10, 10 ],
                            containment: 'parent'
                        },
                        resizable: {
                            grid: [ 10, 10 ],
                            containment: 'parent',
                            minHeight: 100,
                            minWidth: 100
                        }    
                    }
                },
                {
                    name: 'layout_3',
                    id: 'layout_3',
                    options: {
                        draggable: {
                            grid: [ 10, 10 ],
                            containment: 'parent'
                        },
                        resizable: {
                            grid: [ 10, 10 ],
                            containment: 'parent',
                            minHeight: 250,
                            minWidth: 250
                        }   
                    }
                }
            ]);
            App.execute('load', 'map', 'MapModule', {region: App.layout_1, map_id: 'map'});  
        });      
        
        App.vent.on('LayerItemCollection:add', function(layer){
            console.log('layer added');
            //App.MapModule.createLayer('mapquest_hyb', 'mapquest_hyb', {});
            //console.log(layer);
            //App.MapModule.createLayer(layer.get('type'), layer.get('name'), {});
        });
        
        App.vent.on('LayoutItemView.resize.stop', function(args){
            /* SPECIFIC FOR THIS IMPLEMENTATION */
            if (args.ui.element[0].id == 'layout_layout_1') {
               console.log('stop stop');
               App.MapModule.updateSize();
            }
        });

        App.setBaseLayer = function(layerName) {
            console.log('set Base Layer to ' + layerName)
            App.layers.each( function(item){
                if (item.get('isBase')) {
                    console.log('checking ' + item.get('name'));
                    if (item.get('name') == layerName) {
                        App.MapModule.setLayerVisibility(item.get('name'), true);
                    }
                    else {
                        App.MapModule.setLayerVisibility(item.get('name'), false);
                    }
                }
            }) 
        }

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
            //var item = App.layers.at(0);
               //App.MapModule.createLayer(item.get('type'), item.get('name'), {}); // CHECK THIS

            App.MapModule.createLayer('mapquest_osm', 'mapquest_osm', {});
            //App.MapModule.loadTopoJSON('../../data/distritos_3857_1000x.json') //
            //App.MapModule.D3FromTopoJSON('data/us.json') //*/
            //$('#splash-screen').velocity("fadeOut", { delay: 500, duration: 900 });
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
        

        
        

        
        App.vent.on('CarouselView:button:click', function(item){
            console.log('hhhhhh')
            console.log(item);
            App.MapModule.createLayer(item.get('type'), item.get('name'), item.get('options'));
            if (item.get('isBase')) {
                App.setBaseLayer(item.get('name'));
            }
            if ((item.get('options') !== undefined && item.get('options').center !== undefined)) {
                console.log(item.get('options').center)
                App.MapModule.setCenter(item.get('options').center);
            }
            
            if ((item.get('options') !== undefined && item.get('options').zoom !== undefined)) {
                console.log(item.get('options').zoom)
                App.MapModule.setZoom(item.get('options').zoom);
            }
            
            $('#app-carousel-region').velocity('fadeOut', 1000);
        });
        

        App.vent.on("BubbleMenuModule:item:click", function(args){
            console.log($(args.delegateTarget).attr('id'))
            App.execute('load', 'carousel', 'CarouselModule', {region: App.carouselRegion, carousel_id: 'carousel' });
            $('#app-carousel-region').velocity('fadeIn', 1000);
        });
        
      
        
        require([
            //'modules/map/loader',
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
                //App.MapModule.start({ region: App.mapRegion, map_id: 'map'});
                /* this should be on bubble's start! */
                //var _bubblemenuitems = [];
                //_bubblemenuitems.push({id: 'menu_item_1', name: 'menu_item_1', icon: 'flaticon-fire16', icon_alt: 'flaticon-cogs3'});
                //_bubblemenuitems.push({id: 'menu_item_2', name: 'menu_item_2', icon: 'flaticon-comment33', icon_alt: 'flaticon-fire16'});
                //_bubblemenuitems.push({id: 'menu_item_3', name: 'menu_item_3', icon: 'flaticon-flickr8', icon_alt: 'flaticon-plus26'});
                
                App.layers = new App.LayerItemCollection;
                App.layers.add([
                    /*
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
                    },
                    */
                    {
                        type: 'local_topojson',
                        name: 'Perú Población 2014',
                        image: 'data/images/image_004.fw.png',
                        isBase: false,
                        options: {
                            url:  '../../data/peru_3857_normalized.json',
                            //colors: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
                            colors: ['#a6cee3','#1f78b4','#b2df8a','#33a02c]'],



                            center: [-75,-10.50],
                            zoom: 5
                            //center: [-72,-15],
                            //zoom: 7
                        }
                    },
                    /*
                    {
                        type: 'local_topojson2',
                        name: 'Arequipa',
                        image: 'data/images/image_004.fw.png',
                        isBase: false,
                        options: {
                            url:  '../../data/peru_3857_normalized.json',
                            colors: ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'],
                            center: [-72,-15],
                            zoom: 7
                        }
                    },
                    */
                   
                ]);                
                
                
                App.layers.on("add", function(layer) {
                    console.log('added!')
                    App.vent.trigger('LayerItemCollection:add', layer);
                });
                

                //App.execute('load', 'map', 'MapModule', {region: App.mapRegion, map_id: 'map'});            
                //App.execute('load', 'bubblemenu', 'BubbleMenuModule', {region: App.bubblemenuRegion, bubblemenu_id: 'bubblemenu', items: _bubblemenuitems});
                
                
                
                App.execute('load', 'layout', 'LayoutModule', {region: App.layoutRegion, layout_id: 'layout'});
 

                    
                $('#splash-screen').velocity("fadeOut", { delay: 500, duration: 900 });
                
            })
        })
    }
);
