const markdownToJson = require("gulp-markdown-to-json");
const wrap = require("gulp-wrap");
const rename = require("gulp-rename");
const noop = require("gulp-noop");
const del = require("del");
const browserSync = require("browser-sync").create();
const MarkdownIt = require("markdown-it");
const fs = require("fs");
const path = require("path");

function resolveClientPath(clientPath) {
  return path.join(process.cwd(), clientPath);
}

module.exports = function (gulp) {
  const config = require(resolveClientPath("./config.json"));

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
    vendor: {
      dest: "build/vendor/",
    },
    views: {
      src: [
        "src/views/**/*.pug",
        `!${path.join(TEMPLATES_DIRECTORY, "/**/*.pug")}`,
      ],
      dest: "build/",
    },
  };

  const views = require("./tasks/views")(
    gulp,
    paths.views,
    config,
    browserSync
  );

  function makeTemplatePath(templateName) {
    return path.join(TEMPLATES_DIRECTORY, templateName || "layout.pug");
  }

  function readClientJson(clientPath) {
    return JSON.parse(fs.readFileSync(resolveClientPath(clientPath)));
  }

  function articles() {
    return gulp
      .src(paths.articles.src)
      .pipe(markdownToJson(md.render.bind(md)))
      .pipe(
        wrap(
          (data) =>
            fs
              .readFileSync(makeTemplatePath(data.contents.template))
              .toString(),
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

  function vendor() {
    try {
      const vendorConfig = readClientJson("./vendor.json");

      return gulp.parallel(
        Object.entries(vendorConfig).map(([packageName, vendorConfig]) => {
          const src = path.join(
            "./node_modules",
            packageName,
            vendorConfig.root,
            "**"
          );

          const vendorPath = path.join(
            paths.vendor.dest,
            vendorConfig.alias || packageName
          );

          return gulp.src(src).pipe(gulp.dest(vendorPath));
        })
      );
    } catch (_) {
      return gulp.src(".").pipe(noop());
    }
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

  const clean = () => del(["build"]);
  const build = gulp.parallel(articles, styles, vendor, views);
  const watch = () => {
    browserSync.init({
      server: {
        baseDir: "build",
      },
    });

    gulp.watch(paths.articles.src, articles);
    gulp.watch(paths.styles.src, styles);
    gulp.watch("vendor.json", vendor);
    gulp.watch(paths.views.src, views);
    gulp.watch(TEMPLATES_DIRECTORY, views);
  };

  return { clean, build, watch };
};
