'use strict';

App.module("MapModule", function (MapModule) {
    MapModule.startWithParent = false;
    MapModule.views = {};
    MapModule.options = {};
    MapModule.mapHandler = null;
    MapModule.layers = [];
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
    'modules/map/views/map-view'
],
    function() {
        require([
            'ol',
            'd3',
            'topojson',
            'css!modules/map/css/map-module.css'
        ],   
        function (ol, d3, topojson) {
            App.module("MapModule", function (MapModule, App, Backbone, Marionette, $, _) {
                MapModule.initializeMap = function() {
                    this.mapHandler = new ol.Map({
                        target: this.options.map_id,
                        layers: [
                        ],
                        view: new ol.View({
                            center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
                            zoom: 4,
                        })
                    })
                };
                this.addInitializer(function(){
                    console.log('[MAP LOADER.JS] MapModule::initialize function invoked');
                    this.views.MapView = new App.MapModule.MapView({ map_id: this.options.map_id });
                    this.options.region.show(this.views.MapView);
                });
                
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
                        var _features = topoJSONReader.readFeatures(urldata)
                        
                        var styleArray = [new ol.style.Style({
                          fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                          }),
                          stroke: new ol.style.Stroke({
                            color: '#319FD3',
                            width: 1
                          })
                        })];
                        
                        App.MapModule.layers[layerName] = {
                            layer: new ol.layer.Vector({
                                source: new ol.source.Vector({
                                    projection: 'EPSG:3857',
                                    features: _features
                                }),
                                                            
                                style: function(feature, resolution) {
                                    // don't want to render the full world polygon, which repeats all countries
                                    return styleArray;
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
