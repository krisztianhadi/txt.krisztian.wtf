# Setup

## One-time GitHub Pages setting

The repo used to deploy the raw `main` branch (static HTML in the root).
Now the site is generated, so Pages must build from the workflow instead:

1. Repo -> Settings -> Pages.
2. Build and deployment -> Source: **GitHub Actions**.

After that every push to `main` runs `.github/workflows/pages.yml`,
which builds and deploys. The `CNAME` file is copied into the build
output, so the txt.krisztian.wtf domain keeps working.

Until this setting is flipped, the old static `index.html` placeholder
will keep being served (or the branch deploy will try its own legacy
Jekyll run once the source changes - flip the setting first, then push).

## Local preview

### Option A - docker, identical to CI (recommended)

Same container the workflow uses, so output matches production byte for byte:

```sh
docker run --rm \
  -e INPUT_SOURCE=./ -e INPUT_DESTINATION=./_site \
  -e INPUT_VERBOSE=true -e INPUT_FUTURE=false \
  -e INPUT_BUILD_REVISION=local -e INPUT_TOKEN=local \
  -e GITHUB_WORKSPACE=/workspace -e GITHUB_REPOSITORY=krisztianhadi/txt.krisztian.wtf \
  -v "$PWD":/workspace \
  ghcr.io/actions/jekyll-build-pages:v1.0.13

# then annotate external links (like CI does) and serve the output
python3 scripts/external-links.py _site
python3 -m http.server 4000 --directory _site
# -> http://localhost:4000
```

Note: the image writes as root, so `_site/` files may be root-owned.

The build does not need a token locally, but the github-pages gem's
jekyll-github-metadata plugin does talk to api.github.com at build time; on
a slow/offline network the build can stall there (CI is unaffected - it
gets a real token automatically).

### Option B - plain jekyll (machine with ruby-dev headers)

```sh
gem install jekyll
jekyll serve
```

Runs plain Jekyll (4.x), not the github-pages gem set - fine for
layout/content checks, may differ in tiny details from CI. Needs the ruby
dev headers (on Fedora/Ultramarine: `dnf install ruby-devel`); without
them native gems (em-websocket etc.) cannot compile, so prefer Option A.

## Adding posts

See README "Write a post". After editing:

- rebuild (option A or B above) and eyeball the post page, the homepage
  list and `/feed.xml`.

## Deploy checklist

1. Local preview looks right.
2. Push to `main` (feature commit).
3. Actions run finishes green; site + feed live on txt.krisztian.wtf.
4. Sanity: `/feed.xml` parses (e.g. https://validator.w3.org/feed/).
