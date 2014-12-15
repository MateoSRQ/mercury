'use strict';

define([
    'text!modules/layout/templates/layout-view.html',
    ],
    function(layout_view){
        App.LayoutModule.LayoutView = Backbone.Marionette.CollectionView.extend({
            childView: App.LayoutModule.LayoutItemView,
            triggers: {
            },
            attributes : function () {
                return {
                    class : 'app_layout',
                    id : this.options.layout_id
                };
            },
            template: function() {
                return _.template(layout_view)({
                })
            },
            onShow: function(){
                
            }
        });
    }
)

