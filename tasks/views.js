const pug = require("gulp-pug");

module.exports = (gulp, paths, clientConfig, browserSync) => {
  return function views() {
    return gulp
      .src(paths.src)
      .pipe(pug({ locals: { config: clientConfig } }))
      .pipe(gulp.dest(paths.dest))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      );
  };
};
