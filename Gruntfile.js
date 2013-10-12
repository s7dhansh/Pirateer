module.exports = function (grunt) {

    grunt.initConfig({
        pkg   : grunt.file.readJSON('package.json'),
        banner: 'v<%= pkg.version manifest["version"] %>, <%= grunt.template.today("dd-mm-yy HH:MM") %>',

        bumpup: {
            files: [
                'public/manifest.json'
            ]
        },

        concat: {
            options: {
                separator: ';'
            },
            dist   : {
                src : ['src/**/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        uglify: {
            options: {
                compress: {
                    global_defs: {
                        "DEBUG": false
                    },
                    dead_code  : true
                }
            },
            build  : {
                files: [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd   : 'public/js/',      // Src matches are relative to this path.
                        src   : ['**/*.js', '!lib/*.js'], // Actual pattern(s) to match.
                        dest  : 'build/js',   // Destination path prefix.
                        ext   : '.js'   // Dest filepaths will have this extension.
                    }
                ]
            }
        },

        useminPrepare: {
            html   : 'index.html',
            options: {
                dest: 'build/'
            }
        },

        usemin: {
            html   : ['**/*.html'],
            css    : ['**/*.css'],
            options: {
                dirs: ['temp', 'dist']
            }
        },

        cssmin: {
            add_banner: {
                options: {
                    banner: '/* CSS minified file */'
                },
                files  : {
                    'build/style.min.css': ['public/css/**/*.css']
                }
            }
        },

        htmlmin: {                                     // Task
            build: {                                      // Target
                options: {                                 // Target options
                    removeComments    : true,
                    collapseWhitespace: true
                },
                files  : [
                    {
                        expand: true,     // Enable dynamic expansion.
                        cwd   : 'public/',      // Src matches are relative to this path.
                        src   : ['*.html'], // Actual pattern(s) to match.
                        dest  : 'build/'   // Destination path prefix
                    }
                ]
            }
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd   : 'public/',
                        src   : ['manifest.json', 'js/lib/*.js', 'css/**/*.css', 'img/**/*'],
                        dest  : 'build/'
                    }
                ]
            }
        },

        clean: {
            build: ["build/"]
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.registerTask('build', ['bumpup:patch' , 'clean:build', 'uglify:build', 'htmlmin:build', 'copy:build']);
};