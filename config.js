module.exports = function(currentEnv) {
  var config = {
    vendorCssSrc: [
      // add all external css libraries here
      currentEnv.src.nm + 'font-awesome/css/font-awesome.css',
      currentEnv.src.nm + 'animate.css/animate.css',
      currentEnv.src.nm + 'hover.css/css/hover.css',
      currentEnv.src.nm + 'tether/css/tether.css'
    ],
    vendorJsSrc: [
      // add all external js libraries here
      currentEnv.src.nm + 'jquery/dist/jquery.js',
      currentEnv.src.nm + 'jquery-validation/dist/jquery.validate.js',
      currentEnv.src.nm + 'jquery-validation/dist/jquery.validate.unobtrusive.js',
      currentEnv.src.nm + 'jquery-validation/dist/masonry-layout/dist/masonry.pkgd.js',
      currentEnv.src.nm + 'tether/dist/js/tether.js',
      currentEnv.src.nm + 'bootstrap/dist/js/bootstrap.js'
    ],
    vendorFonts: [
      currentEnv.src.nm + 'font-awesome/fonts/'
    ]
  };

  return config;
};
