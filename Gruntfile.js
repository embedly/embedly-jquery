/*global module:false*/
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('embedly-jquery.jquery.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") + "\\n" %>' +
        ' * <%= pkg.homepage + "\\n" %>' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name + "\\n" %>' +
        ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") + "\\n" %> */ <%="\\n" %>'
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      },
      dist: {
        //src: ['src/<%= pkg.name %>.js'],
        src: [
          'src/jquery.embedly.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },
    qunit: {
      all: ['test/**/*.html']
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      },
      all: ['Gruntfile.js', 'src/jquery.embedly.js', 'test/**/*.js']
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint','concat', 'uglify']);

};
