var path = require('path');

module.exports = function (grunt) {

    'use strict';

    // Load Grunt tasks automatically
    require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

    grunt.initConfig({

        // ---------------------------------------------------------------------
        // | Project Settings                                                  |
        // ---------------------------------------------------------------------

        settings: {
            // Configurable paths
            dir: {
                src: 'src',
                dist: 'dist'
            }
        },

        // ---------------------------------------------------------------------
        // | Tasks Configurations                                              |
        // ---------------------------------------------------------------------

        clean: {
            // List of files that will be removed before the
            // build process is started
            all: [
                '.tmp', // used by the `usemin` task
                '<%= settings.dir.dist %>'
            ],

            // List of files no longer required after the build
            // process is completed
            tmp: [
                '.tmp',  // used by the `usemin` task
                '<%= settings.dir.dist %>/css/less'
            ]
        },

        less: {
              build: {
                options: {
                  compress: true,
                  optimization: 5
                },
                files: {
                  'src/css/main.css': 'src/css/less/main.less'
                }
              }
            },

        cssmin: {
            minify: {
                // In-depth information about the options:
                // https://github.com/GoalSmashers/clean-css#how-to-use-clean-css-programmatically
                options: {
                    compatibility: 'ie8',
                    keepSpecialComments: '*'
                }
            }
        },


        connect: {
            options: {
                hostname: 'localhost',  // → Change this to '0.0.0.0' if
                                        // the server needs to be accessed
                                        // from outside of the LAN
                livereload: 35729,
                port: 8080              // → 8080 is used as it is the official
                                        // alternate to port 80 (default port
                                        // for HTTP), and it doesn't require
                                        // root access:
                                        // http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
            },
            livereload: {
                options: {
                    base: '<%= settings.dir.src %>',

                    // Automatically open the webpage in the default browser
                    open: true
                }
            }
        },

        copy: {
            files: {
                cwd: '<%= settings.dir.src %>/',
                dest: '<%= settings.dir.dist %>/',
                dot: true,
                expand: true,
                src: [
                    // copy all files
                    '**',

                    // except: files from the `css/` and `js/` directory
                    // (other tasks will handle the copying of these files)
                    '!js/*',

                    '!img/old/*'
                ]
            }
        },

        jshint: {
            files: [
                'Gruntfile.js',
                '<%= settings.dir.src %>/js/*.js'
            ],
            options: {
                // Search for `.jshintrc` files relative to files being linted
                jshintrc: true
            }
        },

        htmlmin: {
            build: {
                files: [
                {
                  expand: true,     // Enable dynamic expansion.
                  cwd: '<%= settings.dir.dist %>/',      // Src matches are relative to this path.
                  src: ['**/*.html'], // Actual pattern(s) to match.
                  dest: '<%= settings.dir.dist %>/',   // Destination path prefix.
                },
              ],

                // In-depth information about the options:
                // http://perfectionkills.com/experimenting-with-html-minifier/#options
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true
                }
            }
        },

        filerev: {
            files: {
                src: [
                    '<%= settings.dir.dist %>/js/*.js',
                    '<%= settings.dir.dist %>/css/*.css',
                    '<%= settings.dir.dist %>/img/*.png'
                ]
            },
            options: {
                algorithm: 'sha1',
                length: 7
            }
        },

        uglify: {
            generated: {
                options: {
                    report: 'min',
                    mangle: false
                },
                files: {
                    src: '<%= settings.dir.src %>/js/*.js',  // source files mask
                    dest: '<%= settings.dir.dist %>/js',    // destination folder
                    expand: true,    // allow dynamic building
                    flatten: true,   // remove all unnecessary nesting
                    ext: '.min.js'   // replace .js to .min.js
                }
            }
        },

        uncss: {
            // In-depth information about the options:
            // https://github.com/addyosmani/grunt-uncss#options
            options: {
                //ignore: '',
                ignoreSheets: [/fonts.googleapis/, /normalize.css/]
            }
        },

        usemin: {
            // List of files for which to update asset references
            html: '<%= settings.dir.dist %>/**.html'
        },

        useminPrepare: {
            // List of HTML files from which to process the usemin blocks
            // https://github.com/yeoman/grunt-usemin#blocks
            html: '<%= settings.dir.src %>/**.html',

            // Workflow configurations:
            // https://github.com/yeoman/grunt-usemin#flow
            options: {
                flow: {
                    html: {
                        steps: {
                            css: [

                                {
                                    // Note: this task will also take care of concatenation
                                    name: 'uncss',
                                    createConfig: function (context, block) {

                                        // Set the location where this task will created
                                        // its files, so that the next task knows where
                                        // to take them from
                                        context.outFiles = [ block.dest ];

                                        // Task configurations
                                        return {
                                            files: [{
                                                dest: path.join(context.outDir, block.dest),

                                                // List of HTML files that UnCSS will use
                                                // TODO: find a better solution
                                                src: [ '<%= settings.dir.src %>/**.html' ]
                                            }]
                                        };
                                    }
                                },

                                'cssmin'

                            ],

                            js:['uglifyjs']

                        },
                         post: {}
                    }
                }
            }
        },

        watch: {
            files: '<%= settings.dir.src %>/**',
            options: {
                livereload: '<%= connect.options.livereload %>'
            },
            scripts: {
                files: '<%= jshint.files %>',
                tasks: 'jshint',
                options: {
                    spawn: false
                }
            },
            less: {
                files: ['<%= settings.dir.src %>/css/less/**'],
                tasks: ['less'],
            }
        }

    });

    // -------------------------------------------------------------------------
    // | Main Tasks                                                            |
    // -------------------------------------------------------------------------

    grunt.registerTask('build', [
        'clean:all',
        'less',
        'copy',
        'useminPrepare',
        'uncss',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin',
        'clean:tmp'
    ]);

    // default task
    // (same as `build`, as `build` will be used more often)
    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('dev', [
        'less',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('test', [
        'jshint',
        'build'
    ]);

};
