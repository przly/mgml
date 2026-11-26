# MGML prenova: changed atoms and modules

Only the files that changed, at the same paths as in the MGML theme repo (`source/...`), so they can be copied over
the existing files. Nothing else from the project is here.

Each file has comments explaining the details; below is a short summary per file.

## How to apply

1. Copy `source/` over the theme's `source/` folder.
2. Delete `source/components/01-atoms/button/button.js` (no longer used, see Button below).
3. New files are picked up by the existing bundle globs (`source/scripts/*.js`, `source/components/**/*.js|scss`):
   `01-atoms/text-reveal/*`, `scripts/02_hover_lines.js`, `scripts/03_press_nudge.js`.
4. Check the two notes marked **Check** below before merging.

## Base (scss/base, scss/mixins, scripts)

- **`scss/base/_variables.scss`**: shared motion tokens: `$hover_in_duration` (0.3s) / `$hover_out_duration` (0.2s),
  the strong ease-out for hovers, the press easing, and a "real hover" media query so hover styles do not stick after
  a tap on touch screens.
- **`scss/base/_root.scss`**: new `--theme-accent` per theme, the colour for links and slider arrows. It is the theme
  colour darkened (or lightened on dark pages) until it reaches WCAG AA 4.5:1 on the page background. The ratio is
  noted next to each value.
- **`scss/base/_extensions.scss`**: new `%hover_lines` directional underline (grows from the side the pointer enters,
  retracts to the side it leaves; driven by `02_hover_lines.js`). `%red_button` hover is now mouse-only.
- **`scss/base/_utility_class.scss`**: `.slider-arrow` reworked to match `.link-with-arrow`: scaled (not resized)
  hover lines growing from the outer edge, press nudge of the arrow, hover only on real-hover devices plus keyboard
  focus.
- **`scss/mixins/_mixins.scss`**: new `link-with-arrow-active` mixin (active underline + arrow), shared by the link
  and by cards that light the link up when the whole card is hovered.
- **`scripts/02_hover_lines.js`** (new): directional hover underline for the menu and other `%hover_lines` elements.
- **`scripts/03_press_nudge.js`** (new): holds the arrow press nudge on `.link-with-arrow` and `.slider-arrow` until
  it has played in full, so a quick click does not cut it off.
- **`scripts/01_default.js`**: the Lenis smooth scrolling init was removed. **Check:** this may have been only for the
  sandbox; keep the Lenis block in the real project if smooth scrolling is still wanted.

## Atoms

- **`01-atoms/button/button.scss`**: the main change set.
  - Hover is an instant colour change (no wipe); `button.js` and its wipe layer are gone.
  - The arrow slides forward on hover (0.45s) and back on hover out (20% faster), with a CSS transition, so leaving
    halfway reverses smoothly.
  - Per-theme colours for primary / secondary / tertiary:
    - Primary hover: the theme colour 20% darker under a light label, 20% lighter under a dark label (Jakopič too).
    - Most themes: secondary gray 800 (gray 700 on hover); tertiary white with a 0.5px gray 200 border (gray 200
      fill and gray 300 border on hover). MGML: secondary is the white bordered one. Jakopič: secondary white,
      tertiary gray 700 with a gray 600 border.
  - WCAG AA on every primary button: gray 800 labels on Bežigrad, Mestna galerija and Vila Zlatica; white label on
    Arheopark Emona; slightly darker reds (`$btn_red`, `$btn_mgml_hover`) so the white labels on Mestni muzej,
    Vžigalica and the MGML hover pass. Ratios are in comments.
  - Secondary buttons have no border in any theme.
  - Transparent buttons: 1px stroke, the same in every theme; on Jakopič (dark page) the dark and light variants are
    swapped.
  - Mobile: hover styles only on devices with a real hover, keyboard focus via `:focus-visible`, press scale on tap,
    no tap highlight, small buttons get a 44px touch area.
- **`01-atoms/link-with-arrow/link-with-arrow.scss`**: underline scaled instead of resized, one arrow (the second stays
  in markup for older templates), press nudge, hover only on real-hover devices plus keyboard focus, "red" variant now
  uses the theme's `--theme-accent`.
- **`01-atoms/text-reveal/`** (new): JS + GSAP port of the Specto text-reveal engine (per word or per line masks),
  used by the landing module intro. Usage is documented at the top of `text-reveal.js`.

## Molecules

- **`02-molecules/menu/menu.scss`, `menu.js`, `menu.twig`**: the mobile menu is now a side panel that slides in from
  the right (open/close driven by `body.is-open-menu`, transitions instead of `slideToggle`), level-1 links fade and
  rise in one after another, accordion submenus animate from `.is-open-submenu` with the chevron in sync, directional
  underline on desktop. Labels are wrapped in `.menu__label`; `aria-expanded` is set on toggles. The mobile menu now
  applies up to Tablet L (`d-lg-none` instead of `d-md-none`).
- **`02-molecules/card/card.scss`**: whole-card hover (real-hover devices + keyboard focus on the card link), slight
  image brightness lift, layering fix so Safari does not paint the image over the tags inside sliders.
- **`02-molecules/program-card/program-card.scss`**: uses the shared `link-with-arrow-active` mixin.
- **`02-molecules/language-switch/language-switch.scss`**: mobile layout now up to Tablet L (`md-down` instead of
  `sm-down`), no colour transition.

## Modules

- **`03-modules/site-header/site-header.scss`, `.js`, `.twig`**: hamburger and mobile layout up to Tablet L; header
  hides/shows on scroll with `transform` instead of `top`; 44px touch targets; press feedback; the hamburger only
  toggles `body.is-open-menu` and `aria-expanded` (the panel animation lives in `menu.scss`).
- **`03-modules/landing-module/landing-module.scss`, `.js`**: homepage hero matched to the corporate site, with a new
  intro (logo fade, title word by word, text line by line, buttons, images wiping open) using the text-reveal atom,
  and a scroll parallax with ScrollTrigger (frames move 100/200px, photos drift inside a 1.25 zoom). Reduced motion:
  fades only, no parallax. **Check:** the scss has a base `h1` rule added because the sandbox lacked the corporate
  site's global `h1` styles; drop it if the real theme already has them.
- **`03-modules/latest-exhibitions/latest-exhibitions.scss`, `.js`**: strong ease-out on the slide transition, reduced
  motion support, and a custom "1 / 4" counter whose number rolls up or down with the slide direction.

## Jira task summary: homepage hero animation

**Title:** Homepage hero (landing module): match the corporate site's intro and add scroll parallax

**Summary:** The homepage hero (`03-modules/landing-module`) was rebuilt to match the corporate site
(mgml-www.specto.work), and its motion was refined. It uses the new text-reveal atom (`01-atoms/text-reveal`), a plain
JS + GSAP port of the Specto text-reveal engine.

**What changed:**

- **Intro sequence:** the background logo fades in, the title reveals word by word, then the text line by line and the
  buttons follow as one continuous sequence, and finally the images rise and wipe open from the bottom, left to right
  on screen. Strong ease-out (easeOutQuart), as on the corporate site.
- **Font loading:** the intro waits for the web fonts (at most 600ms), so the title never swaps font mid-animation.
- **Scroll parallax:** ScrollTrigger replaces ScrollMagic. Over the first viewport height of scroll, each image frame
  moves down 100px or 200px (the corporate site uses 50px or 100px), and the photo inside, zoomed to 1.25, drifts from
  -10% to 10%. The motion is locked to the scroll position, with no random trailing delay. It starts at scroll 0, so
  the first ~106px of scroll is no longer dead.
- **Reduced motion:** no parallax, and the intro is short opacity fades with no movement.
- **No JS:** the hero is hidden for the intro only once the script runs, so without JS it is simply visible.

**Files:** `03-modules/landing-module/landing-module.js`, `landing-module.scss`, `01-atoms/text-reveal/text-reveal.js`,
`text-reveal.scss` (new).

**Code:** https://github.com/przly/mgml (hero: [`landing-module`](https://github.com/przly/mgml/tree/main/source/components/03-modules/landing-module), [`text-reveal`](https://github.com/przly/mgml/tree/main/source/components/01-atoms/text-reveal))

**To check before merging:** `landing-module.scss` has a base `h1` rule because the sandbox lacked the corporate site's
global `h1` styles. Drop it if the real theme already has them.

**Acceptance criteria:**

- The intro plays once on load in the order above, with no font swap or flash of the final state.
- The images move with the scroll only during the first viewport height, and the frame edges never show.
- With "reduce motion" on, the hero only fades in and does not move on scroll.
- With JS disabled, the hero is fully visible.
