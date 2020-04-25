# Static Site Generator for Gulp

A static site generator for Gulp, loosely inspired by
[Wintersmith](https://github.com/jnordberg/wintersmith).

## Usage

In your `Gulpfile.js`, add

```js
const gulp = require("gulp");
const { clean, build, watch } = require("gulp-static-site")(gulp);
```

This defines `clean`, `build`, and `watch` functions using the client instance
of `gulp`. It is up to clients to wire these functions to tasks. Take for
example this `Gulpfile.js`

```js
// Gulpfile.js
const gulp = require("gulp");
const { clean, build, watch } = require("gulp-static-site")(gulp);

gulp.task("clean", clean);

gulp.task("build", build);
gulp.task("build:clean", gulp.series("clean", build));
gulp.task("watch", gulp.series(build, watch));
gulp.task("watch:clean", gulp.series("clean", build, watch));

gulp.task("default", gulp.series("build:clean"));
```

## Features

- Use [pug](https://github.com/pugjs/pug) to template and create views.
- Copy standard resources (`js`, `css`, `static`) to build output.
- Easily vendor `npm` dependencies to build output.
- Live reloading via
  [browser-sync](https://github.com/Browsersync/browser-sync).

## Project Structure

### Project Root

- `./Gulpfile.js` - `gulp-static-site` needs to be initialized and used in a
  `Gulpfile`.
- `./config.{js, json}` - The exports/contents of this file will be passed to
  `pug` as a variable named `config`.

#### Vendoring

- `./vendor.json` - used to configure vendored code. The top level element is an
  object. Each key is a package name to be vendored, and the value is the vendor
  configuration.
  - `root`: String, required. The directory (relative to the package root) to
    vendor. To vendor the entire package from its root, use `'.'`.
  - `alias`: String, optional. The directory name to vendor the package under in
    the build output. If unset, defaults to the package name.

Example `./vendor.json`:

```json
{
  "photoswipe": {
    "root": "dist"
  },
  "ansi-gray": {
    "root": ".",
    "alias": "gray"
  }
}
```

Would result in the following directory structure

```
build/vendor
├── gray
│   ├── index.js
│   ├── LICENSE
│   ├── package.json
│   └── readme.md
└── photoswipe
    ├── default-skin
    │   ├── default-skin.css
    │   ├── default-skin.png
    │   ├── default-skin.svg
    │   └── preloader.gif
    ├── photoswipe.css
    ├── photoswipe.js
    ├── photoswipe.min.js
    ├── photoswipe-ui-default.js
    └── photoswipe-ui-default.min.js
```

`build/vendor/gray` is copied from `node_modules/ansi-gray`, and
`build/vendor/photoswipe` is copied from `node_modules/photoswipe/dist`.

### Sources
