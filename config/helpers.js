const VERSION = require('../package.json').version;
const IS_PROD = process.env.NODE_ENV === 'production';

module.exports = {
  IS_PROD,
  VERSION
};
