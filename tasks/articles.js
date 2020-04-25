const markdownToJson = require("gulp-markdown-to-json");
const wrap = require("gulp-wrap");
const rename = require("gulp-rename");
const MarkdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");

const { TEMPLATES_DIRECTORY } = require("./config");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

function makeTemplatePath(templateName) {
  return path.join(TEMPLATES_DIRECTORY, templateName || "layout.pug");
}

module.exports = (gulp, paths, clientConfig, browserSync) => {
  return function articles() {
    return gulp
      .src(paths.src)
      .pipe(markdownToJson(md.render.bind(md)))
      .pipe(
        wrap(
          (data) =>
            fs
              .readFileSync(makeTemplatePath(data.contents.template))
              .toString(),
          { config: clientConfig },
          (data) => ({
            engine: "pug",
            filename: makeTemplatePath(JSON.parse(data.contents).template),
          })
        )
      )
      .pipe(rename({ extname: ".html" }))
      .pipe(gulp.dest(paths.dest))
      .pipe(
        browserSync.reload({
          stream: true,
        })
      );
  };
};
