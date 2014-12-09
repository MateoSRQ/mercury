'use strict';
App.module("CarouselModule", function (CarouselModule) {
    CarouselModule.startWithParent = false;
    CarouselModule.views = {};
    CarouselModule.options = {};
    CarouselModule.collection = {};
    CarouselModule.decks = null;
});

App.CarouselModule.on('before:start', function(options){
    App.execute('debug', 'Module App::CarouselModule before:start event invoked [LOADER.JS]', 0); 
    this.options = options;
});

requirejs.config({
    shim: {
        'bespoke':  { deps: [] },
        'bespoke-classes':  { deps: ['bespoke'] },
        'bespoke-keys':  { deps: ['bespoke']},
        'bespoke-touch':  { deps: ['bespoke'] },
        'bespoke-click':  { deps: ['bespoke'], exports: 'click' },
        'transit': { deps: [] },
        'slideshowify': { deps: ['transit'] }
    },
    paths: {
        'bespoke': '../../app/modules/carousel/libs/bespoke/dist/bespoke.min',
        'bespoke-classes': '../../app/modules/carousel/libs/bespoke/dist/bespoke-classes.min',
        'bespoke-keys': '../../app/modules/carousel/libs/bespoke/dist/bespoke-keys.min',
        'bespoke-touch': '../../app/modules/carousel/libs/bespoke/dist/bespoke-touch.min',
        'bespoke-click': '../../app/modules/carousel/libs/bespoke/dist/bespoke-click.min',
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
            'bespoke-touch',
            //'bespoke-click',
            //'bespoke-click',
            //'slideshowify',
            //'kenburns',
            'modules/carousel/views/carousel-view',
            'modules/carousel/models/carousel-collection',
            'css!modules/carousel/css/carousel-theme.css'
        ],   
        function (bespoke, classes, keys, touch) {
            App.module("CarouselModule", function (CarouselModule, App, Backbone, Marionette, $, _) {
                this.addInitializer(function(){
                    console.log('CarouselModule::initialize function invoked');
                    this.collection = new App.CarouselModule.CarouselItemCollection();
                    this.views.CarouselView = new App.CarouselModule.CarouselView({collection: this.collection, carousel_id: this.options.carousel_id });
                    this.options.region.show(this.views.CarouselView);
                });
                
                CarouselModule.createCard = function(item) {
                    this.collection.add(item);
                }
                
                CarouselModule.createDeck = function() {
                    CarouselModule.decks = bespoke.from('#' + this.options.carousel_id, [classes(), keys(), touch()]);
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
