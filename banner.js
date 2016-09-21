module.exports = function() {
  const banner = [
    '/*!\n' +
    ' * <%= thePackage.name %>\n' +
    ' * <%= thePackage.title %>\n' +
    ' * <%= thePackage.url %>\n' +
    ' * @author <%= thePackage.author %>\n' +
    ' * @version <%= thePackage.version %>\n' +
    ' * Copyright ' + new Date().getFullYear() +
    '. <%= thePackage.license %> licensed.\n' +
    ' */',
    '\n'
  ].join('');

  return banner;
};
