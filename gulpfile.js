'use strict';
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');

gulp.task('compress-js', function() {
    gulp
        .src('public/scripts/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
		.pipe(gulp.dest('public/scripts'));
});

gulp.task('default', ["compress-js"]);