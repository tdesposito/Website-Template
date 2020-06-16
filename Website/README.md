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
  * `git clone codecommit://upalevelk9@UpALevelK9-Website` in your project folder. This relies on setting [AWS CodeCommit-specific configuration](https://docs.aws.amazon.com/codecommit/latest/userguide/cross-account.html).
  * `npm install --global gulp-cli` for [Gulp](https://gulpjs.com).
  * From the cloned repo: `npm install` to get Gulp and all our tools.
  * `npm install -g serverless` to get [Serverless](https://serverless.com) to manage the Lambda functions, if you're using them.
  * You can edit the package.json file to change the dev server's port number, if needed.

## Development - Stuff you can run
Once the tooling is in place, from the cloned repo, you can run:
  * `gulp clean` - cleans the `build/` directory.
  * `gulp dev` - launches a test server (with live-reload), starts your site and watches for changes.
  * `gulp build` - creates a production build in `build/`.
  * `gulp deploy` - builds then deploys to your ALPHA (testing) environment.
  * `gulp publish` - builds then deploys to your PRODUCTION environment.
