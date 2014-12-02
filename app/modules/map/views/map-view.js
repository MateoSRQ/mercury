'use strict';

define([
    'text!modules/map/templates/map-view.html',
    ],
    function(map_view){
        App.MapModule.MapView = Backbone.Marionette.ItemView.extend({
            triggers: {
            },
            attributes : function () {
                return {
                    class : 'openlayers_map',
                    id : this.options.map_id
                };
            },
            template: function() {
                return _.template(map_view)({
                })
            },
            onShow: function(){
                console.log(this.options)
                console.log('map view shown');
            }
        });
    }
)

