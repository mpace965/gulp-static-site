const gulp = require("gulp");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();

const config = require("./config.json");

const paths = {
  styles: {
    src: ["src/css/**/*.css"],
    dest: "build/css",
  },
  templates: {
    src: ["src/templates/**/*.pug", "!src/templates/layouts/**/*.pug"],
    dest: "build/",
  },
};

function templates() {
  return gulp
    .src(paths.templates.src)
    .pipe(pug({ locals: config.locals }))
    .pipe(gulp.dest(paths.templates.dest))
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

gulp.task("build", gulp.parallel(templates, styles));

gulp.task("watch", () => {
  browserSync.init({
    server: {
      baseDir: "build",
    },
  });

  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
});

gulp.task("default", gulp.series("build"));
