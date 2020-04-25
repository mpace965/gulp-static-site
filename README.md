# Static Site Generator for Gulp

A static site generator for Gulp, loosely inspired by
[Wintersmith](https://github.com/jnordberg/wintersmith).

## Usage

In your `Gulpfile.js`, add

```js
// Gulpfile.js
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
- Write articles in Markdown and have them rendered to HTML via
  [markdown-it](https://github.com/markdown-it/markdown-it)
- Copy resources (e.g. `js`, `css`, `static`) to build output.
- Easily vendor `npm` dependencies to build output.
- Live reloading via
  [browser-sync](https://github.com/Browsersync/browser-sync).

## Project Structure

### Project Root

- `./Gulpfile.js` - `gulp-static-site` needs to be initialized and used in a
  `Gulpfile`.
- `./config.{js, json}` - The exports/contents of this file will be passed to
  `pug` as a variable named `config`. If a JavaScript file, it must export an
  `Object`.

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

**Note:** It is up to you as a client to avoid naming collisions between
sources.

#### Views

- `./src/views/` - `.pug` templates in this directory will be rendered as html.
  Directory structure will be preserved in `build/`. For example,
  `./src/views/index.pug` will be rendered to html as `build/index.html`.
- `./src/views/templates/` - `.pug` templates in this directory will not be
  rendered. Use this directory to set up layouts for use in concrete templates.

#### Articles

- `./src/articles` - Markdown files (`.md`) in this directory will be rendered
  as html. Directory structure will be preserved in `build/`. For example,
  `./src/articles/article-a/index.md` will be rendered to html as
  `build/articles/article-a/index.html`. Markdown frontmatter is also supported.
  Markdown frontmatter is made available to `.pug` templates under the variable
  `contents`.
- You can control which template an article is rendered in with the `template`
  frontmatter. The value should be a path to a `.pug` template relative to
  `./src/views/templates`. If `template` is not specified, the value defaults to
  `layout.pug`.

#### Resources

- `./src/resources` - Files in this directory will simply be copied to `build/`,
  preserving directory structure. For example, `./src/resources/sw.js` will be
  copied to `build/sw.js`

Use this directory to contain sources like HTML, CSS, JavaScript, and other
assets that you want served.
