const del = require("del");
const browserSync = require("browser-sync").create();
const path = require("path");

const { TEMPLATES_DIRECTORY } = require("./src/config");
const resolveClientPath = require("./src/resolveClientPath");

const paths = {
  articles: {
    src: ["src/articles/**/*.md"],
    dest: "build/articles",
  },
  resources: {
    src: ["src/resources/**"],
    dest: "build/",
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

module.exports = function (gulp) {
  const clientConfig = require(resolveClientPath("./config"));

  const views = require("./src/tasks/views")(
    gulp,
    paths.views,
    clientConfig,
    browserSync
  );

  const articles = require("./src/tasks/articles")(
    gulp,
    paths.articles,
    clientConfig,
    browserSync
  );

  const vendor = require("./src/tasks/vendor")(gulp, paths.vendor);

  const resources = require("./src/tasks/resources")(
    gulp,
    paths.resources,
    browserSync
  );

  const clean = () => del(["build"]);
  const build = gulp.parallel(articles, resources, vendor, views);
  const watch = () => {
    browserSync.init({
      server: {
        baseDir: "build",
      },
    });

    gulp.watch(paths.articles.src, articles);
    gulp.watch(paths.resources.src, resources);
    gulp.watch("vendor.json", vendor);
    gulp.watch(paths.views.src, views);
    gulp.watch(TEMPLATES_DIRECTORY, views);
  };

  return { clean, build, watch };
};
