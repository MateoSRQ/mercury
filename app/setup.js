/* setup.js */
'use strict';
window.App = null;
window.debug = 0;

requirejs.config({
    baseUrl: 'libs/requirejs',
    waitSeconds: 30,
    shim: {
        'jquery':  { deps: [] },
        'underscore': { deps: [], exports: ['_'] },
        'backbone': { deps: ['underscore', 'jquery'], exports: ['Backbone'] },
        'marionette': { deps: ['backbone'], exports:  ['Marionette']},
        'bootstrap': { deps: ['jquery'] },
        'velocity': { deps: [] },
        'app': { deps: ['marionette', 'bootstrap'] }
    },
    paths: {
        'jquery': '../jquery/jquery-2.1.1.min',
        'underscore': '../underscore/underscore-1.7.0.min',
        'backbone': '../backbone/backbone-1.1.2.min',
        'marionette': '../marionette/marionette-2.2.0.min',

        'bootstrap': '../bootstrap/js/bootstrap.min',
        'css_bootstrap': '../bootstrap/css',
        'material_design': '../bootstrap_themes/material-design/dist/js/material.min',
        'css_material_design': '../bootstrap_themes/material-design/dist/css',
        'velocity': '../velocity/velocity-1.1.0-min',
        'css_font-awesome': '../font-awesome',
        
        'app': '../../app/app',
        'modules': '../../app/modules',
        'models': '../../app/models',
        
        'fonts': '../../fonts'
    }
});

requirejs.onResourceLoad = function (context, map, depArray) {
    if (!window.debug) {
        console.log('[' + map.name + '] resource loaded!');
    }
    
}


