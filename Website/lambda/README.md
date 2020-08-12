# lambda

The subdirectories herein contain various functions for deployment to AWS Lambda
via the [Serverless](https://www.serverless.com) toolchain.

## Adding your own lambda functions

  * Run `serverless` (you did install that, right?) in the `lambda` directory
  * Answer the questions serverless provides.
  * Add the newly-created directory to the `ehTemplate.lambdas` key in `package.json`.

## Template functions

You can enable any of the included lambdas by adding them to the
`ehTemplate.lambdas` key in `package.json` after editing them appropriately.

**Note: not yet. You'll have to manually deploy updated lambdas with `serverless deploy`. It's a work in progress**

### contact-form-submission

This function is invoked from the website when the contact form is submitted. It
composes and sends an email with the contact form data.
