module.exports = function (grunt) {

	grunt.initConfig({

		concat: {
			options: {

			},
			dist: {
				src: [
					'bower_components/underscore/underscore.js',
					'bower_components/angular/angular.js',
					'bower_components/angular-animate/angular-animate.js',
					'bower_components/angular-aria/angular-aria.js',
					'bower_components/angular-material/angular-material.js',
					'bower_components/angular-local-storage/dist/angular-local-storage.js',
					'js/lib/angular-json-explorer.js',
					'js/src/**/*.js'
				],
				dest: 'build.js',
			},
		},

		watch: {
			scripts: {
				files: ['<%= concat.dist.src %>'],
				tasks: ['concat'],
				options: {
					spawn: false,
				},
			},
		},

		reactjsx: {
			all: {
				files: [
					{
						expand: true,
						src: [
							'**/*.jsx'
						],
						ext: '.js'
					}
				]
			},
		},
	});

	grunt.loadNpmTasks('grunt-reactjsx');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat']);

};