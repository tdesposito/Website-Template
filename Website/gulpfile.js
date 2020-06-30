/**
 * @file Manages the development, testing and building of your site.
 *
 * Configuration is under the "ehTemplate" key in package.json
 *
 * @author Todd D. Esposito <todd@espositoholdings.com>
 * @version 1.0.0
 * @copyright Todd D. Esposito 2020
 * @license MIT
 */

 const { exec, execSync } = require('child_process')
 const del = require('del')
 const fs = require('fs')

const { dest, parallel, series, src, watch } = require('gulp')
const htmlmin = require('gulp-htmlmin')
const image = require('gulp-image')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const terser = require('gulp-terser')

var cfg = JSON.parse(fs.readFileSync('./package.json')).ehTemplate

/** clears out the build directory */
function cleanBuildDir() {
  return del([`${cfg.buildRoot}/**/*`])
}


/** copy files listed in package.json to the build dir */
function copyExtraFiles() {
  return src(cfg.extraFiles, {cwd: cfg.htmlSource, base: cfg.htmlSource})
    .pipe(dest(cfg.buildRoot))
}


/** Manipulate soure html (or whatever) for the target environment */
async function htmlCompile() {
  var htmlmincfg = {
    collapseWhitespace: true,
    minifyCSS: true,
    removeComments: true,
  }

  if (cfg.type === 'eleventy') {
    console.log(execSync(`npx @11ty/eleventy --input=${cfg.htmlSource} --output=${cfg.CompileTo}`).toString())
  }

  if (cfg.MODE === 'dev') {
    return cfg.BrowserSync.reload()
  } else {
    pipeline = src(`${cfg.CompileTo}/**/*.html`)
        .pipe(htmlmin(htmlmincfg))
        .pipe(dest(cfg.buildRoot))
    return pipeline
  }
}


/** Manipulate source images for the target environment */
function imageCompile() {
  var pipeline = src(`${cfg.imgSource}/**/*.{jpg,png}`)
    .pipe(image().on('error', (e) => console.log(e)))
    .pipe(dest(`${cfg.CompileStaticTo}/img`))
  // if (cfg.MODE === 'dev') {
  //   pipline = pipeline.pipe(cfg.BrowserSync.reload())
  // }
  return pipeline
}


/** Manipulate source JavaScript for the target environment */
function jsCompile() {
  var tersercfg = { compress: false, mangle: false, }
  if (cfg.MODE === 'build') {
    tersercfg.compress = { defaults: true }
    tersercfg.output = { comments: false }
  }
  var pipeline = src(`${cfg.jsSource}/*.js`)
    .pipe(terser(tersercfg))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(src(`${cfg.jsSource}/vendor/*.min.js`))
    .pipe(dest(`${cfg.CompileStaticTo}/js`))
  if (cfg.MODE === 'dev') {
    pipeline = pipeline.pipe(cfg.BrowserSync.stream())
  }
  return pipeline
}


/** Manipulate source Sass into CSS for the target environment */
function sassCompile() {
  var sasscfg = {}
  if (cfg.MODE === 'build') {
    sasscfg = {outputStyle: 'compressed'}
  }
  var pipeline = src(`${cfg.sassSource}/main.scss`)
      .pipe(sass(sasscfg).on('error', sass.logError))
      .pipe(rename({ extname: '.min.css' }))
      .pipe(dest(`${cfg.CompileStaticTo}/css`))
  if (cfg.MODE === 'dev') {
    pipeline = pipeline.pipe(cfg.BrowserSync.stream())
  }
  return pipeline
}


/**
 * set the operational mode of the script
 *
 * @param {string} mode The mode: 'dev', 'build'
 */
function setRunMode(mode) {
  // We set these parameters in the global `cfg`:
  // - MODE - um, yeah, the mode
  // - CompileFrom - input for the htmlCompile step
  // - CompileTo - output from the htmlCompile step
  // - CompileStaticTo - output from all the other *Compile steps

  cfg.MODE = mode
  if (mode == 'dev') {
    cfg.CompileFrom = cfg.htmlSource
    switch (cfg.type) {
      case 'eleventy':
        cfg.CompileTo = cfg.serverDir
        break
      default:
        cfg.CompileTo = cfg.htmlSource
        break
    }
    cfg.CompileStaticTo = `${cfg.CompileTo}/${cfg.staticDir}`
    cfg.BrowserSync = require('browser-sync').create()
    cfg.BrowserSync.init({ server: cfg.CompileTo, port: cfg.httpPort || 8001, ui: false })
  } else {
    cfg.CompileFrom = cfg.htmlSource
    switch (cfg.type) {
      case 'eleventy':
        cfg.CompileTo = cfg.serverDir
        break
      default:
        cfg.CompileTo = cfg.htmlSource
        break
    }
    cfg.CompileStaticTo = `${cfg.buildRoot}/${cfg.staticDir}`
  }
}


/** syncs the build directory to S3, and invalidates the associated distribution */
function syncS3(cfg, envcfg) {
  var cmdline = `aws s3 sync ${cfg.buildRoot} s3://${envcfg.bucket} --delete --acl public-read --profile ${cfg.awsProfileName}`
  if (cfg.s3Exclude) {
    cmdline += ` --exclude "${cfg.s3Exclude}"`
  }
  console.log('Syncing to s3...')
  console.log(execSync(cmdline).toString())
  if (envcfg.distribution) {
    console.log("Invalidating site in CloudFront...")
    console.log(execSync(`aws cloudfront create-invalidation --distribution-id ${envcfg.distribution} --paths "/*" --profile ${cfg.awsProfileName}`).toString())
  }
}


/**
 * build a production-ready version of the site.
 *
 * @module build
 */
exports.build = async (cb) => {
  setRunMode('build')
  await cleanBuildDir()
  await copyExtraFiles()
  await sassCompile()
  await jsCompile()
  await htmlCompile()
  await imageCompile()
  cb()
}


/**
 * clears out the build directory
 *
 * @module clean
 */
exports.clean = async (cb) => {
  await cleanBuildDir()
  cb()
}


/**
 * start the development server (this is the default task)
 *
 * @module dev
 */
exports.default = (cb) => {
  setRunMode('dev')
  switch (cfg.type) {
    case "static":
      watch(`${cfg.htmlSource}/**/*.html`).on('change', cfg.BrowserSync.reload)
      break
    case "eleventy":
      watch(`${cfg.htmlSource}/**/*.{html,njk,md}`, {ignoreInitial: false}).on('change', htmlCompile)
      break
    default:
      console.log(`I don't know how serve ${cfg.type} sites yet. Sorry.`)
      break
  }

  watch(`${cfg.imgSource}/*.{jpg,png}`, {ignoreInitial: false}, imageCompile)
  watch(`${cfg.sassSource}/**/*.scss`, {ignoreInitial: false}, sassCompile)
  watch(`${cfg.jsSource}/**/*.js`, {ignoreInitial: false}, jsCompile)
  // TODO: watch(`${cfg.imgSource}/icon/logo.jpg`, {ignoreInitial: true}, createIconPack)
}
exports.dev = exports.default


/**
 * deploy the production build to the "Alpha" (testing) environment.
 *
 * @module deploy
 */
exports.deploy = (cb) => {
  // This deploys the site to the "alpha" site configuration
  // TODO: Bump Pre-Version
  if (cfg.hosting === "s3hosted") {
    envcfg = cfg.environments.alpha
    syncS3(cfg, envcfg)
  } else {
    console.log("I don't yet know how to handle the hosting type indicated in package.json. Aborting.")
  }
  cb()
}


/**
 * deploy the production build to the production (live) environment.
 *
 * @module publish
 */
exports.publish = (cb) => {
  // This deploys the site to the "production" site configuration
  // TODO: Bump Version
  // TODO: Update sitemap
  if (cfg.hosting === "s3hosted") {
    envcfg = cfg.environments.production
    syncS3(cfg, envcfg)
  } else {
    console.log("I don't yet know how to handle the hosting type indicated in package.json. Aborting.")
  }
  cb()
}
