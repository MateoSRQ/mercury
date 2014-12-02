'use strict';

define([
    'text!modules/bubblemenu/templates/bubblemenu-item-view.html',
    ],
    function(bubblemenu_view){
        
        App.BubbleMenuModule.BubbleMenuItemView = Backbone.Marionette.ItemView.extend({
            tagName: 'div',
            //className: 'bubblemenu-item',
            events: {
                'click .bubblemenu-icon-alt':  'item_click'
            },
            attributes : function () {
                return {
                    class : 'bubblemenu-item'
                };
            },
            template: function(model) {
                return _.template(bubblemenu_view)({
                    'icon': model.icon,
                    'icon_alt': model.icon_alt
                });
            },
            initialize: function(){
                this.$el.prop("id", "model_" + this.model.get('id'));
                this.$el.attr("data-toggle", "tooltip");
                this.$el.attr("title", "tooltip");
                
                
            },
            onShow: function(){
                
            },
            item_click: function(e) {
                App.vent.trigger('BubbleMenuModule:item:click', e);
            }
        });
    }
)