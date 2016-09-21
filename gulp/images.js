module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return function() {
    var $ = plugins;

    // grab only the stuff in images with these extensions {png,jpg,gif,svg,ico}
    return gulp.src(currentEnv.src.images + '**/**/*.{png,jpg,gif,svg,ico}')
      .pipe($.newer(currentEnv.dist.images))
      .pipe($.imagemin({
        progressive: true
      }))
      .pipe(gulp.dest(currentEnv.dist.images));
  };
};
