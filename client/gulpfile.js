let config = require("./build.json");
let local = require("../config/local.json");
const gulp = require("gulp");
const webpackStream = require("webpack-stream");
const bs = require("browser-sync").create();
const fs = require("fs");

const checkIfProduction = () => {
  console.log(`######## Environment: [${process.env.ENV_TYPE}] ########`);
  return process.env.ENV_TYPE === "production" || process.env.ENV_TYPE === "prod";
};

const UpdateConfigFile = () => {
  let isDebugMode = !checkIfProduction();
  let rawdata = fs.readFileSync("../config/client.json");
  let config = JSON.parse(rawdata);

  if (isDebugMode != config.debugMode) {
    config.debugMode = isDebugMode;
    fs.writeFileSync("../config/client.json", JSON.stringify(config));
  }
};

UpdateConfigFile();

const buildVendors = () => {
  reloadConfig();
  return webpackStream({
    entry: config.vendors.entry,
    mode: "none",
    optimization: {
      minimize: true
    },
    output: {
      filename: config.vendors.outputFile
    }
  }).pipe(gulp.dest(config.vendors.outputPath));
};

const buildJs = () => {
  let isProd = checkIfProduction();
  reloadConfig();
  return webpackStream({
    entry: config.js.entry,
    mode: "none",
    optimization: {
      minimize: isProd
    },
    output: {
      filename: "[name].js"
    }
  }).pipe(gulp.dest(config.js.outputPath));
};

function watchFiles() {
  gulp.watch("./gulpfile.js", process.exit);
  gulp.watch("./build.json", gulp.series(buildVendors, buildJs));

  gulp.watch("./js/vendors/**/*", gulp.series(buildVendors));
  gulp.watch("./js/**/*", gulp.series(buildJs));
  gulp.watch(["../public/**/*"], gulp.series(browserSyncReload));
  gulp.watch(["../views/**/*"], gulp.series(browserSyncReload));
}

function browserSync(done) {
  reloadConfig();
  bs.init({
    proxy: local.app.url
    // server: {
    //   baseDir: "./",
    //   middleware: function(req, res, next) {
    //     res.setHeader("Access-Control-Allow-Origin", "*");
    //     res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    //     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    //     next();
    //   }
    // }
  });
  done();
}

function browserSyncReload(done) {
  bs.reload();
  done();
}

const reloadConfig = () => {
  config = JSON.parse(fs.readFileSync("./build.json", "utf8"));
};

const build = gulp.series(buildVendors, buildJs);
const watch = gulp.parallel(buildVendors, buildJs, watchFiles, browserSync);

exports.vendors = buildVendors;
exports.js = buildJs;
exports.build = build;
exports.watch = watch;
exports.default = watch;
