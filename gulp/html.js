module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return function() {
    return gulp.src(currentEnv.src.html + '*.html')
      .pipe(gulp.dest(currentEnv.dist.html));
  };
};
