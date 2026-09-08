# Docs index

Repo: krisztianhadi/txt.krisztian.wtf - "krisztian.txt" blog.

| File | What it covers |
| --- | --- |
| [SETUP.md](SETUP.md) | Local preview, one-time GitHub Pages setting |
| [ARCHITECTURE.md](ARCHITECTURE.md) | File layout and build pipeline |
| [API.md](API.md) | Static endpoints, RSS details |
| [CHANGELOG.md](CHANGELOG.md) | Dated change history |

Quick pointers:

- Posts live in `_posts/` as `YYYY-MM-DD-slug.md` (see README).
- Images go in `assets/images/`.
- The site builds with Jekyll (CI runs GitHub's `github-pages` gem 232).
- Pushing to `main` deploys via `.github/workflows/pages.yml`.
