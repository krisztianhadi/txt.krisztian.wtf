# Architecture

## Pipeline

```
push to main
   |
   v
.github/workflows/pages.yml (GitHub Actions)
   |  actions/jekyll-build-pages@v1
   |  -> runs the github-pages gem (232) exactly like legacy Pages
   v
_site/  (static output)
   |  actions/upload-pages-artifact + actions/deploy-pages
   v
txt.krisztian.wtf
```

No plugins, no Gemfile in this repo. The workflow's container already has
the whole github-pages gem set baked in, so CI needs zero installs and the
build is reproducible. A repo Gemfile would not be honored anyway (the
action only warns about it) - that is why there is none.

Two github-pages gem defaults worth knowing:

- It excludes `CNAME` from the output. The workflow therefore copies
  `CNAME` into `_site/` after the build so the artifact keeps the custom
  domain (see `.github/workflows/pages.yml`).
- It applies the `jekyll-theme-primer` theme when the config does not name
  one. Harmless here: `_layouts/default.html` and `post.html` always win,
  so primer only adds its unused `assets/css/style.css` to the output.

## Source layout

| Path | Role |
| --- | --- |
| `_config.yml` | Site title/url/timezone, permalinks, markdown settings |
| `index.html` | Homepage: intro copy + "Latest posts" loop |
| `_layouts/default.html` | HTML shell (head, meta, css, RSS autodiscovery) |
| `_layouts/post.html` | Single post page (title, date, content, back links) |
| `_posts/*.md` | Blog posts, one file per post, dated filename |
| `assets/css/style.css` | Local stylesheet - the whole look (see below) |
| `assets/images/` | Post images (copied to output verbatim) |
| `feed.xml` | RSS 2.0 template rendered from `site.posts` |
| `CNAME` | Custom domain; Jekyll copies it into `_site/` so Pages keeps it |
| `favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png` | Serif-K favicon set (see `tools/gen-favicon.py`) |
| `tools/gen-favicon.py` | Deterministic favicon generator (PIL, Liberation Serif Bold) |
| `scripts/external-links.py` | Post-build outbound-link annotation (see below) |

## Notes

- `url` is the absolute production URL; the RSS feed uses it for absolute
  links. Local preview therefore shows production URLs inside the feed -
  expected.
- `timezone: Asia/Bangkok` controls RSS/pubdate offsets (UTC+7).
- Permalinks are `/:title/` (no dates in URLs).
- Shared styling comes from https://krisztian.wtf/style.css (same visual
  family as the other krisztian.wtf pages); `blog.css` only patches what
  Jekyll output needs (rouge highlight colors, code fences, post list).
- Post dates in filenames must match reality: a future-dated file is not
  shown unless `future: true` (set in config).

## Design

All styling is local (`assets/css/style.css`), no remote stylesheets.

- Paper look: off-white background + dark gray text, system serif stack
  (`ui-serif`, Georgia, Times...). Code stays monospace.
- Night mode: pure `prefers-color-scheme` - follows the OS, no toggle, no JS.
  Colors are CSS custom properties swapped in a `@media (prefers-color-scheme: dark)`.
- Accessibility: body text ~13:1, muted labels ~5:1, links ~6.7:1 (light)
  and ~11:1 (dark) contrast; visible focus ring; `color-scheme` set so
  form controls/scrollbars match.
- Rouge token colors are mapped through custom properties so highlighted
  code reads in both modes.

## External links

Jekyll runs in safe mode in the CI container (`_plugins` are ignored), so
link post-processing is a separate build step:

1. `.github/workflows/pages.yml` runs `python3 scripts/external-links.py _site`
   after the Jekyll build.
2. The script adds `target="_blank" rel="noopener"` + `class="ext"` to every
   anchor whose host is not txt.krisztian.wtf. `rel="noopener"` is mandatory
   with `target="_blank"` (tabnabbing protection).
3. `assets/css/style.css` renders `.ext::after` as the same lucide
   arrow-up-right icon krisztian.wtf uses (CSS mask over `currentColor`,
   so it inherits the link color) - outbound links show the brand icon.
4. Feed.xml is untouched (script only processes `.html` files).

Reasons: Markdown has no syntax for link targets, and kramdown cannot be
configured to add them globally; doing it at build time keeps posts plain
Markdown and the behavior consistent everywhere.
