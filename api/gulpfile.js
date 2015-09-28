'use strict';

// Module dependencies.
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var stylish = require('gulp-jscs-stylish');
var jsdoc = require('gulp-jsdoc');

var noop = function() {};

// Settings
var packageJSON  = require('./package');

// Tasks
gulp.task('mocha', function() {
  process.env.NODE_ENV = 'test';
  return gulp.src(['./**/*_spec.js',
                   '!./docs/**',
                   '!./node_modules/**', ], { read: false })
    .pipe(mocha(
      {
        reporter: 'list',
        require: ['should'],
        bail: true,
      }
    ))
    .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
  gulp.watch(['./**/*.js', '!./docs/**', '!./node_modules/**'], ['mocha']);
});

gulp.task('lint', function() {
  var jshintConfig = packageJSON.jshintConfig;
  var jscsConfig = packageJSON.jscsConfig;

  jshintConfig.lookup = false;

  return gulp.src(['./**/*.js', '!./docs/**', '!./node_modules/**'])
    .pipe(jshint(jshintConfig))
    .pipe(jscs(jscsConfig))
    .on('error', noop)
    .pipe(stylish.combineWithHintResults())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});

gulp.task('watch-lint', function() {
  gulp.watch(['./**/*.js', '!./docs/**', '!./node_modules/**'], ['lint']);
});

gulp.task('watch', ['watch-lint', 'lint', 'watch-mocha', 'mocha']);
gulp.task('default', ['lint', 'mocha']);
