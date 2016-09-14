'use strict';
// Load Node Modules/Plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
// import browserSync from 'browser-sync';
import del from 'del';

var argv = require( 'yargs' ).argv;
var browserSync = require( 'browser-sync' ).create();
var gutil = require( 'gulp-util' );
var runSequence = require( 'run-sequence' );
var thePackage = require( './package.json' );
// Remove existing docs and dist build

const reload = browserSync.reload;
const $ = gulpLoadPlugins();

// the paths objects will save us a lot of path typing
var paths = {
  // for local development
  'local': {
    'src': {
      'lib': './lib/',
      'nm': './node_modules/',
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
      'lib': './lib/',
      'nm': './node_modules/',
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

var config = {
  jquerysrc: [
        currentEnv.src.nm + "jquery-validation/dist/jquery.validate.js",
        currentEnv.src.nm + "jquery-validation/dist/jquery.validate.unobtrusive.js"
    ],
  jquerybundle: currentEnv.src.lib + "jquery-bundle.js",

  //JavaScript files that will be combined into a Bootstrap bundle
  bootstrapsrc: [
        currentEnv.src.nm + "jquery/dist/jquery.js",
        currentEnv.src.nm + "tether/dist/js/tether.js",
        currentEnv.src.nm + "bootstrap/dist/js/bootstrap.js"
    ],
  bootstrapbundle: currentEnv.src.lib + "bootstrap-bundle.js"
}

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
    // sourcemaps help us with debugging
    .pipe( $.sourcemaps.init() )
    .pipe( $.sass().on( 'error', $.sass.logError ) )
    // add all the browser prefixes
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
 * Fonts
 *
 */
gulp.task( 'fonts', function () {
  return gulp.src( 'src/fonts/**/*' )
    .pipe( gulp.dest( 'dist/fonts' ) )
} )


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
// Synchronously delete the output script file(s)
gulp.task( 'clean', del.bind( null, [ 'dist/assets/' ] ) );


//Create a jquery bundled file
gulp.task( 'jquery-bundle', [ 'clean' ], function () {
  return gulp.src( config.jquerysrc )
    .pipe( $.concat( 'jquery-bundle.js' ) )
    .pipe( gulp.dest( 'lib' ) );
} );

//Create a bootstrap bundled file
gulp.task( 'bootstrap-bundle', [ 'clean' ], function () {
  return gulp.src( config.bootstrapsrc )
    .pipe( $.concat( 'bootstrap-bundle.js' ) )
    .pipe( gulp.dest( 'lib' ) );
} );

// Combine and the vendor files from bower into bundles (output to the Scripts folder)
gulp.task( 'bundle-scripts', [ 'jquery-bundle', 'bootstrap-bundle' ], function () {
  // runSequence( [ 'jquery-bundle', 'bootstrap-bundle' ] );
} );

//build lib scripts
gulp.task( 'compile-lib', [ 'bundle-scripts' ], function () {
  return gulp.src( 'lib/*.js' )
    .pipe( $.sourcemaps.init() )
    .pipe( $.concat( 'compiled-bundle.js' ) )
    .pipe( gulp.dest( currentEnv.dist.js ) )
    .pipe( $.rename( 'compiled-bundle.min.js' ) )
    .pipe( $.uglify() )
    .pipe( $.sourcemaps.write( './' ) )
    .pipe( gulp.dest( currentEnv.dist.js ) );
} );

/**
 *
 * Watching
 *
 */

gulp.task( 'dist', [ 'html', 'sass', 'js', 'images', 'fonts', 'compile-lib', 'browser-sync' ], () => {

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
