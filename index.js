'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/enummapping.cjs.min.js');
} else {
  module.exports = require('./dist/enummapping.cjs.js');
}
