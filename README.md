# Notes and Stuff by K - txt.krisztian.wtf

A minimal [Jekyll](https://jekyllrb.com) blog served on GitHub Pages.
Markdown posts in, static HTML out. Images are copied through as plain
files. Every article gets its own title, description and 1200x630 share
card, and a valid RSS 2.0 feed is generated at `/feed.xml`.

## Quick start (local preview)

```sh
bash scripts/dev.sh          # -> http://localhost:4000
```

Builds through the same container CI uses, serves `_site/` with browser-sync
and reloads the browser on every save (~3 s rebuild). `bash scripts/build.sh`
rebuilds without serving; `PORT=4100 bash scripts/dev.sh` uses another port.
Details, including a plain-`jekyll` option, are in docs/SETUP.md.

## Write a post

1. Add `_posts/YYYY-MM-DD-some-slug.md` with front matter:

   ```markdown
   ---
   title: Post title here
   date: 2026-09-08 09:00:00 +0700
   ---
   ```

2. Drop images into `assets/images/` and reference them from Markdown.
3. If the preview is running, the post's share card regenerates on save.
   Otherwise run `node tools/gen-og.mjs` (skips cards that are up to date).
4. Push to `main`. GitHub Actions builds and deploys - see
   `.github/workflows/pages.yml`.

Front matter a post may also set: `description` (overrides the generated
summary) and `image` (overrides the generated card).

## Deploy

Push to `main` on GitHub. Requires the one-time repo setting
Settings -> Pages -> Source: "GitHub Actions" (see docs/SETUP.md).

## Docs

- [docs/INDEX.md](docs/INDEX.md) - overview
- [docs/SETUP.md](docs/SETUP.md) - setup and deploy
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - how it works
- [docs/API.md](docs/API.md) - static endpoints (incl. RSS)
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - change history
