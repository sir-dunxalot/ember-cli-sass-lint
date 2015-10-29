/* global require, module */
// var EmberApp = require('ember-cli/lib/broccoli/ember-addon');
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
        logError: function(fileLint) {
          errors.push(fileLint)
        },
      }
    },
    trees: {
      styles: 'tests/dummy/app/styles'
    }
  });

  var node = linter.lintTree('app', sourcePath);

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

  it('The linter should use a config file', function() {
    // buildApp();
    // console.log(errors);
    return buildAndLint({
      tree: 'tests/dummy',
    }).then(function() {
      console.log(errors);
    });
    // return buildApp().then(function() {
    //   console.log('hey');

    //   assert.notInclude(linter.format(errors), 'ID selectors not allowed',
    //     'Should respect non-default rules specified in project\'s sass-lint.yml');

    // });
  });
});

