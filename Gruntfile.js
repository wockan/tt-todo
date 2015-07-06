'use strict';


module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    watch: {
      compass: {
        files: ['frontapp/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:dev']
      },
      react: {
        files: ['frontapp/scripts/*.jsx'],
        tasks: ['react']
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'frontapp/styles',
          relativeAssets: false,
          assetCacheBuster: false,
          cssDir: 'todoapp/static/styles',
          debugInfo: true
        }
      }
    },
    react: {
      dev: {
        files: [{
          expand: true,
          cwd: 'frontapp/scripts',
          src: ['**/*.jsx'],
          dest: 'todoapp/static/scripts/',
          ext: '.js'
        }]
      }
    },
  });

  grunt.registerTask('watch-compile', 'watch files and compile', function (target) {

  grunt.task.run([

    'react',
    'compass:dev',
    'watch'
  ]);
});
};
