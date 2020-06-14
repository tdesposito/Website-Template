# Website-Template Roadmap

The intent is to add functionality as my project list demands it. So this is
*highly* subject to change.

## Milestones

1. Flesh out the template (see todo's below)
2. Add more AWS automation
  * Create S3 buckets for s3-hosted sites.
  * Create a CloudFront distribution.
  * Link a Route53 zone record to the CloudFront distribution.
3. Add ElasticBeanstalk support

## To Do's

### sass

* Flesh out the lib/\_{element}.scss stuff

### gulpfile.js

* Download and extract the template.
  * Update the site's README.md with the project name.
* Automate creation of the icon pack. See [gulp-favicons](https://www.npmjs.com/package/gulp-favicons)
* Automate sitemap creation/update. See [sitemap-generator-cli](https://www.npmjs.com/package/sitemap-generator-cli)
* Add site versioning.
  * We need a way to indicate where to put the version in the site source.
  * `npm-version` works on `package.json` but this may not be what we need.
