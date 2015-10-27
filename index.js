/* jshint node: true */
'use strict';

var lint = require('sass-lint');

module.exports = {
  name: 'ember-cli-sass-lint'
};


// var results = lint.lintFiles('{lib,tests}/!(vendor)/!(_units).scss', sassLintOptions, sassLintOptions.configFile);
// var formattedResults = lint.format(results);

// /* Log the linting results */

// console.log(chalk.white('  Linting'));

// if (!formattedResults) {
//   console.log(chalk.green('    ✓  No SASS linting errors - you rock!'));
//   console.log('');
// } else {
//   console.log(lint.format(results));
// }
