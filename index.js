/* jshint node: true */
'use strict';

var SassLinter = require('broccoli-sass-lint');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
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

        /* Use fs.statSync to check if the styles dir exists in
         addon-name/addon/styles and addon-name/app/styles */

        try {
          var stats = fs.statSync(path);

          if (stats.isDirectory()) {
            paths.push(path);
          }
        }
        catch (ignored) {}
      });

      mergedTrees = mergeTrees(paths.map((path) => {
        return new Funnel(path);
      }));

      return new SassLinter(mergedTrees, this.sassLintOptions);
    }
    else if (type === 'app') {
      mergedTrees = mergeTrees([
        new Funnel(this.app.trees.app, {
          exclude: ['**/*.js']
        })
      ]);

      return new SassLinter(mergedTrees, this.sassLintOptions);
    }
  },
};
