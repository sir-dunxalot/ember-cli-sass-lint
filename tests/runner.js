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
      app: sourcePath, // Directory to lint
    },
    name: 'dummy',
    project: {
      name: () => 'dummy'
    },
  });

  var node = linter.lintTree('app', {
    srcDir: sourcePath,
    destDir: '/'
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

    it('The linter should run and lint a file in the app/styles dir', function() {
      return buildAndLint('tests/dummy').then(function() {
        var appCssError = errors.filter((error) => { return error.filePath === 'app/styles/app.scss' })[0];
        var messageIdStrings;

        assert.ok(!!appCssError,
          'The app.scss file should be linted');

        assert.ok(appCssError.messages.length > 1,
          'Errors for app.scss should be logged');

        /* Create a string of error ID's we can easily test */

        messageIdStrings = appCssError.messages.reduce(function(previousValue, currentValue) {
          return previousValue + ' ' + currentValue.ruleId;
        }, '');

        assert.include(messageIdStrings, 'no-color-keywords',
          'Should respect default rules not specified in project\'s sass-lint.yml');

        assert.notInclude(messageIdStrings, 'no-ids',
          'Should respect non-default rules specified in project\'s sass-lint.yml');
      });
    });

    it('The linter should run and lint a file in the app/components dir', function() {
      return buildAndLint('tests/dummy').then(function() {
        var componentCssError = errors.filter((error) => { return error.filePath === 'app/components/example-component/style.scss' })[0];
        var messageIdStrings;

        assert.ok(!!componentCssError,
          'The app/components/example-component/style.scss file should be linted');

        assert.ok(componentCssError.messages.length > 1,
          'Errors for app/components/example-component/style.scss should be logged');

        /* Create a string of error ID's we can easily test */

        messageIdStrings = componentCssError.messages.reduce(function(previousValue, currentValue) {
          return previousValue + ' ' + currentValue.ruleId;
        }, '');

        assert.include(messageIdStrings, 'no-color-keywords',
          'Should respect default rules not specified in project\'s sass-lint.yml');

        assert.notInclude(messageIdStrings, 'no-ids',
          'Should respect non-default rules specified in project\'s sass-lint.yml');
      });
    });
});
