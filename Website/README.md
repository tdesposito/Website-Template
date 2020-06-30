# {{siteName}} Website Source Repository

## Directory Structure

This is the directory structure for this repo. Build artifacts, tooling support,
and so on are not listed here. Look for a README.md in each top-level subdir for
more details.
```
  /
  - README.md - this file
  - assets/ - original pictures, videos, etc. Not optimized for web.
  - jssrc/ - javascript source code
  - lambda/ - source code for Lambda functions. Managed with `serverless`
  - sass/ - source code for building site CSS
  - site/ - source html, etc
```

## Tooling - What to install
You'll need to follow the steps below to develop your site. Skip what you
already have, naturally.
  * Install [Node](https://nodejs.org/en/download/) via your favorite package tool or the installer.
  * Install [Git](https://git-scm.com) via your favorite package tool or the installer.
  * `git clone codecommit://{{profile}}@{{siteName}}-Website` in your project folder. This relies on setting [AWS CodeCommit-specific configuration](https://docs.aws.amazon.com/codecommit/latest/userguide/cross-account.html).
  * `npm install --global gulp-cli` for [Gulp](https://gulpjs.com).
  * From the cloned repo: `npm install` to get Gulp and all our tools.
  * `npm install -g serverless` to get [Serverless](https://serverless.com) to manage the Lambda functions, if you're using them.
  * Optionally edit `ehTemplate.httpPort` in `package.json` to change the dev server's port from 8001.

## Configuration
All configuration for gulp is under the `ehTemplate` key in `package.json`.

Key | Specifies
--- | ---------
type | Project type (static, eleventy, ...). Influences dev and build pipelines.
hosting | Either 's3hosted' or 'ElasticBeanstalk'. So far.
roleARN | The ARN of the external role for the client (or empty).
httpPort | Port for the dev server (default: 8001).
htmlSource | Whence source documents (default: `site`). For `static` sites, this is vanilla HTML. For `eleventy`, this is eleventy-supported source, such as MD, HTML, NJK, etc.
imgSource | Whence png and jpg images (default: `assets`).
jsSource | Whence JavaScript source code (default: `jssrc`).
sassSource | Whence Sass source code (default: `sass`).
staticDir | Subdir to create for compiled static resources (default: `static`).
serverDir | Temp dir from which to serve dev content (default: `temp`).
buildRoot | Target for the `build` task. Used as source for `deploy` and `publish` tasks.
extraFiles | Array of extra files to copy from `htmlSource` to `buildRoot` (default: ["robots.txt", "sitemap.xml"]).
lambdas | List of lambda functions to auto-deploy. **Not yet implemented.**
s3Exclude | String specifying files to exclude from the sync to s3.


## Development - Stuff you can run
Once the tooling is in place, from the cloned repo, you can run:
  * `gulp` (or `gulp dev`) - launches a test server (with live-reload), starts your site and watches for changes.
  * `gulp clean` - cleans the `build/` directory.
  * `gulp build` - creates a production build in `build/`.
  * `gulp deploy` - deploys the as-built site to your ALPHA (testing) environment.
  * `gulp publish` - deploys the as-built site to your PRODUCTION environment.
