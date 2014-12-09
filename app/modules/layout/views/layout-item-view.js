'use strict';

define([
    'text!modules/layout/templates/layout-item-view.html',
    ],
    function(layout_item_view){
        
        App.LayoutModule.LayoutItemView = Backbone.Marionette.ItemView.extend({
            tagName: 'div',
            initialize: function(){
                this.$el.prop("id", "layout_" + this.model.get("id"));
            },
            events: {

            },
            attributes : function () {
                return {
                    class : 'app_layout_item',
                    //id : this.options.carousel_id
                };
            },
            template: function(model) {
                return _.template(layout_item_view)({

                })
            },
            onShow: function(){
            },
            onRender: function(){
                App.execute('debug', 'App.LayoutModule onRender event called.', 0);
                App.LayoutModule.vent.trigger('LayoutItemView::render', this);
            },
            
            click: function(i, e) {
                //e.preventDefault();

            },
            click_button: function(i, e) {
                //e.preventDefault();

            }
        });
    }
)