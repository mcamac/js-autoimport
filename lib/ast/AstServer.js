// Plain old JS to avoid transpiling, and for sake of testability

var babylon = require('babylon');
var fs = require('fs');
var _ = require('lodash');

var input = _.last(process.argv);
var noFile = _.contains(process.argv, '--no-file');

var babelOpts = {
  sourceType: 'module',
  plugins: [
    'jsx', 'asyncFunctions', 'objectRestSpread', 'classProperties', 'exportExtensions',
    'functionBind', 'trailingFunctionCommas', 'decorators',
  ]
};

function parse(input) {
  try {
    console.log(JSON.stringify(babylon.parse(input.toString(), babelOpts).program, null, 2));
  } catch (ex) {
    console.error(ex);
    process.exit(1);
  }
}

if (noFile) {
  parse(input);
} else {
  fs.readFile(input, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      parse(data);
    }
  });
}
