# Personal site

Static HTML/CSS/JS. No build step, no dependencies, no framework.

```
index.html                              the whole live site (one page)
assets/styles.css                       design system
assets/main.js                          theme toggle, sticky rule, scroll reveal

writing/                                PARKED, not linked from the live site
  index.html                            post list
  never-send-a-false-alert.html         post  ← DRAFT, see below
```

## Preview locally

```bash
python3 -m http.server 4321 --directory ~/website
```

Then open http://localhost:4321.

## Before you publish

1. **The writing section is parked, not deleted.** Nothing on the live site links to
   `writing/`. Note that "unlinked" is not "private". A static host still serves those
   files at their URL if you upload them. So `writing/` is in `.gitignore` (it won't be
   committed or deployed) and in `robots.txt` (it won't be indexed if it ever is). See
   "Restoring the writing section" below.
2. **No canonical/`og:url` tags are set**, because there's no domain yet. Once you register
   one, add to each page's `<head>`:
   `<link rel="canonical" href="https://YOURDOMAIN/">`
3. **Your phone number is deliberately not on the site**, matching the personal-info
   cleanup you've been doing elsewhere. Email only.

## Deploying

Any static host works. GitHub Pages is free and needs no account beyond the one you have:

For a GitHub Pages **user site** the repo name must match your username exactly. Your
GitHub account is `Nathan15-CS`, so the repo has to be `Nathan15-CS.github.io`, and the site
is served at `https://nathan15-cs.github.io`.

1. Create an empty public repo named `Nathan15-CS.github.io` at https://github.com/new
2. Then:

```bash
cd ~/website
git init && git add -A && git commit -m "Personal site"
git branch -M main
git remote add origin https://github.com/Nathan15-CS/Nathan15-CS.github.io.git
git push -u origin main
```

3. In the repo's Settings > Pages, confirm the source is branch `main`, folder `/ (root)`.

Give it a minute or two on the first publish. To use a custom domain later, add a `CNAME`
file containing the bare domain and point a DNS `ALIAS`/`A` record at GitHub.

**Netlify Drop** (https://app.netlify.com/drop) is the fastest alternative: drag this
folder in and it returns a live URL. Caveat: a drag-and-drop upload ignores `.gitignore`,
so move `writing/` out of the folder first or the draft post ships with it.

## Design notes

- **Type**: serif display (`ui-serif` → Iowan/Palatino/Georgia), system sans body, mono for
  dates, labels, and section eyebrows. No webfonts, so nothing to download and no layout shift.
- **Color**: near-neutral paper (`#FCFCFB`) / near-neutral ink (`#131312`), with one sienna
  accent (`#8C4A2F`, lightened to `#E0906B` in dark) carrying all the warmth. Surfaces are
  deliberately close to neutral; the RGB spread is 1 on the page and 4 on tinted tiles.
  Every text/background pair clears WCAG AA in both themes, including text on tinted tiles
  (`--text-mute-tint` exists because tiles are darker than the page and need their own value).
- **Theme**: follows the OS by default; the toggle overrides and persists to `localStorage`.
  An inline script in `<head>` applies it before first paint so there's no flash.
- **Motion**: sections fade up on scroll, with a staggered delay. Fully disabled under
  `prefers-reduced-motion`, and a failsafe reveals everything if `IntersectionObserver`
  can't run, so content is never permanently invisible.
- **Print**: `Cmd-P` gives a clean document: nav, footer, and animation stripped, URLs
  expanded after links.

## Restoring the writing section

The files and all their CSS are still here, and a restored post renders correctly with no
styling work. Once you have a real post:

1. Rewrite `writing/never-send-a-false-alert.html` in your own voice and delete the HTML
   comment at the top. It was drafted from your real SeatWatch architecture, but the words
   are not yours, so don't publish it as-is.
2. Remove `writing/` from `.gitignore` and the `Disallow` line from `robots.txt`.
3. Add the nav link back to `index.html`, after the Experience item:
   `<a href="writing/">Writing</a>`
4. Add a Writing section back to `index.html` (a `<section class="shell section" id="writing">`
   holding a `<ul class="posts">` of `<li class="post-row">` entries). `writing/index.html`
   has the exact markup to copy.

To add a further post: copy a file in `writing/`, replace the content, then add a
`<li class="post-row">` to `writing/index.html`.

To add a project: copy the Patch `<li class="entry reveal">` block in `index.html`
under `id="work"` and replace its contents. (The Patch entry has no `<div class="metrics">`
stat block — that pattern is still in `styles.css` if a future project has real, verifiable
numbers to back it, same bar as SeatWatch's 928/884/677.)
