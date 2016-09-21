module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return function() {
    var runSequence = require('run-sequence');

    runSequence(['html', 'sass', 'custom-js', 'images', 'fonts', 'vendor-fonts', 'compile-js-lib', 'compile-css-lib'], 'browser-sync');
    // globbing
    // matches any file with a .scss extension in dist/scss or a child directory
    gulp.watch(currentEnv.src.sass + '**/*.scss', ['sass']);
    gulp.watch(currentEnv.src.js + '*.js', ['custom-js']);
    gulp.watch(currentEnv.src.html + '*.html', ['html', 'bs-reload']);
    gulp.watch(currentEnv.src.images + '**/**/*.{png,jpg,gif,svg,ico}', ['images']);

  };
};
