# krisztian.txt - txt.krisztian.wtf

A minimal [Jekyll](https://jekyllrb.com) blog served on GitHub Pages.
Markdown posts in, static HTML out. Images are copied through as plain
files. A valid RSS 2.0 feed is generated at `/feed.xml`.

## Quick start (local preview)

Preview uses the same container as CI, so what you see is what deploys:

```sh
docker run --rm \
  -e INPUT_SOURCE=./ -e INPUT_DESTINATION=./_site \
  -e INPUT_VERBOSE=false -e INPUT_FUTURE=false \
  -e INPUT_BUILD_REVISION=local -e INPUT_TOKEN=local \
  -e GITHUB_WORKSPACE=/workspace \
  -v "$PWD":/workspace \
  ghcr.io/actions/jekyll-build-pages:v1.0.13

python3 -m http.server 4000 --directory _site
```

Open http://localhost:4000. (Full command, plus a plain-`jekyll` option for
machines with ruby-dev, in docs/SETUP.md.)

## Write a post

1. Add `_posts/YYYY-MM-DD-some-slug.md` with front matter:

   ```markdown
   ---
   title: Post title here
   date: 2026-09-08 09:00:00 +0700
   ---
   ```

2. Drop images into `assets/images/` and reference them from Markdown.
3. Push to `main`. GitHub Actions builds and deploys - see
   `.github/workflows/pages.yml`.

## Deploy

Push to `main` on GitHub. Requires the one-time repo setting
Settings -> Pages -> Source: "GitHub Actions" (see docs/SETUP.md).

## Docs

- [docs/INDEX.md](docs/INDEX.md) - overview
- [docs/SETUP.md](docs/SETUP.md) - setup and deploy
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - how it works
- [docs/API.md](docs/API.md) - static endpoints (incl. RSS)
- [docs/CHANGELOG.md](docs/CHANGELOG.md) - change history
