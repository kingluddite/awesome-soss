'use strict';

// variables
// environment
// config
// banner
// Tasks
//   a - html
//   b - vendor CSS
//   c - Sass
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

// define constants
const argv = require('yargs').argv;
const browserSync = require('browser-sync').create();
const gutil = require('gulp-util'); // equivalent of console.log - 'gutil.log("test");'
const reload = browserSync.reload;
const $ = gulpLoadPlugins();

var paths = require('./paths.json');

/**
 *
 * Environment Check
 *
 */

// are we working locally or on our production server?

var environment = argv.production;

// function checkEnv() {
//   var currentEnv;
//
//   $.ifElse(
//     environment,
//     () => {
//       currentEnv = paths.production;
//     },
//     () => {
//       currentEnv = paths.local;
//     }
//   );
//
//   return currentEnv;
// }
//
// var currentEnv = checkEnv();

var checkEnv = require('./env-check.js')($, environment, paths);
var currentEnv = checkEnv();
var config = require('./config.js')(checkEnv());

function getTask(task) {
  return require('./gulp/' + task)(gulp, $, paths, config, currentEnv, browserSync);
}

/**
 *
 * Banner
 *
 */

const banner = require('./banner.js')();

/**
 *
 * Tasks
 *
 */

/**
 *
 * HTML
 *
 */

gulp.task('html', require('./gulp/html')(gulp, $, paths, config, currentEnv, browserSync));

/**
 *
 * CSS
 *
 */

// vendor css

//build css lib scripts

gulp.task('compile-css-lib', getTask('compile-css-lib'));

/**
 *
 * Sass (custom)
 *
 */

gulp.task('sass', getTask('sass'));

/**
 *
 * JavaScript
 *
 */

gulp.task('custom-js', getTask('custom-js'));

// Vendor JavaScript

//build js lib scripts

gulp.task('compile-js-lib', getTask('compile-js-lib'));

/**
 *
 * Image Optimization
 *
 */

gulp.task('images', getTask('images'));

/**
 *
 * Fonts
 *
 */

// vendor fonts
gulp.task('vendor-fonts', () => {


  return gulp.src(config.vendorFonts + '**/*.{woff,woff2,ttf}')
    .pipe(gulp.dest(currentEnv.dist.fonts))
});

// custom fonts
gulp.task('fonts', getTask('fonts'));

/**
 *
 * Browser-Sync
 *
 */

// enable Gulp to spin up a server
gulp.task('browser-sync', getTask('browser-sync'));

gulp.task('bs-reload', () => {
  reload();
});

/**
 *
 * Cleanup - Blow up everything inside `dist/assets` when you run gulp
 *
 */

// Synchronously delete the lib and dist folders with every gulp run
gulp.task('clean', del.bind(null, ['lib', 'dist']));


/**
 *
 * Watching
 *
 */

gulp.task('dist', getTask('dist'));

gulp.task('default', ['clean'], () => {
  gulp.start('dist');
});
