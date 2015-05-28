'use strict';
var path = require('path');

module.exports = function(grunt) {
    var pkg, taskName;
    pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        dir: {
            bower: 'bower_components',
            src: 'webcomponents',
            lib: 'lib',
            js: 'js'
        },
        clean: {
            // delete inside of release directory
            deleteReleaseFolder00: {
                src: [
                    '<%= dir.src %>*/.DS_Store',
                    '<%= dir.src %>*/Thumbs.db'
                ],
            },
            // delete unnecessary files in release
            createLib: {
                src: [
                    '<%= dir.src %>*/.DS_Store',
                    '<%= dir.src %>*/Thumbs.db',
                    '<%= dir.src %>/*min.html',
                    '<%= dir.lib %>/*',
                    '<%= dir.bower %>/**/AUTHORS',
                    '<%= dir.bower %>/**/.bower.json',
                    '<%= dir.bower %>/**/bower.json',
                    '<%= dir.bower %>/**/gruntfile.js',
                    '<%= dir.bower %>/**/package.json',
                    '<%= dir.bower %>/**/sample.html',
                    '<%= dir.bower %>/**/playground.html',
                    '<%= dir.bower %>/**/README.md',
                    '<%= dir.bower %>/**/benchmark/',
                    '<%= dir.bower %>/**/codereview*',
                    '<%= dir.bower %>/**/*png',
                    '<%= dir.bower %>/**/demo.html',
                    '<%= dir.bower %>/**/index.html',
                    '<%= dir.bower %>/**/examples/**',
                    '<%= dir.bower %>/webaudio-controls'
                ]
            }

        },
        // vulcanize
        vulcanize: {
            default: {
                options: {
                    strip: true,
                    excludes: {
                        imports: [
                            "polymer.html"
                        ]
                    }
                },
                files: {
                    '<%= dir.src %>/webaudio-controls.min.html': '<%= dir.src %>/webaudio-controls.html',
                    '<%= dir.lib %>/webaudio-controls.min.html': '<%= dir.src %>/webaudio-controls.html',
                    '<%= dir.lib %>/webaudio-knob.min.html': '<%= dir.src %>/webaudio-knob.html',
                    '<%= dir.lib %>/webaudio-slider.min.html': '<%= dir.src %>/webaudio-slider.html',
                    '<%= dir.lib %>/webaudio-switch.min.html': '<%= dir.src %>/webaudio-switch.html',
                    '<%= dir.lib %>/webaudio-param.min.html': '<%= dir.src %>/webaudio-param.html',
                    '<%= dir.lib %>/webaudio-keyboard.min.html': '<%= dir.src %>/webaudio-keyboard.html'
                }
            }
        },
        // banner
        usebanner: {
            all: {
                options: {
                    position: 'top',
                    process: function ( filepath ) {
                        var license={
                            'basic': [
                                '<%= filename %> (Build of <%= grunt.template.today("yyyy/mm/dd") %>)',
                                '',
                                'Apache License Version 2.0, January 2004 http://www.apache.org/licenses/'
                            ],
                            'all': 'Copyright 2013 Eiji Kitamura / Ryoya KAWAI / Keisuke Ai / g200kg(Tatsuya Shinyagaito)',
                            'agektmr': 'webaudio-knob by Eiji Kitamura http://google.com/+agektmr\n Integrated and enhanced by g200kg http://www.g200kg.com/',
                            'aike': 'webaudio-switch by Keisuke Ai http://d.hatena.ne.jp/aike/\n Integrated and enhanced by g200kg http://www.g200kg.com/',
                            'g200kg': 'webaudio-param by g200kg http://www.g200kg.com/',
                            'ryoyakawai': 'webaudio-slider by Ryoya Kawai https://plus.google.com/+ryoyakawai\n  Integrated and enhanced by g200kg http://www.g200kg.com/'
                        };
                        var crstate;//='\n'+license.join("\n")+'\n';
                        switch((filepath.match(/\/([^/]*)$/)[1]).split(".").pop()) {
                          case "html":
                            switch(filepath.match(/\/([^/]*)$/)[1].split(".").shift()) {
                              case "webaudio-knob":
                                license.basic[1]=license.agektmr;
                                break;
                              case "webaudio-switch":
                                license.basic[1]=license.aike;
                                break;
                              case "webaudio-param":
                              case "webaudio-keyboard":
                                license.basic[1]=license.g200kg;
                                break;
                              case "webaudio-slider":
                                license.basic[1]=license.ryoyakawai;
                                break;
                              case "webaudio-controls":
                            default:
                                license.basic[1]=license.all;
                                break;
                            }
                            crstate='<!--\n'+license.basic.join("\n")+'\n-->';
                            break;
                          case "js":
                          case "css":
                          default:
                            license.basic[1]=license.all;
                            crstate='/*! '+license.basic.join("\n")+'\n'+' */';
                            break;
                            
                        }
                        return grunt.template.process(
                            crstate, {
                                data: {
                                    filename: filepath.match(/\/([^/]*)$/)[1]
                                }
                            }
                        );
                    }
                },
                files: {
                    src: [
                        '<%= dir.src %>/webaudio-controls.min.html',
                        '<%= dir.lib %>/webaudio-controls.min.html',
                        '<%= dir.lib %>/webaudio-knob.min.html',
                        '<%= dir.lib %>/webaudio-slider.min.html',
                        '<%= dir.lib %>/webaudio-switch.min.html',
                        '<%= dir.lib %>/webaudio-param.min.html',
                        '<%= dir.lib %>/webaudio-keyboard.min.html'
                    ]
                }
            }
        },
        // configuration of localhost
        // check on http://localhost:9001/
        connect: {
            createRelease: {
                options: {
                    port: 9001,
                    hostname: 'localhost',
                    base: './',
                    keepalive: true,
                    open: false
                }
            }
        }        
    });
    
    // autoload packages which are listed in pakage.json
    for(taskName in pkg.devDependencies) {
        if(taskName.substring(0, 6) == 'grunt-') {
            grunt.loadNpmTasks(taskName);
        }
    }

    // Grunt command for creating deliver release
    grunt.registerTask('createLib', ['clean:createLib', 'vulcanize', 'usebanner']);

    grunt.registerTask('eatwarnings', function() {
        grunt.warn = grunt.fail.warn = function(warning) {
            grunt.log.error(warning);
        };
    });
};