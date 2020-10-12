const { src, dest } = require("gulp");
const gulp = require("gulp");
const browsersync = require("browser-sync").create(); //name of future function must be different from this variable name
const fileinclude = require("gulp-file-include");
const del = require("del");
const scss = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const groupMedia = require("gulp-group-css-media-queries");
const compressCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webphtml = require("gulp-webp-html");
const webpcss = require("gulp-webpcss");
const svgSprite = require('gulp-svg-sprite')

const project_folder = "dist";
const source_folder = "src";

const customOptions = {
  sass: {
    expanded: "expanded",
    compressed: "compressed",
  },
};

const path = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css/`,
    js: `${project_folder}/js/`,
    img: `${project_folder}/images/`,
    fonts: `${project_folder}/fonts/`,
  },
  src: {
    html: [`${source_folder}/*.html`, `!${source_folder}/_*.html`],
    css: `${source_folder}/scss/style.scss`,
    js: `${source_folder}/js/script.js`,
    img: `${source_folder}/images/**/*.{jpg,png,svg,gif,ico,webp}`,
    fonts: `${source_folder}/fonts/*.ttf`,
  },
  watch: {
    html: `${source_folder}/**/*.html`,
    css: `${source_folder}/scss/**/*.scss`,
    js: `${source_folder}/js/**/*.js`,
    img: `${source_folder}/images/**/*.{jpg,png,svg,gif,ico,webp}`,
  },
  clean: `./${project_folder}/`,
};

function browserSync() {
  browsersync.init({
    server: {
      baseDir: path.clean,
    },
    port: 3000,
    notify: false,
  });
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function watcher() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: customOptions.sass.expanded,
      })
    )
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
      })
    )
    .pipe(
      webpcss({
        webpClass: ".webp",
        noWebpClass: ".no-webp",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(compressCss())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function js() {
  return src(path.src.js)
    .pipe(
      fileinclude({
        prefix: "@",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeVievBox: false }],
        interlaced: true,
        optimizationLevel: 3, // 0 - 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

gulp.task('svgSprite', function(){ // run 'gulp' comand , after that run 'gulp svgSprite' at other terminal
  return gulp.src([`${source_folder}/iconsprite/*.svg`])
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../icons/icons.svg',
          example: true // creates previev file
        }
      }
    }))
    .pipe(dest(path.build.img))
})

const build = gulp.series(clean, gulp.parallel(html, css, js, images));
const watch = gulp.parallel(build, watcher, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
