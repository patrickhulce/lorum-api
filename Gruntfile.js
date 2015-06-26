var _ = require('lodash');
module.exports = function (grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.initConfig({
        jshint: { 'all': ['src/**/*.js'] },
        exec: {
          sync_db: {
            command: 'node src/db/sync.js'
          }
        },
        nodemon: {
            dev: {
              script: 'src/server.js',
              options: {
                watch: ['src'],
                env: _.defaults({
                  PORT: 3000,
                  NODE_ENV: 'dev'
                }, require('./facebook.secret'))
              }
            }
        }
    });
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('sync', ['exec:sync_db']);
    grunt.registerTask('default', ['nodemon:dev']);
};
