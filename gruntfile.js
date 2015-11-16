module.exports = function (grunt) {

	grunt.initConfig({
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

	grunt.registerTask('default', ['grunt']);

};