/* global module:false, process:false */

module.exports = function(grunt) {
    'use strict';

    var path = require('path');
    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt/config'),
        init: true,
        data: {
            pkg: grunt.file.readJSON('package.json')
        }
    });

    grunt.registerTask('css', [
        'copy:fonts',
        'less'
    ]);

    grunt.registerTask('build', [
        'css'
    ]);

    grunt.registerTask('rebuild', [
        'clean',
        'build'
    ]);

    grunt.registerTask('refdoc', [
        'jsdoc:reference'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};