# jssrc

These are the Javascript files we use in the site.

In Dev mode, these files will be moved into /site/rc/js as `*.min.js` so script
hrefs will work as expected, but you'll still have the full text for debugging
(and no source map needed). When deployed, these will all be transpiled and
uglified.

3rd party *MINIFIED* scripts should be placed in `vendor` and named `*.min.js`.
**BE AWARE:** These will be moved into /rc/js, **not** /rc/js/vendor. Generally,
where possible these should be sourced via CDN, rather than hosted locally.
