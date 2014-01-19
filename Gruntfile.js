module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';\n'
			},
			bundle: {
				src: [
					'src/includes/*.js',
					'src/ccutils-core.js',
					'src/ccutils-pgn.js'
				],
				dest: 'src/ccutils-bundled.js'
			}
		},
		uglify: {
			options: {
				compress: {
					'drop_console': false,
					'negate_iife': false
				}
			},
			min: {
				files: {
					'ccutils-bundled.min.js': ['<%= concat.bundle.dest %>']
				}
			},
			bookmarklets: {
				options: {
					'banner': 'javascript:'
				},
				files: {
					'bookmarklets/bookmarklet.txt': 'src/bookmarklet.js',
					'bookmarklets/bookmarklet-online.txt': 'src/bookmarklet-online.js'
				}
			}
		},
		watch: {
			files: ['<%= concat.bundle.src %>'],
			tasks: ['default']
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat', 'uglify']);
};