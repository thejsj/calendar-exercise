/*jshint node:true */
'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var b = browserify();

gulp.task('browserify', function(){
  b.transform(reactify); // use the reactify transform
  b.add('./src/js/main.js');
  return b.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('build'));
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
  gulp.watch('./scr/js/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify', 'sass']);