module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return function() {
    return gulp.src(currentEnv.src.fonts + '**/*.{woff,woff2,ttf}')
      .pipe(gulp.dest(currentEnv.dist.fonts))
  };
};
