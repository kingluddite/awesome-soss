'use strict';
// Load Node Modules/Plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
// import browserSync from 'browser-sync';
import del from 'del';

var argv = require( 'yargs' ).argv;
var browserSync = require( "browser-sync" ).create();
var gutil = require( 'gulp-util' );
var thePackage = require( './package.json' );
// Remove existing docs and dist build

const reload = browserSync.reload;
const $ = gulpLoadPlugins();

var paths = {
  'local': {
    'src': {
      'sass': './src/scss/',
      'js': './src/js/',
      'images': './src/img/',
      'fonts': './src/fonts/',
      'html': './dist/'
    },
    'dist': {
      'css': './dist/assets/css/',
      'js': './dist/assets/js/',
      'fonts': './dist/assets/fonts/',
      'images': './dist/assets/img/'
    }
  },
  'production': {
    'src': {
      'sass': './src/scss/',
      'js': './src/js/',
      'images': './src/img/',
      'fonts': './src/fonts/'
    },
    'dist': {
      'css': '/var/www/html/assets/css/',
      'js': '/var/www/html/assets/js/',
      'fonts': '/var/www/html/assets/fonts/',
      'images': '/var/www/html/assets/img/'
    }
  }
};

var environment = argv.production;

function checkEnv() {
  var currentEnv;

  $.ifElse(
    environment,
    function() { currentEnv = paths.production; },
    function() { currentEnv = paths.local; }
  );

  return currentEnv;
}

var currentEnv = checkEnv();

// var banner = [
//   '/*!\n' +
//   ' * <%= thePackage.name %>\n' +
//   ' * <%= thePackage.title %>\n' +
//   ' * <%= thePackage.url %>\n' +
//   ' * @author <%= thePackage.author %>\n' +
//   ' * @version <%= thePackage.version %>\n' +
//   ' * Copyright ' + new Date().getFullYear() + '. <%= thePackage.license %> licensed.\n' +
//   ' */',
//   '\n'
// ].join( '' );

gulp.task( 'clean', del.bind( null, [ 'dist/assets/' ] ) );

gulp.task( 'css', () => {
  return gulp.src( currentEnv.src.sass + 'style.scss' )
    .pipe( $.plumber() )
    // expanded
    .pipe( $.sourcemaps.init() )
    .pipe( $.sass().on( 'error', $.sass.logError ) )
    .pipe( $.autoprefixer( { browsers: [ 'last 4 version' ] } ) )
    .pipe( gulp.dest( currentEnv.dist.css ) )
    // compressed
    .pipe( $.cssnano() )
    .pipe( $.rename( { suffix: '.min' } ) )
    // .pipe( $.header( banner, { package: thePackage } ) )
    .pipe( $.sourcemaps.write() )
    .pipe( gulp.dest( currentEnv.dist.css ) )
    .pipe( browserSync.reload( { stream: true } ) );
} );

gulp.task( 'images', function() {
  return gulp.src( currentEnv.src.images + '**/**/*.{png,jpg,gif,svg,ico}' )
    .pipe( $.newer( currentEnv.dist.images ) )
    .pipe( $.imagemin( { progressive: true } ) )
    .pipe( gulp.dest( currentEnv.dist.images ) );
} );

gulp.task( 'js', () => {
  gulp.src( currentEnv.src.js + 'scripts.js' )
    .pipe( $.sourcemaps.init() )
    .pipe( $.jshint( '.jshintrc' ) )
    .pipe( $.jshint.reporter( 'default' ) )
    // .pipe( $.header( banner, { package: thePackage } ) )
    .pipe( gulp.dest( currentEnv.dist.js ) )
    .pipe( $.uglify() )
    // .pipe( $.header( banner, { package: thePackage } ) )
    .pipe( $.rename( { suffix: '.min' } ) )
    .pipe( $.sourcemaps.write() )
    .pipe( gulp.dest( currentEnv.dist.js ) )
    .pipe( browserSync.reload( { stream: true, once: true } ) );
} );

gulp.task( 'browser-sync', () => {
  browserSync.init( null, {
    server: {
      baseDir: "dist"
    }
  } );
} );
gulp.task( 'bs-reload', () => {
  browserSync.reload();
} );

gulp.task( 'dist', [ 'css', 'js', 'images', 'browser-sync' ], () => {
  gulp.watch( currentEnv.src.sass + "**/*.scss", [ 'css' ] );
  gulp.watch( currentEnv.src.js + "*.js", [ 'js' ] );
  gulp.watch( currentEnv.src.html + '*.html', [ 'bs-reload' ] );
  gulp.watch( currentEnv.src.images + '**/**/*.{png,jpg,gif,svg,ico}', [ 'images' ] );
} );

gulp.task( 'default', [ 'clean' ], () => {
  gulp.start( 'dist' );
} );
