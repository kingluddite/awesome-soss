'use strict';

// imports
// variables
// paths
// environment
// config
// banner
// Tasks
//   a - html
//   b - vendor CSS
//   c - Sass (custom CSS)
//   d - vendor JavaScript
//   e - custom JavaScript
//   f - images
//   g - vendor fonts
//   h - fonts
// browser-sync
// clean
// watch

// Load Node Modules/Plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import shell from 'gulp-shell';

// define constants
const argv = require( 'yargs' ).argv;
const browserSync = require( 'browser-sync' ).create();
const gutil = require( 'gulp-util' ); // equivalent of console.log - 'gutil.log("test");'
const reload = browserSync.reload;
const $ = gulpLoadPlugins();

// file paths to all assets
var paths = require( './gulp/paths.json' );

// are we working locally or on our production server?
var environment = argv.production;
var checkEnv = require( './gulp/env-check.js' )( $, environment, paths );
var currentEnv = checkEnv();
var config = require( './gulp/config.js' )( checkEnv() );

function getTask( task ) {
  return require( './gulp/' + task )( gulp, $, paths, config, currentEnv, browserSync );
}

const banner = require( './gulp/banner.js' )();

// HTML
gulp.task( 'html', require( './gulp/html' )( gulp, $, paths, config, currentEnv, browserSync ) );

// CSS

// build css lib scripts
gulp.task( 'compile-css-lib', getTask( 'compile-css-lib' ) );

// Sass (css)
gulp.task( 'sass', getTask( 'sass' ) );

// JavaScript

// vendor js (3rd Party)
gulp.task( 'compile-js-lib', getTask( 'compile-js-lib' ) );

// custom js
gulp.task( 'custom-js', getTask( 'custom-js' ) );

// image optimization
gulp.task( 'images', getTask( 'images' ) );

// Fonts
// vendor fonts
gulp.task( 'vendor-fonts', () => {


  return gulp.src( config.vendorFonts + '**/*.{woff,woff2,ttf}' )
    .pipe( gulp.dest( currentEnv.dist.fonts ) )
} );

// custom fonts
gulp.task( 'fonts', getTask( 'fonts' ) );

/**
 *
 * Browser-Sync
 *
 */

// enable Gulp to spin up a server
gulp.task( 'browser-sync', getTask( 'browser-sync' ) );

gulp.task( 'bs-reload', () => {
  reload();
} );

/**
 *
 * Cleanup - Blow up everything inside `dist/assets` when you run gulp
 *
 */

// Synchronously delete the lib and dist folders with every gulp run

gulp.task( 'clean', del.bind( null, [ 'lib', 'app', 'dist' ] ) );

// flow runs here and enables us to strongly type
// our variables
gulp.task( 'flow', shell.task( [
	'flow'
], {
  ignoreErrors: true
} ) );

// now we can write ES6 code in our src file
// and it will be output into the app folder
// we'll then take that app/script.js and minify that
// and rename to script.min.js in the dist folder
gulp.task( 'babel', shell.task( [
	'babel src --out-dir app'
] ) );

gulp.task( 'dist', getTask( 'dist' ) );

gulp.task( 'default', [ 'clean', 'flow', 'babel' ], () => {
  gulp.start( 'dist' );
} );
