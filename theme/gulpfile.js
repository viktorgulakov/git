var gulp			= require('gulp'),
	autoprefixer	= require('autoprefixer'),
	nano			= require('cssnano'),
	concat			= require('gulp-concat'),
	less			= require('gulp-less'),
	postcss			= require('gulp-postcss'),
	uglify			= require('gulp-uglify'),
	watch			= require('gulp-watch'),
	rename			= require('gulp-rename'),
	sourcemaps		= require('gulp-sourcemaps'),
	plumber			= require('gulp-plumber'),
	options			= {
		sourcePathStyles		: 'less',
		sourcePathScripts		: 'js',
		sourcePathImages		: 'images',
		destinationPathStyles	: 'css'
	}
;

gulp.task('less', function() {
	return gulp.src('less/styles.less')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(postcss([
			autoprefixer({
				browsers: ['last 2 versions']
			})
		]))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(options.destinationPathStyles))
		;
});

gulp.task('styles:min', ['less'], function() {
	return gulp.src(options.destinationPathStyles + '/*[!(.min)].css')
		.pipe(postcss([
			nano()
		]))
		.pipe(rename(function (path) {
			path.basename += ".min";
		}))
		.pipe(gulp.dest(options.destinationPathStyles))
		;
});

gulp.task('jsMain:min', function() {
	return gulp.src([options.sourcePathScripts + '/main.js'])
		.pipe(uglify({
			compress: {
				drop_console: true
			}
		}))
		.pipe(rename('main.min.js'))
		.pipe(gulp.dest(options.sourcePathScripts))
		;
});

gulp.task('jsLibs:concat', function() {
	return gulp.src([
		options.sourcePathScripts + '/jquery-2.2.0.min.js',
		options.sourcePathScripts + '/jquery.ui.touch-punch.min.js',
		options.sourcePathScripts + '/swiper/dist/js/swiper.min.js',
		options.sourcePathScripts + '/radiocheck.js'
	])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(options.sourcePathScripts))
		;
});

gulp.task('jsLibs:uglify', ['jsLibs:concat'], function() {
	return gulp.src([options.sourcePathScripts + '/libs.js'])
			.pipe(uglify())
			.pipe(rename('libs.min.js'))
			.pipe(gulp.dest(options.sourcePathScripts))
			;
});

gulp.task('watch', function() {
	gulp.watch(options.sourcePathStyles + '/**/*.less', ['less']);
});

gulp.task('default', ['less', 'watch','jsLibs:concat']);
gulp.task('release', ['styles:min', 'jsMain:min', 'jsLibs:uglify']);


