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
                    class : 'app_layout_item well page active',
                };
            },
            template: function(model) {
                return _.template(layout_item_view)({
                    id: model.id
                })
            },
            onShow: function(){

            },
            
            onRender: function(){
                App.execute('debug', 'LayoutItemView.render event called.', 0);
                var _options = this.model.get('options');
                
                
                if (_options  && typeof(_options.draggable) !== undefined) {
                    
                    this.$el.draggable(_options.draggable);
                }
                if (_options  && typeof(_options.resizable) !== undefined) {
                    _options.resizable.stop = function( event, ui ) {
                        console.log('stoppy')
                        App.LayoutModule.vent.trigger('LayoutItemView.resize.stop', {'event': event, 'ui': ui});
                    };
                    /* RESIZE CHANGE */
                    _options.resizable.resize = function( event, ui ) {
                        console.log('resize')
                        App.LayoutModule.vent.trigger('LayoutItemView.resize.stop', {'event': event, 'ui': ui});
                    };
                    this.$el.resizable(_options.resizable);
                }
                App.LayoutModule.vent.trigger('LayoutItemView.render', this);
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