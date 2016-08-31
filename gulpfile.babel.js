'use strict';
// Load Node Modules/Plugins
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import uglify from 'gulp-uglify';
import jshint from 'gulp-jshint';
import header from 'gulp-heder';
import rename from 'gulp-rename';
import cssnano from 'gulp-cssnano';
import sourcemaps from 'gulp-sourcemaps';

var gutil = require( 'gulp-util' );
var package = require( './package.json' );
// Remove existing docs and dist build

const reload = browserSync.reload;
const $ = gulpLoadPlugins();

var paths = {
  'dist': {
    'css': 'dist/assets/css/',
    'js': 'dist/assets/js/',
  },
  'src': {
    'scss': 'src/scss/',
    'js': 'src/js/',
    'html': 'dist/'
  }
}


var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join( '' );

gulp.task( 'clean', del.bind( null, [ 'docs/dist', 'dist' ] ) );

gulp.task( 'css', () => {
  return gulp.src( paths.src.scss + 'style.scss' )
    .pipe( $.plumber() )
    // expanded
    .pipe( $.sourcemaps.init() )
    .pipe( $.sass().on( 'error', $.sass.logError ) )
    .pipe( $.autoprefixer( { browsers: [ 'last 4 version' ] } ) )
    .pipe( gulp.dest( paths.dist.css ) )
    // compressed
    .pipe( cssnano() )
    .pipe( $.rename( { suffix: '.min' } ) )
    .pipe( $.header( banner, { package: package } ) )
    .pipe( $.sourcemaps.write() )
    .pipe( gulp.dest( paths.dist.css ) )
    .pipe( $.browserSync.reload( { stream: true } ) );
} );

gulp.task( 'js', () => {
  gulp.src( paths.src.js + 'scripts.js' )
    .pipe( $.sourcemaps.init() )
    .pipe( $.jshint( '.jshintrc' ) )
    .pipe( $.jshint.reporter( 'default' ) )
    .pipe( $.header( banner, { package: package } ) )
    .pipe( gulp.dest( paths.dist.js ) )
    .pipe( $.uglify() )
    .pipe( $.header( banner, { package: package } ) )
    .pipe( $.rename( { suffix: '.min' } ) )
    .pipe( $.sourcemaps.write() )
    .pipe( gulp.dest( paths.dist.js ) )
    .pipe( $.browserSync.reload( { stream: true, once: true } ) );
} );

gulp.task( 'browser-sync', () => {
  $.browserSync.init( null, {
    server: {
      baseDir: "dist"
    }
  } );
} );
gulp.task( 'bs-reload', () => {
  $.browserSync.reload();
} );



gulp.task( 'default', [ 'clean', 'css', 'js', 'browser-sync' ], () => {
  gulp.watch( paths.src.scss + "**/*.scss", [ 'css' ] );
  gulp.watch( paths.src.js + "*.js", [ 'js' ] );
  gulp.watch( paths.src.html + '*.html', [ 'bs-reload' ] );
} );
