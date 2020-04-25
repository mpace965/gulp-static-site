const noop = require("gulp-noop");
const fs = require("fs");
const path = require("path");

const resolveClientPath = require("../resolveClientPath");

function readClientJson(clientPath) {
  return JSON.parse(fs.readFileSync(resolveClientPath(clientPath)));
}

module.exports = (gulp, paths) => {
  return function vendor() {
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
            paths.dest,
            vendorConfig.alias || packageName
          );

          return gulp.src(src).pipe(gulp.dest(vendorPath));
        })
      );
    } catch (_) {
      return gulp.src(".").pipe(noop());
    }
  };
};
