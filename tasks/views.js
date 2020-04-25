const pug = require("gulp-pug");

module.exports = (gulp, paths, config, browserSync) => {
  return function views() {
    return gulp
      .src(paths.src)
      .pipe(pug({ locals: { config } }))
      .pipe(gulp.dest(paths.dest))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      );
  };
};
