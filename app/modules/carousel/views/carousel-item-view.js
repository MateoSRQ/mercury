'use strict';

define([
    'text!modules/carousel/templates/carousel-item-view.html',
    ],
    function(carousel_view){
        
        App.CarouselModule.CarouselItemView = Backbone.Marionette.ItemView.extend({
            tagName: 'section',
            triggers: {
            },
            attributes : function () {
                return {
                    class : 'app_carousel_item',
                    //id : this.options.carousel_id
                };
            },
            template: function(model) {
                console.log('********************');
                console.log(model);                
                return _.template(carousel_view)({
                    'image': model.image
                })
            },
            onShow: function(){
            }
        });
    }
)