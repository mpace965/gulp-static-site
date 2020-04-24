const gulp = require("gulp");
const pug = require("gulp-pug");

const paths = {
  templates: {
    src: ["src/templates/**/*.pug", "!src/templates/layouts/**/*.pug"],
    dest: "build/",
  },
};

function templates() {
  return gulp
    .src(paths.templates.src)
    .pipe(pug())
    .pipe(gulp.dest(paths.templates.dest));
}

exports.default = templates;
