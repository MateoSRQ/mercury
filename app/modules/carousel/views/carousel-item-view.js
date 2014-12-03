'use strict';

define([
    'text!modules/carousel/templates/carousel-item-view.html',
    ],
    function(carousel_item_view){
        
        App.CarouselModule.CarouselItemView = Backbone.Marionette.ItemView.extend({
            tagName: 'section',
            events: {

                'click .btn-primary': 'click_button',
                'click': 'click'
            },
            attributes : function () {
                return {
                    class : 'app_carousel_item',
                    //id : this.options.carousel_id
                };
            },
            template: function(model) {
                console.log('model')
                console.log(model);                
                return _.template(carousel_item_view)({
                    'image': model.image,
                    'name': model.name
                })
            },
            onShow: function(){
            },
            click: function(i, e) {
                //e.preventDefault();
                console.log('con el click click click')
            },
            click_button: function(i, e) {
                //e.preventDefault();
                console.log('con el click click clock')
            }
        });
    }
)