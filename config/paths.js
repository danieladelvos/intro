const path = require('path');

const paths = (...args) => {
  const paths = path.resolve(__dirname, '..');
  return path.join.apply(path, [paths].concat(...args));
};

module.exports = {
  root: '/',
  dist: paths('dist'),
  src: paths('src'),
  config: paths('config'),
  vendor: paths('src', 'vendor'),
  indexJs: paths('src', 'index.js'),
  indexHtml: paths('src', 'index.html'),
  styles: paths('src', 'styles')
};
