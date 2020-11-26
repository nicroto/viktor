'use strict';

var pathUtils = require('path'),
	PROJECT_DIR_PATH = pathUtils.resolve( __dirname ),
	UNLIMITED_SIZE = 1000000;

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			dev: [
				'src/server/client/index.html',
				'src/server/client/images',
				'src/server/client/impulses',
				'src/server/client/js/app.js'
			],
			devStyles: [
				'src/server/client/css'
			],
			build: ['build/']
		},
		jshint: {
			all: [
				'src/**/*.js',
				'test/**/*.js',
				'Gruntfile.js',
				'!src/server/client/**/*.js',
				'!src/app/ui/module/maillist/controller/midi-data.js'
			],
			checkstyle: 'checkstyle.xml',
			options: {
				jshintrc: '.jshintrc'
			}
		},
		simplemocha: {
			all: { src: 'test/**/*-test.js' }
		},

		browserify: {
			app_debug: {
				src: ['src/app/app.js'],
				dest: 'src/server/client/js/app.js',
				options: {
					transform: [],
					debug: true
				}
			},
			app: {
				src: ['src/app/app.js'],
				dest: 'src/server/client/js/app.js',
				options: {
					transform: [],
					plugin: [ [ 'minifyify', { map: false } ] ],
					debug: false
				}
			}
		},
		stylus: {
			compile: {
				options: {
					paths: ['src/client/styles'],
					urlfunc: 'embedurl'
				},
				files: {
					'src/server/client/css/main.css': 'src/client/styles/main.styl', // 1:1 compile
				}
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: "src/client/images/",
						src: "**",
						dest: "src/server/client/images/"
					},
					{
						expand: true,
						cwd: "src/client/",
						src: "*.html",
						dest: "src/server/client/"
					},
/* Tuna resources */{
						expand: true,
						cwd: "node_modules/viktor-nv1-engine/src/daw/non-npm/tuna/impulses/",
						src: "**",
						dest: "src/server/client/impulses/"
					}
				]
			}
		},
		watch: {
			clientNonStyles: {
				files: ['src/app/**/*', 'src/client/images/*', 'src/client/index.html', 'non-npm/**/*'],
				tasks: ['devRebuild']
			},
			clientStyles: {
				files: ['src/client/styles/*'],
				tasks: ['devRebuildStyles']
			},
			server: {
				files:  [ 'src/server/**/*', '!src/server/client/**/*' ],
				tasks:  [ 'express:server' ],
				options: {
					spawn: false
				}
			}
		},
		express: {
			options: {},
			server: {
				options: {
					script: 'src/server/server.js',
					port: 5000
				}
			}
		},
		shell: {
			update_website: {
				command: function() {
					return "./bin/update-website.sh";
				},
				options: {
					execOptions: {
						cwd: PROJECT_DIR_PATH,
						maxBuffer: UNLIMITED_SIZE
					}
				}
			}
		}

	});

	// task loading
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-simple-mocha');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-shell');

	// grunt.registerTask('register-non-npm', 'load all non-npm modules as globally requestable modules', function() {
	// 	// if async
	// 	// var done = this.async();

	// 	var packageJson = grunt.config.get( "pkg" ),
	// 		nonNpm = packageJson.browser,
	// 		names = Object.keys( packageJson.browser );

	// 	grunt.log.writeln( names.length + " non-npm modules were found:\n" + names.join( "\n" ) );

	// 	names.forEach( function( moduleName ) {
	// 		var modulePath = pathUtils.resolve( nonNpm[ moduleName ] );

	// 		mockery.registerSubstitute( moduleName, modulePath );

	// 		grunt.verbose.writeln( "\"" + moduleName + "\"" + " was replaced with \"" + modulePath + "\"" );
	// 	} );
	// } );

	// run lint and tests
	grunt.registerTask('default', ['c', 'simplemocha', 'jshint:all']);

	// start develop
	grunt.registerTask('devRebuildApp', ['clean:dev', 'browserify:app_debug', 'copy']);
	grunt.registerTask('devRebuildStyles', ['clean:devStyles', 'stylus']);
	grunt.registerTask('devRebuild', ['devRebuildApp', 'devRebuildStyles']);
	grunt.registerTask('dev', ['devRebuild', 'express', 'watch']);

	// build for website (output is minified)
	grunt.registerTask('webRebuild', ['devRebuildApp', 'devRebuildStyles']);
	grunt.registerTask('web', ['clean:build', 'webRebuild', 'shell:update_website', 'clean:build', 'devRebuild']);

	// shorthands
	grunt.registerTask('d', ['dev']);
	grunt.registerTask('h', ['jshint:all']);
	grunt.registerTask('c', ['clean:dev', 'clean:build']);
};