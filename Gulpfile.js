const gulp = require("gulp");
const pug = require("gulp-pug");
const markdownToJson = require("gulp-markdown-to-json");
const wrap = require("gulp-wrap");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const MarkdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");

const config = require("./config.json");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const TEMPLATES_DIRECTORY = "src/views/templates";
const paths = {
  articles: {
    src: ["src/articles/**/*.md"],
    dest: "build/articles",
  },
  styles: {
    src: ["src/css/**/*.css"],
    dest: "build/css",
  },
  views: {
    src: [
      "src/views/**/*.pug",
      `!${path.join(TEMPLATES_DIRECTORY, "/**/*.pug")}`,
    ],
    dest: "build/",
  },
};

function makeTemplatePath(templateName) {
  return path.join(TEMPLATES_DIRECTORY, templateName || "layout.pug");
}

function articles() {
  return gulp
    .src(paths.articles.src)
    .pipe(markdownToJson(md.render.bind(md)))
    .pipe(
      wrap(
        (data) =>
          fs.readFileSync(makeTemplatePath(data.contents.template)).toString(),
        { config },
        (data) => ({
          engine: "pug",
          filename: makeTemplatePath(JSON.parse(data.contents).template),
        })
      )
    )
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest(paths.articles.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}

function views() {
  return gulp
    .src(paths.views.src)
    .pipe(pug({ locals: { config } }))
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

gulp.task("build", gulp.parallel(articles, styles, views));

gulp.task("watch", () => {
  browserSync.init({
    server: {
      baseDir: "build",
    },
  });

  gulp.watch(paths.articles.src, articles);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.views.src, views);
});

gulp.task("default", gulp.series("build"));
