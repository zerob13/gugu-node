require('babel-polyfill');
require('babel-register')({
  extensions: ['.es6', '.es', '.jsx', '.js']
});
require('./app.js');

