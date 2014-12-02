'use strict';

define([
    'text!modules/bubblemenu/templates/bubblemenu-view.html',
    ],
    function(bubblemenu_view){
        App.BubbleMenuModule.BubbleMenuView = Backbone.Marionette.CollectionView.extend({
            childView: App.BubbleMenuModule.BubbleMenuItemView,
            triggers: {

            },
            attributes : function () {
                return {
                    class : 'app_bubblemenu',
                    id : this.options.bubblemenu_id
                };
            },
            template: function() {
                return _.template(bubblemenu_view)({
                })
            },
            initialize: function() {
            },
            
            onShow: function(){
            }
        });

    }
)

