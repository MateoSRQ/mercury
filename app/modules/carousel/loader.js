'use strict';
App.module("CarouselModule", function (CarouselModule) {
    CarouselModule.startWithParent = false;
    CarouselModule.views = {};
    CarouselModule.options = {};
    CarouselModule.models = {};
    CarouselModule.decks = null;
});

App.CarouselModule.on('before:start', function(options){
    App.execute('debug', 'Module App::CarouselModule before:start event invoked [LOADER.JS]', 0); 
    this.options = options;
});

requirejs.config({
    shim: {
        'bespoke':  { deps: [], exports: 'bespoke' },
        'bespoke-classes':  { deps: ['bespoke'], exports: 'classes' },
        'bespoke-keys':  { deps: ['bespoke'], exports: 'keys' },
        'transit': { deps: [] },
        'slideshowify': { deps: ['transit'] }
    },
    paths: {
        'bespoke': '../../app/modules/carousel/libs/bespoke/dist/bespoke.min',
        'bespoke-classes': '../../app/modules/carousel/libs/bespoke/dist/bespoke-classes.min',
        'bespoke-keys': '../../app/modules/carousel/libs/bespoke/dist/bespoke-keys.min',
        'slideshowify': '../../app/modules/carousel/libs/slideshowify/slideshowify.min',
        'transit': '../../app/modules/carousel/libs/transit/transit.min',
        'kenburns': '../../app/modules/carousel/libs/kenburns/kenburns.min'
    }
});

require([
    'modules/carousel/views/carousel-item-view',
    'modules/carousel/models/carousel-item'
],
    function() {
        require([
            'bespoke',
            'bespoke-classes',
            'bespoke-keys',
            //'slideshowify',
            //'kenburns',
            'modules/carousel/views/carousel-view',
            'modules/carousel/models/carousel-collection',
            'css!modules/carousel/css/carousel-theme.css'
        ],   
        function (bespoke, classes, keys) {
            console.log(classes)
            App.module("CarouselModule", function (CarouselModule, App, Backbone, Marionette, $, _) {
                this.addInitializer(function(){
                    console.log('CarouselModule::initialize function invoked');
                    
                    /*
                    var CarouselItemArray = [];
                    CarouselItemArray.push({name: 'item1'});
                    CarouselItemArray.push({name: 'item2'});
                    CarouselItemArray.push({name: 'item3'});
                    CarouselItemArray.push({name: 'item4'});
                    CarouselItemArray.push({name: 'item5'});
                    CarouselItemArray.push({name: 'item6'});
                    
                    this.models.CarouselItemCollection = new App.CarouselModule.CarouselItemCollection(CarouselItemArray);
                    */
                    this.views.CarouselView = new App.CarouselModule.CarouselView({collection: this.models.CarouselItemCollection, carousel_id: this.options.carousel_id });
                    this.options.region.show(this.views.CarouselView);
                });
                
                CarouselModule.createDeck = function() {
                    CarouselModule.decks = bespoke.from('#' + this.options.carousel_id, [classes(), keys()]);
                }
                CarouselModule.next = function() {
                    if (CarouselModule.decks) {
                       CarouselModule.decks.next();
                    }
                }
                
            });
            App.vent.trigger("CarouselModule:start");
        }
    )}
)
