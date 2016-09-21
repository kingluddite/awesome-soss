module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return function() {
    var $ = plugins;

    return gulp.src(config.vendorCssSrc)
      .pipe($.concat('compiled-bundle.css'))
      .pipe(gulp.dest(currentEnv.dist.css))
      .pipe($.rename('compiled-bundle.min.css'))
      .pipe($.cssnano())
      .pipe(gulp.dest(currentEnv.dist.css));
  };
};
