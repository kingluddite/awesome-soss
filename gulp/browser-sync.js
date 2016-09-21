module.exports = function(gulp, plugins, paths, config, currentEnv, browserSync) {
  return function() {
    browserSync.init(null, {
      // let BrowserSync know where the root of the should be (`dist`)
      server: {
        // our root distribution (production) folder is `dist`
        baseDir: 'dist'
      }
    });
  };
};
