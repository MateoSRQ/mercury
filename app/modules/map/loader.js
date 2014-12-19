'use strict';

App.module("MapModule", function (MapModule) {
    // check if these are visible
    MapModule.startWithParent = false;
    MapModule.views = {};
    MapModule.options = {};
    MapModule.collection = {};
    MapModule.handlers = null;
    MapModule.layers = [];
    MapModule.vent = new Backbone.Wreqr.EventAggregator();
});

App.MapModule.on('before:start', function(options){
    App.execute('debug', 'Module App::MapModule before:start event invoked [LOADER.JS]', 0); 
    this.options = options;
});

requirejs.config({
    shim: {
        'd3':  { deps: [], exports: 'd3' },
        'topojson': { deps: ['d3'], exports: 'topojson' },
        'ol': { deps: ['d3'], exports: 'ol' }
    },
    paths: {
        'd3': '../../app/modules/map/libs/d3/d3.min',
        'topojson': '../../app/modules/map/libs/d3/topojson.min',
        'ol': '../../app/modules/map/libs/openlayers/build/ol-debug',
        'css_ol': '../../app/modules/map/libs/openlayers/css/ol.css'
    }
});

require([
    'modules/map/models/map-item',
    
],
    function() {
        require([
            'ol',
            //'d3',
            //'topojson',
            'modules/map/views/map-item',
            'modules/map/models/map-collection',
            'css!modules/map/css/map-module.css'
        ],   
        function (ol) {

            App.module("MapModule", function (MapModule, App, Backbone, Marionette, $, _) {
                this.addInitializer(function(){
                    App.execute('debug', 'App.MapModule.addInitializer function called.', 0);
                    this.collection = new App.MapModule.MapItemCollection();
                    //this.views.MapView = new App.MapModule.MapView({ map_id: this.options.map_id });
                    //this.options.region.show(this.views.MapView);
                });
            
                MapModule.add = function(maps) {
                    App.execute('debug', 'App.MapModule add function called.', 0);
                    this.collection.add(maps);
                    App.vent.trigger('App.MapModule.add', maps);
                };
                
                MapModule.vent.on('App.MapModule.MapItemCollection.addItem', function(args) {
                })
            
                // CHECKED THRU THIS
            
                MapModule.initializeMap = function() {
                    this.mapHandler = new ol.Map({
                        target: this.options.map_id,
                        controls: ol.control.defaults({
                            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                              collapsible: false
                            })
                          }).extend([mousePositionControl]),
                        layers: [
                        ],
                        view: new ol.View({
                            center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
                            zoom: 4,
                        })
                    })

                };

                
                MapModule.D3FromTopoJSON = function(url) {
                    d3.json(url, function(error, us) {
                        var features = topojson.feature(us, us.objects.counties);
  
                        var canvasFunction = function(extent, resolution, pixelRatio, size, projection) {
                            var canvasWidth = size[0];
                            var canvasHeight = size[1];
                            var canvas = d3.select(document.createElement('canvas'));
                            canvas.attr('width', canvasWidth).attr('height', canvasHeight);
                            var context = canvas.node().getContext('2d');
                            var d3Projection = d3.geo.mercator().scale(1).translate([0, 0]);
                            var d3Path = d3.geo.path().projection(d3Projection);
                            var pixelBounds = d3Path.bounds(features);
                            var pixelBoundsWidth = pixelBounds[1][0] - pixelBounds[0][0];
                            var pixelBoundsHeight = pixelBounds[1][1] - pixelBounds[0][1];
                            var geoBounds = d3.geo.bounds(features);
                            var geoBoundsLeftBottom = ol.proj.transform(geoBounds[0], 'EPSG:4326', projection);
                            var geoBoundsRightTop = ol.proj.transform(geoBounds[1], 'EPSG:4326', projection);
                            var geoBoundsLeftBottom = geoBounds[0];
                            var geoBoundsRightTop = geoBounds[1];                            
                            
                            var geoBoundsWidth = geoBoundsRightTop[0] - geoBoundsLeftBottom[0];
                            if (geoBoundsWidth < 0) {geoBoundsWidth += ol.extent.getWidth(projection.getExtent());}
                            var geoBoundsHeight = geoBoundsRightTop[1] - geoBoundsLeftBottom[1];
                            var widthResolution = geoBoundsWidth / pixelBoundsWidth;
                            var heightResolution = geoBoundsHeight / pixelBoundsHeight;
                            var r = Math.max(widthResolution, heightResolution);
                            var scale = r / (resolution / pixelRatio);
                        
                            var center = ol.proj.transform(ol.extent.getCenter(extent), projection, 'EPSG:4326');
                            d3Projection.scale(scale).center(center).translate([canvasWidth / 2, canvasHeight / 2]);
                            d3Path = d3Path.projection(d3Projection).context(context);
                            d3Path(features);
                            context.stroke();
                            return canvas[0][0];
                        }
                        var layer = new ol.layer.Image({
                            source: new ol.source.ImageCanvas({
                                canvasFunction: canvasFunction,
                                projection: 'EPSG:4326'
                            })
                        });
                        App.MapModule.mapHandler.addLayer(layer);

                    });
                }
                
                MapModule.updateSize = function() {
                    App.MapModule.mapHandler.updateSize();
                };

                MapModule.loadTopoJSON = function(url) {
                    require([
                        'text!' + url
                    ], function (urldata){
                        var topoJSONReader = new ol.format.TopoJSON();
                        var features = topoJSONReader.readFeatures(urldata);
                        var topoJSONSource = new ol.source.Vector({
                            projection: 'EPSG:3857',
                            features: features 
                        });
                        //topoJSONSource.addFeatures(features)
                        
                        //var vector = new ol.layer.Vector();
                        
                        /*
                        var styleArray = [new ol.style.Style({
                          fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.6)'
                          }),
                          stroke: new ol.style.Stroke({
                            color: '#319FD3',
                            width: 1
                          })
                        })];
                        */
                        var vector = new ol.layer.Vector({
                          source: topoJSONSource
                        });
                        console.log('xxxx');
                        App.MapModule.mapHandler.addLayer(vector);
                    }) 
                }
                
                var createTopoJSONLayerfromLocal = function(layerName, options) {
                    console.log('topo');
                    console.log(options);
                    
                    require([
                        'text!' + options.url
                    ], function (urldata){
                        console.log('urldata');
                        var topoJSONReader = new ol.format.TopoJSON();
                        var _features = topoJSONReader.readFeatures(urldata);
                        
                        // colors
                        
                      

                        var quantile = d3.scale.quantile()
                        .domain(_.map(_features, function(feature){ return feature.get('POP'); }))
                        .range(options.colors);

                        var styleFunction = function(feature, resolution) {
                            return  [new ol.style.Style({
                                fill: new ol.style.Fill({
                                    //color: 'rgba(255, 255, 255, 0.4)'
                                    color: quantile(feature.get('POP'))
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#319FD3',
                                    width: 1
                                })
                            })];
                        };
                        
                        App.MapModule.layers[layerName] = {
                            layer: new ol.layer.Vector({
                                opacity: 0.5,
                                source: new ol.source.Vector({
                                    projection: 'EPSG:3857',
                                    features: _features
                                }),
                                                            
                                style: function(feature, resolution) {
                                    // don't want to render the full world polygon, which repeats all countries
                                    return styleFunction(feature, resolution);
                                }
                                
                            }),
                            type: 'vector',
                        };   
                        App.MapModule.mapHandler.addLayer(App.MapModule.layers[layerName].layer);
                    })                     
                }
            
                var createMapQuestSatelliteLayer = function(layerName, options) {
                    App.MapModule.layers[layerName] = {
                        layer: new ol.layer.Tile({
                                source: new ol.source.MapQuest({layer: 'sat'}),
                                name: layerName
                            }),
                        type: 'raster',
                    };
                    App.MapModule.mapHandler.addLayer(App.MapModule.layers[layerName].layer);
                }
                
                var createMapQuestHybridLayer = function(layerName, options) {
                    App.MapModule.layers[layerName] = {
                        layer: new ol.layer.Tile({
                                source: new ol.source.MapQuest({layer: 'hyb'}),
                                name: layerName
                            }),
                        type: 'raster'
                    };
                    App.MapModule.mapHandler.addLayer(App.MapModule.layers[layerName].layer);
                }
                
                var createMapQuestOSMLayer = function(layerName, options) {
                    App.MapModule.layers[layerName] = {
                        layer: new ol.layer.Tile({
                                source: new ol.source.MapQuest({layer: 'osm'}),
                                name: layerName
                            }),
                        type: 'raster'
                    };
                    App.MapModule.mapHandler.addLayer(App.MapModule.layers[layerName].layer);
                }
                
                /* Should make it generic */
                MapModule.setCenter = function (coordinates) {
                    var _proj = ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857');
                    App.MapModule.mapHandler.getView().setCenter(_proj);
                }
                
                /* Should make it generic */
                MapModule.setZoom = function (level) {
                    App.MapModule.mapHandler.getView().setZoom(level);
                }
                                
                MapModule.createLayer = function(layerType, layerName, options) {
                    if (typeof(MapModule.layers[layerName]) !== undefined && !MapModule.layers[layerName]) {
                        console.log('createlayer');
                        switch (layerType) {
                            case 'mapquest_sat':
                                createMapQuestSatelliteLayer(layerName, options);
                                break;
                            case 'mapquest_hyb':
                                createMapQuestHybridLayer(layerName, options);
                                break;
                            case 'mapquest_osm':
                                createMapQuestOSMLayer(layerName, options);
                                break;
                            case 'local_topojson':
                                console.log('OPTIONS');
                                console.log(options)
                                createTopoJSONLayerfromLocal(layerName, options);
                                break;
                        }
                    }
                    else {
                        MapModule.setLayerVisibility(layerName, true);
                    }
                }
                MapModule.setLayerVisibility = function(layerName, visibility) {
                    if (typeof(MapModule.layers[layerName]) !== undefined && MapModule.layers[layerName]) {
                        var _layers = this.mapHandler.getLayers();
                        _layers.forEach(function(item){
                            if (item.get('name') == layerName) {
                                item.setVisible(visibility);
                            }
                        })
                    }
                }
                
                
            });
            App.vent.trigger("MapModule:start");
        }
        
    )}
)

            /*
            var mousePositionControl = new ol.control.MousePosition({
                coordinateFormat: ol.coordinate.createStringXY(4),
                projection: 'EPSG:4326',
                // comment the following two lines to have the mouse position
                // be placed within the map.
                className: 'custom-mouse-position',
                target: document.getElementById('mouse-position'),
                undefinedHTML: '&nbsp;'
            });
            */
