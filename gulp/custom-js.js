module.exports = function ( gulp, plugins, paths, config, currentEnv, browserSync ) {
  return function () {
    var $ = plugins;
    var banner = require( './banner.js' )();
    var thePackage = require( '../package.json' );

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
      .pipe( browserSync.reload( {
        stream: true,
        once: true
      } ) );
  };
};
