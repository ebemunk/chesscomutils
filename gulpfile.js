var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert')
	;

var paths = {
	js: [
		'src/includes/*.js',
		'src/ccutils-core.js',
		'src/ccutils-pgn.js'
	],
	bookmarklets: [
		'src/bookmarklet.js',
		'src/bookmarklet-online.js'
	]
};

gulp.task('js', function() {
	return gulp.src(paths.js)
		.pipe(concat('ccutils-bundled.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./'));
});

gulp.task('default', function() {
	gulp.start('js', 'bookmarklets');
});

gulp.task('bookmarklets', function() {
	return gulp.src(paths.bookmarklets)
		.pipe(uglify())
		.pipe(insert.prepend('javascript:'))
		.pipe(rename({extname: '.txt'}))
		.pipe(gulp.dest('bookmarklets'));
});

gulp.task('watch', function() {
	gulp.watch(paths.js, ['js', 'bookmarklets']);
});