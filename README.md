Ember CLI Sass Lint [![Build Status](https://travis-ci.org/sir-dunxalot/ember-cli-sass-lint.svg?branch=master)](https://travis-ci.org/sir-dunxalot/ember-cli-sass-lint) [![npm](https://img.shields.io/npm/v/ember-cli-sass-lint.svg)](https://www.npmjs.com/package/ember-cli-sass-lint)
======

This is a pure Node.js scss/scss linter for Ember CLI apps and addons.

## Installation

```sh
ember install ember-cli-sass-lint
```

And that's it! This addon will automatically parse your sass/scss files.

## Configuration

Linting configuration can be added in a `.sass-lint.yml` file as required by [Sass Lint](https://github.com/sasstools/sass-lint). For example:

```yml
# my-project/.sass-lint.yml

rules:
  extends-before-mixins: 2 # 2 throws error
  placeholders-in-extend: 1 # 1 logs warning
  extends-before-declarations: 0 # 0 means no errors or warnings
```

[Here is a sample config file](https://github.com/sasstools/sass-lint/blob/develop/docs/sass-lint.yml).

## Options

Options can be passed in your `ember-cli-build.js` in the `sassLint` object. The defaults are shown below:

```js
// my-project/ember-cli-build.js

var app = new EmberApp(defaults, {
  sassLint: {
    configPath: '.sass-lint.yml',
    shouldThrowExceptions: true,
    shouldLog: true
  }
});
```

### configPath

| Type    | String          |
|---------|-----------------|
| Default | '.sass-lint.yml' |

A name of the file your config is contained in. This should be a `.yml` file, preferrably in the root of the Broccoli project.

### shouldThrowExceptions

| Type    | Boolean |
|---------|---------|
| Default | true    |

By default, `sass-lint` throws exceptions when an error is encountered (note, warnings do not throw errors). Usually this is the preffered functionality.

However, you can stop errors being thrown and, therefore, errors stopping the build process by setting `shouldThrowExceptions: false`. Use with caution!

### shouldLog

| Type    | Boolean |
|---------|---------|
| Default | true    |

Whether to log warnings and errors to the console. When this is set to `false` you will not be notified or linting errors!

### logError()

| Type    | Function          |
|---------|-------------------|
| Param   | fileLint (Object) |

You may override this plugin's default `logError()` function should you need to intercept file lint objects (e.g. when testing this plugin).

```js
// my-project/ember-cli-build.js
var errors = [];

var app = new EmberApp(defaults, {
  sassLint: {
    logError: function(fileLint) {
      errors.push(fileLint);
    }
  }
});
```

`fileLint` is passed in the format returned by `sass-lint`'s `lintText()` method. you can format it using the `format()` function in the `sass-lint` package (`npm install --save-dev sass-lint`).

Note, when you override `logError()` this plugin won't log any warnings or errors.

## Development

All tests are currently contained in `tests/runner.js`. This uses Mocha/Chai, not Ember Testing. Tests can be ran with:

```
npm test
```

You should also check that the dummy app's styles are still correctly compiled by running the ember app using `ember s`.

PRs are welcomed and should be issued to the `master` branch.
