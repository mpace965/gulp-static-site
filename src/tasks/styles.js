module.exports = (gulp, paths, browserSync) => {
  return function styles() {
    return gulp
      .src(paths.src)
      .pipe(gulp.dest(paths.dest))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      );
  };
};
