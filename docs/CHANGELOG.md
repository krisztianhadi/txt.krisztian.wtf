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
