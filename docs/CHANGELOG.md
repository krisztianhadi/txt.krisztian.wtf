# Changelog

Dated entries, tagged Feature/Fix/Break.

## 2026-09-08

- [Feature] Converted the static placeholder into a minimal Jekyll blog
  (Braindump, txt.krisztian.wtf).
  - Markdown posts in `_posts/`, images in `assets/images/`.
  - Homepage lists posts; single-post pages via `_layouts/`.
  - RSS 2.0 feed at `/feed.xml` (full content, autodiscovery in head).
  - GitHub Actions deploy: `.github/workflows/pages.yml` (github-pages
    gem 232 build + Pages deploy), replaces the raw-branch deploy.
  - One demo post included (`_posts/2026-09-08-welcome-to-the-braindump.md`);
    delete before real content goes in.
  - Shared krisztian.wtf stylesheet kept; `assets/css/blog.css` adds the
    small bits Jekyll output needs.
  - Fixed stray quote typo in the old `<title>`, and the intro copy no
    longer claims RSS is crossed out.
- [Break] Deploy method changes from "Deploy from branch (main, /root)" to
  GitHub Actions. One-time repo setting required (Settings -> Pages ->
  Source: GitHub Actions) - see docs/SETUP.md.

## 2026-09-08

- [Feature] Redesigned the look (fresh, no more shared krisztian.wtf css).
  - Local stylesheet `assets/css/style.css` replaces the remote one.
  - Off-white paper background, dark gray text, system serif font stack
    (code stays monospace). Contrast-checked for accessibility.
  - Night mode added, driven purely by the OS setting
    (`prefers-color-scheme`), no toggle, no JS.
  - Demo image restyled to the new palette.
- [Break] `assets/css/blog.css` removed (folded into `style.css`).

## 2026-09-08

- [Feature] Outbound links open in a new tab automatically, with a small
  arrow icon.
  - New build step `scripts/external-links.py` (runs after Jekyll in CI and
    in local preview): adds `target="_blank" rel="noopener"` + `class="ext"`
    to anchors whose host is not txt.krisztian.wtf. `rel="noopener"`
    guards against tabnabbing.
  - Local `_plugins` do not run in the github-pages CI container (safe
    mode), so the step lives in the workflow instead.
  - `.ext::after` in `style.css` draws the lucide arrow-up-right icon
    (same as krisztian.wtf's outbound links); feed.xml untouched.
  - Writing links stays plain Markdown - no per-link attributes needed.

## 2026-09-08

- [Feature] Rebrand to "krisztian.txt" + meta + favicon.
  - `_config.yml` title/description renamed (feed + page titles follow).
  - Head meta rewritten: canonical, Open Graph, twitter:card, per-post
    excerpt descriptions; home title is just "krisztian.txt".
  - New favicon: serif "K" tile in site colors - `favicon.svg`,
    `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png` at the repo
    root, generated deterministically by `tools/gen-favicon.py`
    (Liberation Serif Bold on 512 canvas, LANCZOS downscale).
  - Remote krisztian.wtf favicon link dropped.

## 2026-09-08

- [Feature] Umami analytics added to every page head
  (ramen.lostsignals.studio, website-id 66d6b81d-cb0c-41cc-922b-d6de14ab9a38).

## 2026-09-08

- [Feature] Homepage now reads like a blog index: each entry shows the
  title (linked), the date beneath it in the article style, a formatted
  preview of the article's own first two blocks (paragraphs, quotes and
  emphasis keep their styling) and a "continue reading" link, with thin
  separators between entries.
- [Feature] Body font switched to Libre Baskerville (Google Fonts, weights
  400/700 + italic, preconnect, `--font-serif` with a system serif
  fallback); line-height 1.75 -> 1.8 to suit its x-height.
- [Feature] Dev server with live reload: `scripts/dev.sh` watches the
  sources, rebuilds through `scripts/build.sh` (CI container, ~3 s) and
  serves `_site/` with browser-sync on :4000.

## 2026-09-08

- [Fix] Live reload actually reloads now: browser-sync watches `_site/` with
  `usePolling` (`bs-config.js`) because inotify never reported the
  `docker cp` writes, so the previous event-based watching was silent.
- [Feature] Nav arrows are lucide icons drawn as CSS masks instead of
  Unicode arrows. Libre Baskerville ships no arrow glyphs at all (verified
  against all four Google subsets), so Unicode arrows were rendered by
  whatever fallback font the OS picked. "continue reading" uses
  lucide `move-right`; post crumbs use `arrow-left`.

## 2026-09-08

- [Feature] Typography switched to Source Serif 4 for text and Playfair
  Display for headlines (both Google Fonts, `--font-serif` /
  `--font-display` with system serif fallbacks). Body line-height 1.8 ->
  1.7, which was sized for Libre Baskerville's larger x-height.

## 2026-09-08

- [Feature] Headline font changed from Playfair Display to **Fraunces**
  (variable `opsz`/`wght`, headings at weight 600). Source Serif 4 stays
  for body text.

## 2026-09-08

- [Feature] Fraunces keeps its own axis defaults (`SOFT 0`, `WONK 1` at
  weight 600) - a short experiment with `font-variation-settings` (SOFT 100,
  then 25) read too soft, so the override was dropped. Pixel-verified that both
  axes change the rendering.
- [Fix] Masthead set in title case ("Text, Notes and Thoughts") instead of
  all caps.
- [Fix] Homepage previews use body colour like the article text; only the
  date stays muted.
- [Fix] Dark theme retuned: background #161412 -> #1b1917 and text
  #e7e2d6 -> #f0ece2. The near-black background made light text bloom
  (halation), which read as dim and unsharp; contrast is now 14.9:1.
- [Fix] Vertical rhythm reworked with measured gaps: homepage masthead gains
  a 3rem break before the first entry (was 18.7px), the tagline sits 8.5px
  under the h1 (was 0), and article pages get crumb 34px / title 12.8px /
  date 32.3px spacing instead of the old negative-margin hack.
- [Fix] Article back link now reads "back to home" (was "all txt") and keeps
  the lucide arrow-left icon; masthead scales to 52.7px on desktop.
- [Feature] Site title is now "Notes and Stuff by K" and flows into every
  place the site names itself: page `<title>` (homepage and post pages,
  em-dash separator), `og:title`, `og:site_name`, the RSS channel title and
  the feed autodiscovery link. The visible masthead matches: "Notes and Stuff".
- [Feature] Descriptions resolve per page: front-matter `description`, else
  the page's `subtitle` (the homepage tagline is now defined once in
  `index.html` front matter and feeds both the visible tagline and the
  meta/OG description), else a post's first paragraph, else
  `site.description`.
- [Feature] Article-first metadata: `og:title` is now the article's own
  title (the site name only rides in the browser tab), `og:description`
  comes from the article's own text (32 words, word-safe, whitespace
  collapsed), `og:type: article` + `article:published_time` on posts, and
  an `image:` front-matter key (or `site.og_image`) turns on `og:image` +
  `twitter:image` with a `summary_large_image` card. Front-matter
  `description:` overrides the generated summary.
- [Fix] `scripts/build.sh` uses a per-run container name, so a manual build
  no longer collides with the dev watcher's build ("container is marked for
  removal"). Dark `theme-color` meta updated to the new `#1b1917`.
- [Feature] Per-article share cards. `tools/gen-og.mjs` renders a 1200x630
  card for every post - masthead and date, the title in Fraunces, then the
  opening text fading out, i.e. the same idea as a homepage entry - using
  headless Chromium (deterministic, no AI). Cards land in
  `assets/images/og/<slug>.png` and are picked up automatically: the layout
  matches them through `site.static_files`, so a post with a card gets
  `og:image` + `twitter:image` + `summary_large_image`, and a post without
  one simply has no image tag. `scripts/dev.sh` regenerates cards when a
  post changes.
- [Feature] Article pages mirror the homepage entry head: the wordmark
  ("Notes and Stuff", from `site.masthead`) sits on top and links home,
  followed by the title and the date. The "back to home" crumb in the header
  is gone (the wordmark is the backlink); the trailing back link stays.
- [Fix] Article head laid out like the share card: wordmark left and date
  right on one baseline row, title below (was: wordmark, title, date
  stacked, so the date sat in the wrong place next to the card layout).
- [Fix] Article head tuned by eye on top of the card layout: wordmark 17px ->
  19.5px, title 44.2px -> 38.3px (title/wordmark ratio 2.6 -> 1.96), date
  keeps 0.8x the wordmark. Gaps and the hairline rule unchanged.
- [Feature] Fonts are self-hosted: Source Serif 4 (roman + italic) and
  Fraunces as variable woff2 files in `assets/fonts/`, declared in
  `assets/css/fonts.css` and generated by `tools/fetch-fonts.mjs`. The
  Google Fonts `link`s and preconnects are gone, so no third party is
  contacted at runtime (privacy + no CDN dependency); only the latin subset
  is shipped (~300 KB total) with the two primary files preloaded.
  `tools/gen-og.mjs` inlines the same CSS with `file://` URLs, so card
  rendering works offline too.
- [Fix] Favicon is a capital "K" in Fraunces again, and genuinely the same cut
  as the page: the generator pinned only `wght`, so `opsz` stayed at the
  font's default 9 (a text cut) instead of the masthead's 53 - it looked like
  a different typeface. Both axes are now pinned, the script refuses to run if
  the instance is still variable, and the result is verified by ink-shape
  metrics (SVG letter aspect 1.0252 and PNG 1.0179 vs the reference Fraunces
  at opsz 53 = 1.0286; Georgia would be 1.1472).
  `tools/gen-favicon.py` now instantiates the self-hosted variable font,
  bakes the glyph outline into `favicon.svg` (so the vector needs no font
  installed) and rasterises favicon-32 / apple-touch-icon / favicon.ico from
  the same outline.
- [Feature] Homepage share card: `tools/gen-og.mjs` also renders
  `assets/images/og/home.png`: the masthead and tagline only, vertically
  centred, no rule, at the page's own size ratio (card 94px/30px = 3.13,
  page 52.7px/17px = 3.1). `site.og_image` points at it, and it is refreshed
  when `_config.yml` or `index.html` changes.
- [Fix] `tools/gen-og.mjs` inlines the self-hosted fonts as data URLs and
  proves by canvas metrics that both families really paint, aborting if they
  do not - a `file://` font URL never loads in a `setContent` page, so every
  card had silently been rendering in Georgia since the fonts were
  self-hosted.
- [Fix] Share cards now reproduce the page's letterforms exactly. Fraunces
  and Source Serif 4 are variable on `opsz`, and the browser derives it from
  the font size - so card text (94/78/30px) was drawing a much more
  display-flavoured cut than the page (52.7/38/20/17px). Each card element
  now pins `font-variation-settings: "opsz"` to the page's equivalent size
  (`PAGE_OPSZ` in tools/gen-og.mjs). Measured ink aspect of the masthead:
  page 9.154, card 7.653 before -> 9.000 after; article title: page 13.207,
  card 13.305 after.
- [Fix] Cropped descenders on the share cards: the title used
  `line-height: 1.06` together with an `overflow: hidden` long-title guard,
  but Fraunces needs 1.233em (hhea ascent 1956 + descent 510 / 2000 upm), so
  the guard cut the "y" tail and the comma on the hey-wtf card. The card
  title is now `line-height: 1.24` and clips at 3 lines (290px), so the ink
  always fits its line box. Measured title ink height 71px -> 76px
  (unclipped reference 77px).
