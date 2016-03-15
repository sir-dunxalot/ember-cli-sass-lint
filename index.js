/* jshint node: true */
'use strict';

var SassLinter = require('broccoli-sass-lint');
var mergeTrees = require('broccoli-merge-trees');
var fs = require('fs');

module.exports = {
  name: 'ember-cli-sass-lint',

  included: function(app) {
    if (!app.isTestingSassLintAddon) {
      this._super.included(app);
    }

    this.app = app;
    this.sassLintOptions = app.options.sassLint || {};
  },

  lintTree: function(type, tree) {
    var mergedTrees;

    if (type === 'addon') {
      var treePaths = this.registry.app.treePaths;
      var paths = [];

      ['addon-styles', 'styles'].forEach(function(subtree) {
        var path = treePaths[subtree];

        /* Use fs.stat to check if the styles dir exists in
        addon-name/addon/styles and addon-name/app/style */

        fs.stat(path, function(error, stats) {
          if (!error && stats.isDirectory()) {
            paths.push(path);
          }
        });
      });

      mergedTrees = mergeTrees(paths);

      return new SassLinter(mergedTrees, this.sassLintOptions);
    } else if (type === 'app') {

      /* Lints app/styles and addon/tests/dummy/app/styles */

      mergedTrees = mergeTrees([this.app.trees.styles]);

      return new SassLinter(mergedTrees, this.sassLintOptions);
    } else {
      return tree;
    }
  },
};
