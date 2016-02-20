var gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	insert = require('gulp-insert')
	;

var paths = {
	js: {
		online: [
			'src/includes/*.js',
			'src/ccutils-core.js',
		],
		local: [
			'src/includes/*.js',
			'src/ccutils-core.js',
			'src/ccutils-pgn.js'
		]
	},
	bookmarklets: [
		'src/bookmarklet.js',
		'src/bookmarklet-online.js'
	]
};

gulp.task('js-online', function() {
	return gulp.src(paths.js.online)
		.pipe(concat('ccutils-bundled.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('js-local', function() {
	return gulp.src(paths.js.local)
		.pipe(concat('ccutils-bundled-pgn.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', function() {
	gulp.start('js-local', 'js-online', 'bookmarklets');
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