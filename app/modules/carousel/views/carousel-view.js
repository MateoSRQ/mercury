'use strict';

define([
    'text!modules/carousel/templates/carousel-view.html',
    ],
    function(carousel_view){
        App.CarouselModule.CarouselView = Backbone.Marionette.CollectionView.extend({
            childView: App.CarouselModule.CarouselItemView,
            triggers: {
            },
            attributes : function () {
                return {
                    class : 'app_carousel coverflow',
                    id : this.options.carousel_id
                };
            },
            template: function() {
                return _.template(carousel_view)({
                })
            },
            onShow: function(){
            }
        });
    }
)

