# {{siteName}} Website Source Repository

## Directory Structure

This is the directory structure for this repo. Build artifacts, tooling support
and so on are not listed here. Look for a README.md in each top-level subdir for
more details.
```
  /
  - README.md - this file
  - assets/ - original pictures, videos, etc. Not optimized for web
  - jssrc/ - javascript source code
  - lambda/ - source code for Lambda functions, managed with `serverless`
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
  * `npm install -g serverless` to get [Serverless](https://serverless.com) to manage Lambda functions, if you're using them.
  * Optionally edit `ehTemplate.httpPort` in `package.json` to change the dev server's port from 8001.

## Configuration
All configuration for gulp is under the `ehTemplate` key in `package.json`.

Key | Specifies
--- | ---------
awsProfileName | Name of the AWS profile in ~/.aws/credentials.
buildRoot | Target for the `build` task. Used as source for `deploy` and `publish` tasks.
environments | Dictionary of the live environments to deploy/publish to. See notes below.
extraFiles | Array of extra files to copy from `htmlSource` to `buildRoot` (default: ["robots.txt", "sitemap.xml"]). If you need files from a non-local directory (for example, a Python library not included directly in this directory), use RELATIVE path names, such as "../../MyLib/\**/*.py"
hosting | Either 's3hosted' or 'ElasticBeanstalk'. So far.
htmlSource | Whence source documents (default: `site`). See notes below.
httpPort | Port for the dev server (default: 8001).
imgSource | Whence png and jpg images (default: `assets`).
jsSource | Whence JavaScript source code (default: `jssrc`).
lambdas | List of lambda functions to deploy. **Not entirely implemented. See below.**
roleARN | The ARN of the external role for the client (or empty).
sassSource | Whence Sass source code (default: `sass`).
serverDir | Temp dir from which to serve dev content (default: `temp`).
staticDir | Subdir to create for compiled static resources (default: `static`).
type | Project type. Influences dev and build pipelines.

### Hosting-specific Configuration

#### s3hosted

* `s3Exclude` holds a string specifying files to exclude from the sync to s3.
* `environments` holds (under each subkey `alpha` and `production`):

Key | Specifies
--- | ---------
bucket | S3 bucket name
distribution | CloudFront Distribution ID to invalidate on deploy (optional)
url | S3 bucket URL (optional) **currently unused, but I have plans for it**

#### elasticbeanstalk

* `gulp deploy` creates a new application bundle labeled with the current source version (from `package.json`), so be sure to bump your version prior to `gulp build`ing your site. If you don't, EB will try to use the EXISTING such bundle, and you'll shortly need Rogaine.
* If you include `promoteFrom` under `production` (see below), we'll use the same application bundle already running in the named environment. `promoteFrom` MUST contain an Environment name for this to work. This may one day allow for more than one testing stage (alpha -> beta -> production, maybe).
* `environments` holds (under each subkey `alpha` and `production`):

Key | Specifies
--- | ---------
awsEnvironment | EB Environment name
promoteFrom | Which EB Environment to use as the basis of `publish` (production only, 'natch)


### Type-specific Configuration

#### static
* `htmlSource` contains your vanilla HTML.

### eleventy
* `htmlSource` contains your eleventy-supported sources (.md, .html, .njk, etc).

#### flask
* `htmlSource` contains your application code (.py). Put `application.py` here, at least.
* You configure your Flask environment with the `flask` key under `ehTemplate`.

Key | Specifies
--- | ---------
port | Port the Flask server will run on. This will be proxied by BrowserSync; you'll still browse to _localhost:`ehTemplate.httpPort`._
venv | If you're using a VirtualEnv, this is the corresponding "run something in the venv" command. For poetry, "poetry run"; for Pipenv, "pipenv run". If you're not, don't include this key. [And then learn about why you SHOULD be using a venv](https://realpython.com/python-virtual-environments-a-primer/#why-the-need-for-virtual-environments).
envvars | Dictionary of enviroment variables to set, i.e. `{ "FLASK_APP": "site/application.py", "FLASK_ENV": "development" }`

#### hybrid

**_This is still a work in progress. Enter at your own risk!_**

* There will be two additional keys (yes, `frontend` and `backend`) which specify the type (as above) of the frontend and backend apps.
* There will be two additional folders, `frontend` and `backend`, in the project directory.
  * Your source code for the back end (server) process goes in `backend` rather than `site`.
  * Your source code for the front end (web app) process goes in `frontend` rather than `site`.

## Development - Stuff you can run
Once the tooling is in place, from the cloned repo, you can run:
  * `gulp` (or `gulp dev`) - launches a test server (with live-reload), starts your site and watches for changes.
  * `gulp clean` - cleans the `build/` directory.
  * `gulp build` - creates a production build in `build/`.
  * `gulp lambdas` - deploys your listed lambda functions to AWS.
  * `gulp deploy` - deploys the as-built site to your ALPHA (testing) environment. **_Doesn't do lambdas yet. You can add `lambdas` to the line below for now._**
  * `gulp --series build deploy` - builds then deploys to ALPHA.
  * `gulp publish` - deploys the as-built site to your PRODUCTION environment.
  * `gulp version` - displays the version of the gulpfile itself.
  * `gulp update` - update the gulpfile itself from the template.

<sub><sup>
Built from template version 2.1.0.
</sub></sup>
