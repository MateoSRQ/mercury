'use strict';

define([
    'text!modules/layout/templates/layout-item-view.html',
    ],
    function(layout_item_view){
        //  variables
        var _width, _height = null;
        
        
        App.LayoutModule.LayoutItemView = Backbone.Marionette.ItemView.extend({
            tagName: 'div',
            initialize: function(){
                this.$el.prop("id", "layout_" + this.model.get("id"));
            },
            events: {
                'click .icon': 'icon_click',
                'dblclick .big_icon': 'big_icon_click'
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
            
            icon_click: function(i) {
                var _size = (this.$el.width() > this.$el.height())?this.$el.width():this.$el.height();
                this._width  =  this.$el.width();
                this._height =  this.$el.height();
                this.$el.velocity({
                    properties: { width: '80px', height: '80px', borderRadius: _size + 'px' },
                    options:    { duration: 400, easing: "spring", mobileHA: true }
                });

                this.$el.find('.layout_container').velocity({
                    properties: {opacity: 0 },
                    options:    {duration: 200, easing: 'lineal', mobileHA: true }
                });
                this.$el.find('.big_icon').velocity({
                    properties: {opacity: 1, borderRadius: '50px' },
                    options:    {duration: 200, easing: 'lineal', mobileHA: true }
                })
                this.$el.find('.big_icon').css('pointerEvents', 'all');
                
                this.$el.find('.icon').velocity({
                    properties: {opacity: 0 },
                    options:    {duration: 100, easing: 'lineal', mobileHA: true }
                })
                this.$el.find('.ui-resizable-handle').velocity({
                    properties: {opacity: 0 },
                    options:    {duration: 100, easing: 'lineal', mobileHA: true }
                });
                this.$el.find('.ui-resizable-handle').css('pointerEvents', 'none');
            },

            big_icon_click: function(i) {
                this.$el.velocity({
                    properties: {  borderRadius: '0px' },
                    options:    { duration: 100, easing: "lineal", mobileHA: true }
                });
                
                this.$el.velocity({
                    properties: {  width: this._width + 'px', height: this._height + 'px'},
                    options:    { duration: 300, easing: "spring", mobileHA: true }
                });                


                this.$el.find('.layout_container').velocity({
                    properties: {opacity: 1 },
                    options:    {duration: 100, easing: 'lineal', mobileHA: true }
                });
                this.$el.find('.big_icon').velocity({
                    properties: {opacity: 0, borderRadius: '0px' },
                    options:    {duration: 100, easing: 'lineal', mobileHA: true }
                })
                this.$el.find('.big_icon').css('pointerEvents', 'none');
                
                this.$el.find('.icon').velocity({
                    properties: {opacity: 1 },
                    options:    {duration: 100, easing: 'lineal', mobileHA: true }
                })
                this.$el.find('.ui-resizable-handle').velocity({
                    properties: {opacity: 1 },
                    options:    {duration: 100, easing: 'lineal', mobileHA: true }
                })
                this.$el.find('.ui-resizable-handle').css('pointerEvents', 'all');
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