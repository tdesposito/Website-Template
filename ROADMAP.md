# Website-Template Roadmap

The intent is to add functionality as my project list demands it. So this is
*highly* subject to change.

## Future Features/To Dos

### Template Features
1. Flesh out sass/element/* **In progress**
1. We are linking to /static/... in several places; templatize this (also in create-ehproject.)
1. Add ARIA tags where appropriate.

### Gulpfile Features
1. Add auto-versioning.
    * See (maybe) [eh-bumpversion](https://www.npmjs.com/package/eh-bumpversion)
    * We'll need something in `package.json` to indicate if we auto-bump during `build`, and how to.
    * This means we should probably expose a `bump` task as well.
    * And we should also (optionally) call out to a changelog generator. See [generate-changelog](https://www.npmjs.com/package/generate-changelog).
1. ~~Add ElasticBeanstalk support to `gulpfile`~~ **Completed**
1. ~~Add deploy of lambda functions.~~ **Completed**
1. Add auto-deploy of lambda functions during `deploy` and `publish`.
1. Add a "hybrid" project type, with two (or more?) concurrent build systems. **In progress**
1. Add run-time check for available gulp packages, which may be missing after `gulp update`.
1. Add support for file combining with [gulp-useref](https://www.npmjs.com/package/gulp-useref)
1. ~~Automate creation of the icon pack. See [gulp-favicons](https://www.npmjs.com/package/gulp-favicons)~~ **Completed**
1. Automate sitemap creation/update. See [sitemap-generator-cli](https://www.npmjs.com/package/sitemap-generator-cli)
1. Automate creation of the site image at {{siteURL}}/{{static}}/img/site_image.jpg (referenced my meta-tag in index)
1. Add pre-defined testing targets:
    * Submit to [Google Structured Data Test](https://search.google.com/structured-data/testing-tool/u/0/#url=...)
    * Submit to [WAVE Accessibility Tool](https://wave.webaim.org/report#/{{siteDomain}})
1. Add post-deploy/publish auto-start of the site.
    * Add `gulp start:alpha` to launch the alpha site.
    * Add `gulp start:production` to launch the production site.
