module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return function() {
    var $ = plugins;

    return gulp.src(config.vendorJsSrc)
      .pipe($.sourcemaps.init())
      .pipe($.concat('compiled-bundle.js'))
      .pipe(gulp.dest(currentEnv.dist.js))
      .pipe($.rename('compiled-bundle.min.js'))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest(currentEnv.dist.js));

  };
};
