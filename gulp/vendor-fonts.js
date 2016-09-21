module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return gulp.src(config.vendorFonts + '**/*.{woff,woff2,ttf}')
    .pipe(gulp.dest(currentEnv.dist.fonts))
};
