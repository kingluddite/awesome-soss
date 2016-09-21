'use strict';
// Load Node Modules/Plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import shell from 'gulp-shell';

const argv = require( 'yargs' ).argv;
const browserSync = require( 'browser-sync' ).create();
// const gutil = require( 'gulp-util' );
const runSequence = require( 'run-sequence' );
const thePackage = require( './package.json' );
// Remove existing docs and dist build

const reload = browserSync.reload;
const $ = gulpLoadPlugins();

// 1. paths
// 3. environment
// 2. config
// 4. banner
// 4. Tasks
// 4.a - html
// vendor CSS
// 4.b - Sass
// 4.e - vendor JavaScript
// 4.f - custom JavaScript
// 4.c - images
// 4.e - vendor fonts
// 4.d - fonts
// browser-sync
// clean
// watch

/**
 *
 * Paths
 *
 */

// the paths objects will save us a lot of path typing
var paths = {
  // for local development
  'local': {
    'src': {
      'jslib': './lib/js/',
      'csslib': './lib/css/',
      'nm': './node_modules/',
      'sass': './src/scss/',
      'js': './app/js/',
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
    () => {
      currentEnv = paths.production;
    },
    () => {
      currentEnv = paths.local;
    }
  );

  return currentEnv;
}

var currentEnv = checkEnv();

/**
 *
 * Config
 *
 */

var config = {
  vendorCssSrc: [
    // add all external css libraries here
    currentEnv.src.nm + 'font-awesome/css/font-awesome.css',
    currentEnv.src.nm + 'animate.css/animate.css',
    currentEnv.src.nm + 'hover.css/css/hover.css',
    currentEnv.src.nm + 'tether/css/tether.css'
  ],
  vendorJsSrc: [
    // add all external js libraries here
    currentEnv.src.nm + 'jquery/dist/jquery.js',
    currentEnv.src.nm + 'jquery-validation/dist/jquery.validate.js',
    currentEnv.src.nm + 'jquery-validation/dist/jquery.validate.unobtrusive.js',
    currentEnv.src.nm + 'jquery-validation/dist/masonry-layout/dist/masonry.pkgd.js',
    currentEnv.src.nm + 'tether/dist/js/tether.js',
    currentEnv.src.nm + 'bootstrap/dist/js/bootstrap.js'
  ],
  vendorFonts: [
    currentEnv.src.nm + 'font-awesome/fonts/'
  ]
}



/**
 *
 * Banner
 *
 */

const banner = [
  '/*!\n' +
  ' * <%= thePackage.name %>\n' +
  ' * <%= thePackage.title %>\n' +
  ' * <%= thePackage.url %>\n' +
  ' * @author <%= thePackage.author %>\n' +
  ' * @version <%= thePackage.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() +
  '. <%= thePackage.license %> licensed.\n' +
  ' */',
  '\n'
].join( '' );

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

gulp.task( 'html', () => {
  return gulp.src( currentEnv.src.html + '*.html' )
    .pipe( gulp.dest( currentEnv.dist.html ) );
} );

/**
 *
 * CSS
 *
 */

// vendor css

//build css lib scripts
gulp.task( 'compile-css-lib', () => {
  return gulp.src( config.vendorCssSrc )
    .pipe( $.concat( 'compiled-bundle.css' ) )
    .pipe( gulp.dest( currentEnv.dist.css ) )
    .pipe( $.rename( 'compiled-bundle.min.css' ) )
    .pipe( $.cssnano() )
    .pipe( gulp.dest( currentEnv.dist.css ) );
} );

/**
 *
 * Sass (custom)
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

/**
 *
 * JavaScript
 *
 */

// Vendor JavaScript

//build js lib scripts
gulp.task( 'compile-js-lib', () => {
  return gulp.src( config.vendorJsSrc )
    .pipe( $.sourcemaps.init() )
    .pipe( $.concat( 'compiled-bundle.js' ) )
    .pipe( gulp.dest( currentEnv.dist.js ) )
    .pipe( $.rename( 'compiled-bundle.min.js' ) )
    .pipe( $.uglify() )
    .pipe( $.sourcemaps.write( './' ) )
    .pipe( gulp.dest( currentEnv.dist.js ) );
} );

// Custom JavaScript

gulp.task( 'custom-js', () => {
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
 * Image Optimization
 *
 */

gulp.task( 'images', () => {
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

// vendor fonts
gulp.task( 'vendorFonts', () => {
  return gulp.src( config.vendorFonts + '**/*.{woff,woff2,ttf}' )
    .pipe( gulp.dest( currentEnv.dist.fonts ) )
} )

// custom fonts
gulp.task( 'fonts', () => {
  return gulp.src( currentEnv.src.fonts + '**/*.{woff,woff2,ttf}' )
    .pipe( gulp.dest( currentEnv.dist.fonts ) )
} )

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

// Synchronously delete the lib and dist folders with every gulp run
gulp.task( 'clean', del.bind( null, [ 'lib', 'app', 'dist' ] ) );


/**
 *
 * Watching
 *
 */

gulp.task( 'dist', () => {
  runSequence( [ 'html', 'sass', 'custom-js', 'images', 'fonts', 'vendorFonts', 'compile-js-lib', 'compile-css-lib' ], 'browser-sync' );
  // globbing
  // matches any file with a .scss extension in dist/scss or a child directory
  gulp.watch( currentEnv.src.sass + '**/*.scss', [ 'sass' ] );
  gulp.watch( currentEnv.src.js + '*.js', [ 'custom-js' ] );
  gulp.watch( currentEnv.src.html + '*.html', [ 'html', 'bs-reload' ] );
  gulp.watch( currentEnv.src.images + '**/**/*.{png,jpg,gif,svg,ico}', [ 'images' ] );
} );

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

gulp.task( 'default', [ 'clean', 'flow', 'babel' ], () => {
  gulp.start( 'dist' );
} );
