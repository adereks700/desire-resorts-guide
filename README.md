# Desire Resorts Guide

An independent, first-timer-friendly travel guide to Desire Riviera Maya and
Desire Pearl, built by Travel with Nicole. Static site generated with
[Eleventy](https://www.11ty.dev/).

This site is an independent travel advisory and affiliate partner. It is not
operated by or owned by Original Group or Desire Resorts.

## Getting started

```bash
npm install
npm run dev
```

This starts a local dev server with live reload at `http://localhost:8080`.

## Scripts

| Command         | What it does                                      |
|------------------|----------------------------------------------------|
| `npm run build` | Builds the production site into `_site/`           |
| `npm start`     | Serves the site without file watching              |
| `npm run dev`   | Serves the site with live reload for local editing  |
| `npm run clean` | Removes the `_site/` build output                   |

The build pipeline (see `eleventy.config.js`) minifies `src/css/main.css` and
minifies each individual file under `src/js/` in place (templates load these
files individually, e.g. `/js/nav.js`, `/js/quiz.js` — not as a single bundle).

## Project structure

- `src/rooms/`, `src/restaurants/`, `src/theme-nights/` — one Markdown file
  per room category, restaurant, and theme night, tagged with a `property`
  (`drm` or `pearl`) and looped over by `rooms.njk`, `dining.njk`, and
  `theme-nights.njk` respectively.
- `src/properties/` — the two resort overview pages.
- `src/_data/` — shared site data (`site.json`, `segments.json` for the quiz
  results, etc.).
- `.htaccess`, `_redirects`, `vercel.json` — equivalent server-redirect rules
  for Apache, Netlify, and Vercel hosting, kept in sync with each other.

## Working on this project

**This repository is the single source of truth.** To avoid regressions,
always start from a fresh `git pull` before making changes, and commit/push
before handing work off to another session or tool — including AI coding
assistants. Content or configuration fixes that only exist in a local copy,
an exported zip, or a "backup" folder are easy to lose or accidentally
reintroduce once a stale copy gets used as a starting point again.

Do not commit manual backup folders (e.g. `backups/src_backup_.../`) — git
history is the backup mechanism. `backups/` is excluded via `.gitignore`.
