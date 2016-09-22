module.exports = function ( gulp, plugins, paths, config, currentEnv, browserSync ) {
  return function () {
    var $ = plugins;
    var banner = require( './banner.js' );
    var thePackage = require( '../package.json' );
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
  };
};
