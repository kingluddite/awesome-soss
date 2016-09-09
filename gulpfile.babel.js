'use strict';
// Load Node Modules/Plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
// import browserSync from 'browser-sync';
import del from 'del';

var argv = require( 'yargs' ).argv;
var browserSync = require( 'browser-sync' ).create();
var gutil = require( 'gulp-util' );
var thePackage = require( './package.json' );
// Remove existing docs and dist build

const reload = browserSync.reload;
const $ = gulpLoadPlugins();

// the paths objects will save us a lot of path typing
var paths = {
	// for local development
	'local': {
		'src': {
			'sass': './src/scss/',
			'js': './src/js/',
			'images': './src/img/',
			'fonts': './src/fonts/',
			'html': './src/'
		},
		'dist': {
			'css': './dist/assets/css/',
			'js': './dist/assets/js/',
			'fonts': './dist/assets/fonts/',
			'images': './dist/assets/img/',
			'html': './dist/'
		}
	},
	// for our production server
	'production': {
		'src': {
			'html': './src/',
			'sass': './src/scss/',
			'js': './src/js/',
			'images': './src/img/',
			'fonts': './src/fonts/'
		},
		'dist': {
			// example using Digital Ocean
			'html': '/var/www/html/awesome-soss/',
			'css': '/var/www/html/awesome-soss/assets/css/',
			'js': '/var/www/html/awesome-soss/assets/js/',
			'fonts': '/var/www/html/awesome-soss/assets/fonts/',
			'images': '/var/www/html/awesome-soss/assets/img/'
		}
	}
};

/**
 *
 * Environment Check
 *
 */

// are we working locally or on our production server?
var environment = argv.production;

function checkEnv() {
	var currentEnv;

	$.ifElse(
		environment,
		function () {
			currentEnv = paths.production;
		},
		function () {
			currentEnv = paths.local;
		}
	);

	return currentEnv;
}

var currentEnv = checkEnv();

var banner = [
  '/*!\n' +
  ' * <%= thePackage.name %>\n' +
  ' * <%= thePackage.title %>\n' +
  ' * <%= thePackage.url %>\n' +
  ' * @author <%= thePackage.author %>\n' +
  ' * @version <%= thePackage.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= thePackage.license %> licensed.\n' +
  ' */',
  '\n'
].join( '' );

gulp.task( 'html', () => {
	return gulp.src( currentEnv.src.html + '*.html' )
		.pipe( gulp.dest( currentEnv.dist.html ) );
} );

/**
 *
 * Sass
 *
 */

gulp.task( 'sass', () => {
	return gulp.src( currentEnv.src.sass + 'style.scss' )
		.pipe( $.plumber() )
		// expanded
		.pipe( $.sourcemaps.init() )
		.pipe( $.sass().on( 'error', $.sass.logError ) )
		.pipe( $.autoprefixer( {
			browsers: [ 'last 4 version' ]
		} ) )
		.pipe( gulp.dest( currentEnv.dist.css ) )
		// compressed
		// minify the concatenated CSS
		.pipe( $.cssnano() )
		.pipe( $.rename( {
			suffix: '.min'
		} ) )
		.pipe( $.header( banner, {
			thePackage: thePackage
		} ) )
		.pipe( $.sourcemaps.write() )
		.pipe( gulp.dest( currentEnv.dist.css ) )
		.pipe( browserSync.reload( {
			stream: true
		} ) );
} );

gulp.task( 'html', function () {
	return gulp.src( currentEnv.src.html + '*.html' )
		.pipe( gulp.dest( currentEnv.dist.html ) );
} );

/**
 *
 * Image Optimization
 *
 */


gulp.task( 'images', function () {
	// grab only the stuff in images with these extensions {png,jpg,gif,svg,ico}
	return gulp.src( currentEnv.src.images + '**/**/*.{png,jpg,gif,svg,ico}' )
		.pipe( $.newer( currentEnv.dist.images ) )
		.pipe( $.imagemin( {
			progressive: true
		} ) )
		.pipe( gulp.dest( currentEnv.dist.images ) );
} );

/**
 *
 * JavaScript
 *
 */

gulp.task( 'js', () => {
	gulp.src( currentEnv.src.js + 'scripts.js' )
		.pipe( $.sourcemaps.init() )
		.pipe( $.jshint( '.jshintrc' ) )
		.pipe( $.jshint.reporter( 'default' ) )
		.pipe( $.header( banner, {
			thePackage: thePackage
		} ) )
		.pipe( gulp.dest( currentEnv.dist.js ) )
		.pipe( $.uglify() )
		.pipe( $.header( banner, {
			thePackage: thePackage
		} ) )
		.pipe( $.rename( {
			suffix: '.min'
		} ) )
		.pipe( $.sourcemaps.write() )
		.pipe( gulp.dest( currentEnv.dist.js ) )
		.pipe( reload( {
			stream: true,
			once: true
		} ) );
} );

/**
 *
 * Browser-Sync
 *
 */

// enable Gulp to spin up a server
gulp.task( 'browser-sync', () => {
	browserSync.init( null, {
		// let BrowserSync know where the root of the should be (`dist`)
		server: {
			// our root distribution (production) folder is `dist`
			baseDir: 'dist'
		}
	} );
} );
gulp.task( 'bs-reload', () => {
	reload();
} );

/**
 *
 * Cleanup - Blow up everything inside `dist/assets` when you run gulp
 *
 */

gulp.task( 'clean', del.bind( null, [ 'dist/assets/' ] ) );

/**
 *
 * Watching
 *
 */

gulp.task( 'dist', [ 'html', 'sass', 'js', 'images', 'browser-sync' ], () => {

	// globbing
	// matches any file with a .scss extension in dist/scss or a child directory
	gulp.watch( currentEnv.src.sass + '**/*.scss', [ 'sass' ] );
	gulp.watch( currentEnv.src.js + '*.js', [ 'js' ] );
	gulp.watch( currentEnv.src.html + '*.html', [ 'html', 'bs-reload' ] );
	gulp.watch( currentEnv.src.images + '**/**/*.{png,jpg,gif,svg,ico}', [ 'images' ] );
} );

gulp.task( 'default', [ 'clean' ], () => {
	gulp.start( 'dist' );
} );