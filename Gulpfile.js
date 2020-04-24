const gulp = require("gulp");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();

const config = require("./config.json");

const paths = {
  styles: {
    src: ["src/css/**/*.css"],
    dest: "build/css",
  },
  views: {
    src: ["src/views/**/*.pug", "!src/views/templates/**/*.pug"],
    dest: "build/",
  },
};

function views() {
  return gulp
    .src(paths.views.src)
    .pipe(pug({ locals: config.locals }))
    .pipe(gulp.dest(paths.views.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

gulp.task("build", gulp.parallel(views, styles));

gulp.task("watch", () => {
  browserSync.init({
    server: {
      baseDir: "build",
    },
  });

  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.views.src, views);
});

gulp.task("default", gulp.series("build"));
