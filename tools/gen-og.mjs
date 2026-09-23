#!/usr/bin/env node
/**
 * Generate share cards (1200x630) for the homepage and every post, in one
 * shared style: masthead/date row, the title in Fraunces, a hairline rule,
 * then the opening text (post, fading out) or the tagline (home).
 *
 * Deterministic: fixed viewport, fixed type scale, the site's own self-hosted
 * fonts inlined as data URLs, headless Chromium screenshot. No AI, no network.
 *
 *   node tools/gen-og.mjs            # only missing/stale cards
 *   node tools/gen-og.mjs --force    # rebuild every card
 *
 * Output: assets/images/og/<slug>.png and assets/images/og/home.png
 */
import { chromium } from "/home/k/Code/kaja/node_modules/.pnpm/playwright-core@1.62.1/node_modules/playwright-core/index.mjs";
import { readdirSync, readFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS = join(ROOT, "_posts");
const OUT = join(ROOT, "assets/images/og");
const CHROME_CANDIDATES = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  process.env.CHROME_PATH,
  "/home/k/Code/ghosted/.tmp-review/pw-browsers/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell",
].filter(Boolean);

const W = 1200, H = 630;
const force = process.argv.includes("--force");

// --- fonts ------------------------------------------------------------------
// The fonts are self-hosted, and a page built with setContent cannot fetch
// file:// subresources - so the woff2 files are inlined as data URLs. Without
// this the cards silently render in a fallback serif.
function fontFaces() {
  const css = readFileSync(join(ROOT, "assets/css/fonts.css"), "utf8");
  return css.replace(/url\('\/assets\/fonts\/([^']+)'\)/g, (_, file) => {
    const b64 = readFileSync(join(ROOT, "assets/fonts", file)).toString("base64");
    return `url(data:font/woff2;base64,${b64})`;
  });
}

// --- optical size -----------------------------------------------------------
// Fraunces and Source Serif 4 are variable on opsz, and the browser sets it
// from the font size. The page renders at its own sizes (masthead 52.7px,
// article title 38px, wordmark 20px, date 16px, body 17px); the cards are much
// larger, so without pinning opsz they draw a different, more display-flavoured
// cut. Pinning each card element to the page's equivalent size makes the
// letterforms identical to the page.
const PAGE_OPSZ = {
  masthead: 20,   // .site-mark
  date: 16,       // .post-head .post-meta
  title: 38,      // article h1 (clamp max)
  homeTitle: 53,  // homepage h1 (clamp max 3.1rem = 52.7px)
  text: 17,       // body / previews / tagline (1rem)
};

// --- the shared card look ---------------------------------------------------
const cardCss = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden;
    background: #f7f4ef; color: #2a2825;
    font-family: "Source Serif 4", Georgia, serif;
    padding: 64px 72px; display: flex; flex-direction: column;
  }
  .top { display: flex; justify-content: space-between; align-items: baseline; }
  .masthead {
    font-family: Fraunces, Georgia, serif; font-weight: 600; font-size: 30px;
    letter-spacing: -0.01em; font-variation-settings: "opsz" ${PAGE_OPSZ.masthead};
  }
  .date { font-style: italic; font-size: 24px; color: #6e6a60; font-variation-settings: "opsz" ${PAGE_OPSZ.date}; }
  /* line-height must clear Fraunces' own vertical metrics (hhea ascent 1956 +
     descent 510 per 2000 upm = 1.233em) or the descenders get clipped by the
     overflow guard - that cropped the "y" tail on the hey-wtf card.
     1.24em per line, and 3 lines before the clip, so ink always fits. */
  h1 {
    font-family: Fraunces, Georgia, serif; font-weight: 600; font-size: 78px;
    line-height: 1.24; letter-spacing: -0.02em; margin-top: 34px;
    max-height: 290px; overflow: hidden;
    font-variation-settings: "opsz" ${PAGE_OPSZ.title};
  }
  h1:first-child { margin-top: 0; }
  .rule { border-top: 1px solid rgba(42, 40, 37, .16); margin: 40px 0 28px; }
  .excerpt { font-size: 30px; line-height: 1.5; flex: 1; overflow: hidden; font-variation-settings: "opsz" ${PAGE_OPSZ.text}; }
  .excerpt.fade {
    -webkit-mask-image: linear-gradient(180deg, #000 42%, rgba(0,0,0,0) 100%);
    mask-image: linear-gradient(180deg, #000 42%, rgba(0,0,0,0) 100%);
  }
  .tagline { font-style: italic; font-variation-settings: "opsz" ${PAGE_OPSZ.text}; }
  /* homepage card: same proportions as the page itself - title:tagline 3.1:1
     (52.7px : 17px there), gap half the tagline, block vertically centred,
     no rule */
  .card-home { justify-content: center; }
  .card-home h1 { font-size: 94px; margin-top: 0; font-variation-settings: "opsz" ${PAGE_OPSZ.homeTitle}; }
  .card-home .tagline { font-size: 30px; margin-top: 15px; font-variation-settings: "opsz" ${PAGE_OPSZ.text}; }
`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function page(body, bodyClass = "") {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>${fontFaces()}</style><style>${cardCss}</style></head><body class="${bodyClass}">${body}</body></html>`;
}

// --- sources ----------------------------------------------------------------
function parsePost(file) {
  const raw = readFileSync(join(POSTS, file), "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const fm = m[1], body = m[2];
  const title = (fm.match(/^title:\s*(.+)$/m) || [, ""])[1].trim().replace(/^["']|["']$/g, "");
  const dateRaw = (fm.match(/^date:\s*(.+)$/m) || [, ""])[1].trim();
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "");
  return { file, title, dateRaw, slug, body };
}

// kramdown smartens quotes on the page; the card builds from stripped
// markdown, so do the same here or the card shows straight quotes
function smarten(text) {
  let s = text
    .replace(/(\w)'(\w)/g, "$1\u2019$2")      // don't, people's
    .replace(/(\w)'(?=\s|$)/g, "$1\u2019");   // trailing possessive
  const openAfter = /[\s(\[{<\u2014\u2013-]/;
  s = s.replace(/"/g, (m, i, full) => (i === 0 || openAfter.test(full[i - 1]) ? "\u201C" : "\u201D"));
  s = s.replace(/'/g, (m, i, full) => (i === 0 || openAfter.test(full[i - 1]) ? "\u2018" : "\u2019"));
  return s;
}

function plainText(md) {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^>.*$/gm, " ")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function humanDate(dateRaw) {
  const iso = dateRaw
    .replace(/ (\d{2}:\d{2}(?::\d{2})?)/, "T$1")
    .replace(/ ([+-]\d{4})$/, "$1");
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return dateRaw;
  const months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
  const day = d.getDate();
  const suffix = (day % 10 === 1 && day !== 11) ? "st"
    : (day % 10 === 2 && day !== 12) ? "nd"
    : (day % 10 === 3 && day !== 13) ? "rd" : "th";
  return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
}

function homeContent() {
  const config = readFileSync(join(ROOT, "_config.yml"), "utf8");
  const masthead = (config.match(/^masthead:\s*(.+)$/m) || [, ""])[1].trim().replace(/^["']|["']$/g, "");
  const index = readFileSync(join(ROOT, "index.html"), "utf8");
  const fm = (index.match(/^---\n([\s\S]*?)\n---/) || [, ""])[1];
  const subtitle = (fm.match(/^subtitle:\s*(.+)$/m) || [, ""])[1].trim();
  return { masthead, subtitle };
}

function postCardHtml(post) {
  const text = smarten(plainText(post.body));
  return page(`
  <div class="top">
    <div class="masthead">Notes and Stuff</div>
    <div class="date">${esc(post.date)}</div>
  </div>
  <h1>${esc(post.title)}</h1>
  <div class="rule"></div>
  <div class="excerpt fade">${esc(text.slice(0, 900))}</div>`);
}

function homeCardHtml({ masthead, subtitle }) {
  return page(`
  <h1>${esc(masthead)}</h1>
  <p class="tagline">${esc(smarten(subtitle))}</p>`, "card-home");
}

// --- render -----------------------------------------------------------------
mkdirSync(OUT, { recursive: true });

async function launch() {
  const attempts = [{ args: ["--no-sandbox"] }, ...CHROME_CANDIDATES.map((p) => ({ executablePath: p, args: ["--no-sandbox"] }))];
  const errors = [];
  for (const opts of attempts) {
    try {
      return await chromium.launch(opts);
    } catch (err) {
      errors.push(`${opts.executablePath || "(playwright default)"}: ${err.message.split("\n")[0]}`);
    }
  }
  console.error("gen-og: could not start Chromium.\n  " + errors.join("\n  "));
  console.error("  Fix: install playwright browsers, or set CHROME_PATH=<chromium binary>.");
  process.exit(1);
}

const browser = await launch();

async function render(html, out, label) {
  const cardPage = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await cardPage.setContent(html, { waitUntil: "load" });
  await cardPage.evaluate(async () => {
    // fonts load lazily: pull in every cut a card can use
    await Promise.all([
      document.fonts.load("600 78px Fraunces", "Notes and Stuff"),
      document.fonts.load("400 30px 'Source Serif 4'", "Handgloves"),
      document.fonts.load("italic 400 34px 'Source Serif 4'", "Handgloves"),
    ]);
    await document.fonts.ready;
  });

  // guard: prove the real faces paint, by metrics - a silent fallback serif is
  // exactly the bug this script must not repeat
  const proof = await cardPage.evaluate(() => {
    const c = document.createElement("canvas").getContext("2d");
    const width = (font, text) => { c.font = font; return c.measureText(text).width; };
    const differs = (a, b) => Math.abs(a - b) > 1;
    return {
      fraunces: differs(width("600 78px Fraunces", "Notes and Stuff"), width("600 78px Georgia", "Notes and Stuff")),
      sourceSerif: differs(width("400 30px 'Source Serif 4'", "Handgloves"), width("400 30px Georgia", "Handgloves")),
      errors: [...document.fonts].filter((f) => f.status === "error").map((f) => f.family),
    };
  });
  if (!proof.fraunces || !proof.sourceSerif || proof.errors.length) {
    console.error("gen-og: webfonts are not painting - cards would use a fallback serif. Aborting.");
    console.error("  " + JSON.stringify(proof));
    await browser.close();
    process.exit(1);
  }

  await cardPage.screenshot({ path: out, clip: { x: 0, y: 0, width: W, height: H } });
  console.log(`card   ${label} -> ${out.replace(ROOT + "/", "")}`);
  await cardPage.close();
}

// homepage card (sources: _config.yml and index.html)
const homeOut = join(OUT, "home.png");
const homeSources = [join(ROOT, "_config.yml"), join(ROOT, "index.html")];
if (force || !existsSync(homeOut) || homeSources.some((f) => statSync(homeOut).mtimeMs < statSync(f).mtimeMs)) {
  await render(homeCardHtml(homeContent()), homeOut, "home");
} else {
  console.log("skip   home (card newer than _config.yml and index.html)");
}

const posts = readdirSync(POSTS).filter((f) => f.endsWith(".md")).map(parsePost).filter(Boolean);
for (const post of posts) {
  post.date = humanDate(post.dateRaw);
  const out = join(OUT, `${post.slug}.png`);
  if (!force && existsSync(out) && statSync(out).mtimeMs > statSync(join(POSTS, post.file)).mtimeMs) {
    console.log(`skip   ${post.slug} (card newer than post)`);
    continue;
  }
  await render(postCardHtml(post), out, post.slug);
}

await browser.close();
