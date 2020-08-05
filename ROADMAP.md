# Website-Template Roadmap

The intent is to add functionality as my project list demands it. So this is
*highly* subject to change.

My philosophy when creating a site for a client is that they should own the
entire thing, and not need another HPC to figure it out. So, I put everything,
including the code repo, into their AWS account, and access the site's resources
via an external role. Then, when the proverbial bus tolls its bell for me, they
aren't dependant on "figuring out" what I've done.

## Milestones/To Dos

1. Flesh out the template
    * **In progress:** Flesh out sass/elements/*
    * We are linking to /static/... in several places; templatize this (also in create-ehproject.)
    * Add ARIA tags where appropriate.
1. Add site versioning.
    * See maybe [eh-bumpversion](https://www.npmjs.com/package/eh-bumpversion)
1. Add ElasticBeanstalk support to `gulpfile`
1. Add support for file combining with [gulp-useref](https://www.npmjs.com/package/gulp-useref)
1. **Completed:** Automate creation of the icon pack. See [gulp-favicons](https://www.npmjs.com/package/gulp-favicons)
1. Automate sitemap creation/update. See [sitemap-generator-cli](https://www.npmjs.com/package/sitemap-generator-cli)
1. Automate creation of the site image at {{siteURL}}/{{static}}/img/site_image.jpg (referenced my meta-tag in index)
1. Add pre-defined testing targets:
    * Submit to [Google Structured Data Test](https://search.google.com/structured-data/testing-tool/u/0/#url=...)
    * Submit to [WAVE Accessibility Tool](https://wave.webaim.org/report#/{{siteDomain}})
1. Add post-deploy/publish auto-start of the site.
    * Add `gulp start:alpha` to launch the alpha site.
    * Add `gulp start:production` to launch the production site.
