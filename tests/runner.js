/* global require, describe, beforeEach, afterEach, it */

var broccoli = require('broccoli');
var chai = require('chai');
var linter = require('..');

var assert = chai.assert;

var builder, errors;

function buildAndLint(sourcePath) {
  linter.included({
    isTestingSassLintAddon: true,
    options: {
      sassLint: {
        configPath: 'sass-lint-test-config.yml',
        logError: function(fileLint) {
          errors.push(fileLint);
        },
      }
    },
    trees: {
      styles: sourcePath, // Directory to lint
    },
  });

  var node = linter.lintTree('app', {
    tree: sourcePath
  });

  builder = new broccoli.Builder(node);

  return builder.build();
}

describe('ember-cli-sass-lint', function() {

  beforeEach(function() {
    errors = [];
  });

  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }
  });

  it('The linter should run', function() {
    return buildAndLint('tests/dummy').then(function() {
      var firstError = errors[0];
      var messageIdStrings;

      assert.ok(!!firstError,
        'The linting should occur');

      assert.equal(firstError.filePath, 'app/styles/app.scss',
        'The app.scss file should be linted');

      assert.ok(firstError.messages.length > 1,
        'Errors for app.scss should be logged');

      /* Create a string of error ID's we can easily test */

      messageIdStrings = firstError.messages.reduce(function(previousValue, currentValue) {
        return previousValue + ' ' + currentValue.ruleId;
      }, '');

      assert.include(messageIdStrings, 'no-color-keywords',
        'Should respect default rules not specified in project\'s sass-lint.yml');


      assert.notInclude(messageIdStrings, 'no-ids',
        'Should respect non-default rules specified in project\'s sass-lint.yml');

    });
  });
});

