# Website-Template Roadmap

The intent is to add functionality as my project list demands it. So this is
*highly* subject to change.

My philosophy when creating a site for a client is that they should own the
entire thing, and not need another HPC to figure it out. So, I put everything,
including the code repo, into their AWS account, and access the site's resources
via an external role. Then, when the proverbial bus tolls its bell for me, they
aren't dependant on "figuring out" what I've done.

## Milestones

1. Flesh out the template (see todo's below)
1. Add more AWS automation
    * Create the CodeCommit repository
    * Create S3 buckets for s3-hosted sites.
    * Create a CloudFront distribution.
    * Link a Route53 zone record to the CloudFront distribution.
1. Add site versioning.
    * We need a way to indicate where to put the version in the site source.
    * `npm-version` works on `package.json` but this may not be what we need.
1. Add ElasticBeanstalk support
1. Add support for file combining with [gulp-useref](https://www.npmjs.com/package/gulp-useref)

## To Do's

### sass

* Flesh out the lib/\_{element}.scss stuff

### gulpfile.js

* Download and extract the template.
    * Update the site's README.md with the project name.
* Automate creation of the icon pack. See [gulp-favicons](https://www.npmjs.com/package/gulp-favicons)
* Automate sitemap creation/update. See [sitemap-generator-cli](https://www.npmjs.com/package/sitemap-generator-cli)
