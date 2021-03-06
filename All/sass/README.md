# sass

These files are used to generate the CSS for the site.

We use [Sass](https://sass-lang.com) as our source language.

We've cherry-picked ideas and code from [Milligram](https://milligram.io).

## Making Changes
Generally, confine changes to `main.scss` and files in `components/`.

### main.scss
At the top of this file, we establish the general parameters for the site. Using
these parameters will keep the site consistent and (hopefully) clean.

#### Color parameters
```
  $color-primary: #000;
  $background-primary: #fff;
  $color-secondary: #f00;
  $background-secondary: #00f;
  $color-tertiary: #ff0;
  $background-tertiary: #0ff;
  $a11y_level: 'AAA';
```
These parameters include our primary, secondary and tertiary color sets.

##### Auto-accessibility adjustments
By default, we run the colors defined here through an accessibility adjustment
tools (see `sass/utils/_a11y.scss`), so the colors you specify may not be
exactly what you get, but it WILL be more accessible than maybe it would have
been.

 Set `$a11y_level` to:
  * 'AA' for good contrast score.
  * 'AAA' for maximum contrast score
  * 'NO' for no change (actually, anything but 'AA' or 'AAA')

Then, whenever you set colors inside a selector, use our handy mixin:
```
  @include colors($color-primary, $background-primary);
```

#### Font parameters
```
  $font-primary: sans-serif;
  $font-secondary: sans-serif;
```
Put your font stack(s) here. `$font-primary` is used for everything by default.
`$font-secondary` is used for anything with `class="font-secondary"`.

#### sass/utils/Breakpoints

`sass/utils/\_Breakpoints.scss` contains mixins for building consistent media queries. Of course, add/adapt/augment to fit your needs.

Every time you want to write a `@media... ` instead write something like:
```
  @include on_small_screen {
    img {
      max-width: 100%;
    }
  }
```

#### sass/element -- Elements
We adhere to the least-possible-css philosophy, so we don't include the kitchen
sink, until we need it. So in this section, uncomment any element(s) you want to
use in your markup.

### sass/component -- Modules/Block/Components/Whatever-you-like-to-call-it
Finally, these are your intent-specific components.
