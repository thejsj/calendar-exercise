/*jshint node:true */
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var watchify = require('watchify');

gulp.task('browserify', function(){
  var bundler = browserify({
      entries: ['./src/js/main.js'], // Only need initial file, browserify finds the deps
      transform: [reactify], // We want to convert JSX to normal javascript
      debug: true, // Gives us sourcemapping
      cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
  });
  var watcher  = watchify(bundler);
  return watcher
    .on('update', function () { // When any files update
        var updateStart = Date.now();
        console.log('Updating!');
        watcher.bundle() // Create new bundle that uses the cache for high performance
        .pipe(source('main.js'))
    // This is where you add uglifying etc.
        .pipe(gulp.dest('./build/'));
        console.log('Updated!', (Date.now() - updateStart) + 'ms');
    })
    .bundle() // Create the initial bundle when starting the task
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('sass', function () {
  gulp.src([
      'src/scss/main.scss'
    ])
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('watch', ['browserify', 'sass'], function () {
  gulp.watch('./src/scss/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify', 'sass']);