module.exports = function(plugins, environment, paths) {
  var $ = plugins;

  return function() {
    var currentEnv;

    $.ifElse(
      environment,
      () => {
        currentEnv = paths.production;
      },
      () => {
        currentEnv = paths.local;
      }
    );

    return currentEnv;
  };

};
