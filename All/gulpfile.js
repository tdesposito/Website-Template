/**
 * @file Manages the development, testing and building of your site.
 *
 * Configuration is under the "ehTemplate" key in package.json
 *
 * @author Todd D. Esposito <todd@espositoholdings.com>
 * @version 2.0.0
 * @copyright Todd D. Esposito 2020
 * @license MIT
 */

const version = '2.0.0'

const { exec, execSync, spawn, spawnSync } = require('child_process')
const del = require('del')
const fs = require('fs')
const https = require('https')

const { dest, parallel, series, src, watch } = require('gulp')
const favicons = require('gulp-favicons')
const htmlmin = require('gulp-htmlmin')
const image = require('gulp-imagemin')
const rename = require('gulp-rename')
const sass = require('gulp-sass')
const terser = require('gulp-terser')

const pjson = require('./package.json')
var cfg = pjson.ehTemplate

// These are a bit tricky, and need to be kept in sync, so here they live.
// js and sass sources are not included -- no-premature-optimizations
const srcpath = {
  img: [`${cfg.imgSource}/**/*.{jpg,png,gif}`, `!${cfg.imgSource}/icon/**`],
  icon: `${cfg.imgSource}/icon/logo.png`,
  video: `${cfg.imgSource}/**/*.mp4`,
}

/** clears out the build directory */
function cleanBuildDir() {
  return del(cfg.buildRoot)
}


/** copy files listed in package.json to the build dir */
function copyExtraFiles() {
  return src(cfg.extraFiles, {cwd: cfg.htmlSource, base: cfg.htmlSource, allowEmpty: true})
    .pipe(rename(path => {
      if (path.dirname.startsWith('..')) {
        path.dirname = path.dirname.replace(/\.\.[/\\]*/gi, '')
      }
    }))
    .pipe(dest(cfg.buildRoot))
}


/** Generates the icon set for the site */
function createIconPack() {
  const iconcfg = {
    appName: pjson.name,
    appShortName: pjson.name,
    appDescription: pjson.description,
    version: pjson.version,
    path: `/${cfg.staticDir}/icon/`,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      windows: false,
      yandex: false,
    },
  }
  var pipeline = src(srcpath.icon, {allowEmpty: true})
      .pipe(favicons(iconcfg))
      .pipe(dest(`${cfg.CompileStaticTo}/icon`))
  return pipeline
}


/** Deploys the current build to ElasticBeanstalk */
function ebDeploy(cfg, envcfg) {
  var cmd = ['eb', 'deploy', envcfg.awsEnvironment]
  if (cfg.awsProfileName) {
    cmd.push('--profile')
    cmd.push(cfg.awsProfileName)
  }
  if (envcfg.promoteFrom) {
    cmd.push('--version')
    var status = execSync(`eb status ${envcfg.promoteFrom}`, {cwd: cfg.buildRoot}).toString()
    var running = status.match(/Deployed Version: (.*)/)[1]
    cmd.push(running)
  } else {
    cmd.push('--label')
    cmd.push(`v${pjson.version}`)
  }
  var deployproc = spawnSync(cmd[0], cmd.slice(1), {stdio: 'inherit', cwd: cfg.buildRoot})
}


/** Manipulate source html (or whatever) for the target environment */
function htmlCompile() {
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
    var pipeline
    switch (cfg.type) {
      case 'flask':
        pipeline = src([`${cfg.CompileTo}/**/*`, `!${cfg.CompileTo}/${cfg.staticDir}/**/*`])
        break
      default:
        pipeline = src(`${cfg.CompileTo}/**/*.html`)
        .pipe(htmlmin(htmlmincfg))
    }
    pipeline = pipeline.pipe(dest(cfg.buildRoot))
    return pipeline
  }
}


/** Manipulate source images for the target environment */
function imageCompile() {
  var pipeline = src(srcpath.img)
    .pipe(image({verbose: true}))
    .pipe(src(srcpath.video))
    .pipe(dest(`${cfg.CompileStaticTo}/img`))
  // if (cfg.MODE === 'dev') {
  //   pipeline = pipeline.pipe(cfg.BrowserSync.reload)
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


/** Deploy any updated lambdas to AWS */
function lambdaDeploy() {
  // Scan each subdir of ./Website/lamdba which is listed under `ehTemplate.lambdas`
  // Get the artifact name from .../.serverless/serverless-state.json under `service.artifact`
  // Deploy if any source file (*.js, *.py, serverless.yml) is NEWER than the artifact file using `serverless deploy`
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
    var bscfg = {}
    bscfg = {
      port: cfg.httpPort || 8001,
      ui: {port: 4444},
    }
    if (cfg.type === 'flask') {
      bscfg.proxy = `localhost:${cfg.flask.port}`
    } else {
      bscfg.server = cfg.CompileTo
    }
    cfg.BrowserSync.init(bscfg)
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
exports.build = (cb) => {
  // TODO: Bump Version ?
  setRunMode('build')
  return series(
    cleanBuildDir,
    parallel(
      sassCompile,
      jsCompile,
      imageCompile,
      htmlCompile,
      createIconPack,
    ),
    copyExtraFiles,
  )(cb)
}


/**
 * clears out the build directory
 *
 * @module clean
 */
exports.clean = (cb) => {
  return series(cleanBuildDir)(cb)
}


/**
 * start the development server (this is the default task)
 *
 * @module dev
 */
exports.default = (cb) => {
  let frontserver
  let backserver
  setRunMode('dev')
  switch (cfg.type) {
    case "static":
      watch(`${cfg.htmlSource}/**/*.html`).on('change', cfg.BrowserSync.reload)
      break
    case "eleventy":
      watch(`${cfg.htmlSource}/**/*.{html,njk,md}`, {ignoreInitial: false}, htmlCompile).on('change', htmlCompile)
      break
    case "flask":
      Object.keys(cfg.flask.envvars).forEach(k => {
        process.env[k] = cfg.flask.envvars[k]
      })
      var flaskcmd = `flask run --port ${cfg.flask.port}`.split(' ')
      if (cfg.flask.venv) {
        cfg.flask.venv.split(' ').reverse().forEach(e => flaskcmd.unshift(e))
      }
      backserver = spawn(flaskcmd[0], flaskcmd.slice(1), {stdio: 'inherit'})
      watch(`${cfg.htmlSource}/**/*.{html,jinja2,j2}`).on('change', cfg.BrowserSync.reload)
      break
    case "react":
      frontserver = spawn('npx', `webpack-dev-server --mode development --open --hot --port 4050`.split(' '), {stdio: 'inherit', shell: true})
      break
    default:
      console.log(`\n\n\tI don't know how serve ${cfg.type} sites yet. Sorry.\n\n`)
      break
  }

  watch(srcpath.img, {ignoreInitial: false}, imageCompile)
  watch(`${cfg.sassSource}/**/*.scss`, {ignoreInitial: false}, sassCompile)
  watch(`${cfg.jsSource}/**/*.js`, {ignoreInitial: false}, jsCompile)
  watch(srcpath.icon, {allowEmpty: true, ignoreInitial: true}, createIconPack)
}
// Just a little aliasing...
exports.dev = exports.default


/**
 * deploy the production build to the "Alpha" (testing) environment.
 *
 * @module deploy
 */
exports.deploy = (cb) => {
  switch (cfg.hosting) {
    case "s3hosted":
      syncS3(cfg, cfg.environments.alpha)
      break
    case "elasticbeanstalk":
      ebDeploy(cfg, cfg.environments.alpha)
      break
    default:
      console.log(`I don't yet know how to handle ${cfg.hosting} hosting. Sorry.`)
  }
  cb()
}


/**
 * deploy the production build to the production (live) environment.
 *
 * @module publish
 */
exports.publish = (cb) => {
  // TODO: Update sitemap
  switch (cfg.hosting) {
    case "s3hosted":
      syncS3(cfg, cfg.environments.production)
      break
    case "elasticbeanstalk":
      ebDeploy(cfg, cfg.environments.production)
      break
    default:
      console.log(`I don't yet know how to handle ${cfg.hosting} hosting. Sorry.`)
  }
  cb()
}


/**
 * updates THIS GULPFILE from the template source
 *
 * @module update
 */
exports.update = (cb) => {
  const url = 'https://raw.githubusercontent.com/tdesposito/Website-Template/master/All/gulpfile.js'
  const outfile = fs.createWriteStream('new-gulpfile.js')
  const req = https.get(url, (rsp) => {
    if (rsp.statusCode === 200) {
      rsp.pipe(outfile)
      outfile.on('finish', () => {
        outfile.close()
        fs.copyFileSync('new-gulpfile.js', 'gulpfile.js')
        fs.unlinkSync('new-gulpfile.js')
        console.log('Updated gulpfile.js')
        cb()
      })
    } else {
      console.error(`Could not download new file: ${rsp.statusCode}`)
      cb()
    }
  }).on('error', (e) => {
    console.error(e)
    cb(e)
  })
}


/**
 * displays the version of THIS GULPFILE
 *
 * @module version
 */
exports.version = (cb) => {
  console.log(`EH-Gulpfile version ${version}`)
  cb()
}
