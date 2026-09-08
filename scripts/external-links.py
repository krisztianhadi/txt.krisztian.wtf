#!/usr/bin/env python3
"""Post-build step: make outbound links open in a new tab.

Walks a built site directory and, for every anchor whose href points to a
different host than txt.krisztian.wtf (or is a protocol-relative/mail link,
left alone), adds:
    target="_blank" rel="noopener"          (rel is mandatory with _blank)
    class="ext"                             (drives the little arrow icon)

Only touches .html files; feed.xml and assets are skipped. Idempotent:
anchors that already have a target attribute are left untouched.

Usage: python3 scripts/external-links.py _site
"""
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit

OWN_HOST = "txt.krisztian.wtf"
ANCHOR_RE = re.compile(r"<a\b[^>]*>", re.IGNORECASE)
HREF_RE = re.compile(r"""href\s*=\s*["']([^"']+)["']""", re.IGNORECASE)


def is_external(href: str) -> bool:
    """True when href is an http(s) link to a host other than this site."""
    if not (href.startswith("http://") or href.startswith("https://")):
        return False
    host = urlsplit(href).netloc.lower()
    if ":" in host:  # strip any port
        host = host.split(":", 1)[0]
    return host != OWN_HOST and host != "www." + OWN_HOST


def process_html(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    changed = False

    def annotate(match: re.Match) -> str:
        nonlocal changed
        tag = match.group(0)
        if "target=" in tag:
            return tag
        href_match = HREF_RE.search(tag)
        if not href_match or not is_external(href_match.group(1)):
            return tag
        extra = ' target="_blank" rel="noopener"'
        if "class=" not in tag:
            extra = ' class="ext"' + extra
        changed = True
        return tag[:-1] + extra + tag[-1:]

    new_text = ANCHOR_RE.sub(annotate, text)
    if changed:
        path.write_text(new_text, encoding="utf-8")
    return changed


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
    if not root.is_dir():
        print(f"not a directory: {root}", file=sys.stderr)
        return 1
    updated = 0
    for path in sorted(root.rglob("*.html")):
        if process_html(path):
            updated += 1
    print(f"external-links: annotated {updated} file(s) under {root}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
