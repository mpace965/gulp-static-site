const noop = require("gulp-noop");
const del = require("del");
const browserSync = require("browser-sync").create();
const fs = require("fs");
const path = require("path");

const { TEMPLATES_DIRECTORY } = require("./tasks/config");

function resolveClientPath(clientPath) {
  return path.join(process.cwd(), clientPath);
}

module.exports = function (gulp) {
  const clientConfig = require(resolveClientPath("./config.json"));

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
    clientConfig,
    browserSync
  );

  const articles = require("./tasks/articles")(
    gulp,
    paths.articles,
    clientConfig,
    browserSync
  );

  function readClientJson(clientPath) {
    return JSON.parse(fs.readFileSync(resolveClientPath(clientPath)));
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
