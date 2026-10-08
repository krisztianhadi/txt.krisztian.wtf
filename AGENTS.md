# txt.krisztian.wtf — agent instructions

Static Jekyll blog (GitHub Pages). Documentation: `README.md`,
`docs/{INDEX,API,ARCHITECTURE,SETUP,CHANGELOG}.md`.

## Post edits — "the same treatment"

Spellchecking here means **typos and very bad grammar only**: missing
words/articles, broken idioms, broken parallelism, wrong word, missing verbs,
lowercase "i". Never reword and never touch voice — fragments, asides, slang,
hyphen/dash style and capitalisation quirks all stay.

After editing a post:

1. Regenerate the share card: `node tools/gen-og.mjs`.
2. Rebuild for his review: `scripts/dev.sh` (browser-sync on `localhost:4000`)
   or `scripts/build.sh` for a one-off build. `bs-config.js` **requires**
   `watchOptions.usePolling` — containers write via `docker cp`, so inotify never
   fires and event-based watching silently never reloads.
3. Push only on his explicit yes.

Card/font parity rules (data-URL fonts, the metric font guard, `opsz` pinning,
`smarten()`), the staged `_deploy` CI flow and the rest: Mnemon doc `c03de6b6`.

## Verification trap

Poll a GitHub Actions run by `head_sha`. Querying `?branch=main&per_page=1` once
matched the *previous* run and produced a false green plus spurious 404s on the
new assets.
