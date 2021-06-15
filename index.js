'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/enummapping.min.js');
} else {
  module.exports = require('./dist/cjs/enummapping.js');
}
