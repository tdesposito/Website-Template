//!---------------------------------------------------------------------------
//  This gulpfile manages the development, testing and build environments.
//
// You configure how this operates by setting params in package.json under the
// "ehTemplate" key.
//
// You probably don't need to adjust anything, unless you need to modify the
// build process. Pull requests gratefully accepted!
//!---------------------------------------------------------------------------

const { dest, parallel, series, src, watch } = require('gulp')
const { exec, execSync } = require('child_process')
const fs = require('fs');
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const image = require('gulp-image')
const rimraf = require('gulp-rimraf')
const htmlmin = require('gulp-htmlmin')

var browserSync = require('browser-sync').create()

var cfg = JSON.parse(fs.readFileSync('./package.json'))
const devDestination = `${cfg.ehTemplate.htmlSource}/${cfg.ehTemplate.staticDir}`
const buildDestination = `${cfg.ehTemplate.buildRoot}/${cfg.ehTemplate.staticDir}`

//#############################################################################
// Common Functions start here
function cleanBuildDir() {
  return src(`${cfg.ehTemplate.buildRoot}/*`, {read: false})
    .pipe(rimraf())
}


function copyStaticFiles() {
  // TODO: specify robots, sitemap explicitly,
  // TODO: pick out stuff in ${...static...} only that which we need
  // TODO: this could be a filter or a pipe(src())
  return src(`${cfg.ehTemplate.htmlSource}/**/*`)
    .pipe(dest(`${cfg.ehTemplate.buildRoot}/`))
}


function htmlMinifyToBuild(cb) {
  return src(`${cfg.ehTemplate.htmlSource}/**/*.html`)
      .pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
      }))
      .pipe(dest(`${cfg.ehTemplate.buildRoot}/`));}


function imageMinifyToBuild() {
  return src(`${cfg.ehTemplate.imgSource}/**/*.+(jpg|png)`)
    .pipe(image().on('error', (e) => console.log(e)))
    .pipe(dest(`${devDestination}/img`))
}


function imageMinifyToDev() {
  return src(`${cfg.ehTemplate.imgSource}/*.+(jpg|png)`)
    .pipe(image().on('error', (e) => console.log(e)))
    .pipe(dest(`${devDestination}/img`))
}


function jsCompileToBuild() {
  return src(`${cfg.ehTemplate.jsSource}/*.js`)
    .pipe(babel())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(uglify())
    .pipe(src(`${cfg.ehTemplate.jsSource}/vendor/*.min.js`))
    .pipe(dest(`${buildDestination}/js`))
    .pipe(browserSync.stream())
}


function jsCompileToDev() {
  return src(`${cfg.ehTemplate.jsSource}/*.js`)
    .pipe(rename({ extname: '.min.js' }))
    .pipe(src(`${cfg.ehTemplate.jsSource}/vendor/*.min.js`))
    .pipe(dest(`${devDestination}/js`))
}


function sassCompileToBuild() {
  return src(`${cfg.ehTemplate.sassSource}/main.scss`)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest(`${buildDestination}/css`))
}


function sassCompileToDev() {
  return src(`${cfg.ehTemplate.sassSource}/main.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest(`${devDestination}/css`))
    .pipe(browserSync.stream())
}


function syncS3(cfg, envcfg) {
  console.log('Syncing to s3...')
  execSync(`aws s3 sync ${cfg.ehTemplate.buildRoot} ${envcfg.bucket} --delete --acl public-read --profile ${cfg.ehTemplate.awsProfileName}`)
  if (envcfg.distribution) {
    console.log("Invalidating site in CloudFront...")
    execSync(`aws cloudfront create-invalidation --distribution-id ${envcfg.distribution} --paths "/*" --profile ${cfg.ehTemplate.awsProfileName}`)
  }
}

//#############################################################################
// Here begin our exported tasks (commands)

exports.build = series(
  cleanBuildDir,
  copyStaticFiles,
  parallel(
    sassCompileToBuild,
    jsCompileToBuild,
    htmlMinifyToBuild,
    imageMinifyToBuild,
  )
)


exports.clean = () => {
  return cleanBuildDir()
}


exports.deploy = (cb) => {
  // This deploys the site to the "alpha" site configuration
  // TODO: Bump Pre-Version
  if (cfg.ehTemplate.hosting === "s3hosted") {
    envcfg = cfg.ehTemplate.environments.alpha
    syncS3(cfg, envcfg)
  } else {
    console.log("I don't yet know how to handle the hosting type indicated in package.json. Aborting.")
  }
  cb()
}


exports.dev = (cb) => {
  browserSync.init({ server : { baseDir: cfg.ehTemplate.htmlSource }, port: cfg.ehTemplate.httpPort || 8080 })
  watch(`${cfg.ehTemplate.sassSource}/**/*.scss`, {ignoreInitial: false}, sassCompileToDev)
  watch(`${cfg.ehTemplate.jsSource}/**/*.js`, {ignoreInitial: false}, jsCompileToDev)
  watch(`${cfg.ehTemplate.imgSource}/*.jpg`, {ignoreInitial: false}, imageMinifyToBuild)
  watch(`${cfg.ehTemplate.htmlSource}/**/*.(html|png|jpg)`).on('change', browserSync.reload)
  // TODO: watch(`${cfg.ehTemplate.imgSource}/icon/logo.jpg`, {ignoreInitial: true}, createIconPack)
}


exports.publish = (cb) => {
  // This deploys the site to the "production" site configuration
  // TODO: Bump Version
  // TODO: Update sitemap
  if (cfg.ehTemplate.hosting === "s3hosted") {
    envcfg = cfg.ehTemplate.environments.production
    syncS3(cfg, envcfg)
  } else {
    console.log("I don't yet know how to handle the hosting type indicated in package.json. Aborting.")
  }
  cb()
}
