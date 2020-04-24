const gulp = require("gulp");
const pug = require("gulp-pug");

const config = require('./config.json');

const paths = {
  styles: {
    src: ["src/css/**/*.css"],
    dest: "build/css"
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
    .pipe(gulp.dest(paths.templates.dest));
}

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(gulp.dest(paths.styles.dest));
}

exports.default = gulp.parallel(templates, styles);
