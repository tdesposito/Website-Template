# Website-Template

A template for starting web projects, using the
[create-ehproject](https://github.com/tdesposito/EH-CreateProject) tool.

You can just clone this, but the intent it to install create-ehproject and use
IT to create and configure your new project.

**This is VERY MUCH a work in progress. Proceed with caution.**

See [the Road Map](ROADMAP.md) for future plans and current limitations.

See [the Template's README](All/README.md) for how the as-created project works.

## Project Structure

The top-level directories each represent a different portion of a project,
which, when cobbled together, fully express the development environment.

#### /All/
All of the files herein are part of EVERY project.

This is where the `gulpfile` lives.

#### /Hosting-_{hosting}_/

Files specific to particular hosting configurations.

#### /Type-_{type}_/

Files specific to particular project types.
