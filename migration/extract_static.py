"""Re-extract static pages with Tilda-aware logic.
Tilda blocks (t-title, t-descr, t-btn, etc.) ARE the content — keep them, don't strip.
"""
from __future__ import annotations
import json
import re
import time
import hashlib
from pathlib import Path
from urllib.parse import urlparse, unquote

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).parent
RAW = ROOT / "raw-html"
IMAGES = ROOT / "images"
STATIC = ROOT / "static"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
    "Accept-Language": "ru-RU,ru;q=0.9",
}

BASE = "https://digitalburo.tech"

PAGES = [
    ("/", "home"),
    ("/leadership", "leadership"),
    ("/career", "career"),
    ("/virazh", "virazh"),
    ("/policy", "policy"),
    ("/ru", "ru-legacy"),
    ("/buro", "buro-legacy"),
]


def dl_image(url: str, subdir: Path):
    if not url or not url.startswith("http"):
        return None
    subdir.mkdir(parents=True, exist_ok=True)
    name = unquote(urlparse(url).path.split("/")[-1]).split("?")[0]
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", name)[:80]
    if not name:
        name = hashlib.md5(url.encode()).hexdigest()[:10]
    dest = subdir / name
    if dest.exists():
        return str(dest.relative_to(ROOT))
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        if r.status_code == 200:
            dest.write_bytes(r.content)
            return str(dest.relative_to(ROOT))
    except Exception:
        return None
    return None


def extract(slug: str, url: str):
    cached = next((p for p in RAW.glob(f"*-{slug}.html")), None)
    if cached and cached.exists():
        html = cached.read_text()
    else:
        print(f"  (no cache for {slug}, fetching)")
        r = requests.get(BASE + url, headers=HEADERS, timeout=30)
        html = r.text
    soup = BeautifulSoup(html, "html.parser")

    title_el = soup.find("title")
    title = title_el.text.strip() if title_el else slug
    desc_el = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
    description = desc_el.get("content") if desc_el else ""
    og_el = soup.find("meta", attrs={"property": "og:image"})
    og_image = og_el.get("content") if og_el else None

    # Remove non-content chrome
    for sel in ["script", "style", "noscript", "iframe"]:
        for el in soup.select(sel):
            el.decompose()

    # Collect text blocks from Tilda content classes
    text_blocks = []
    img_dir = IMAGES / slug
    images = []

    # Tilda uses: t-title, t-descr, t-heading, t-text, t-name, t-btntext, t-uptitle, t-submit
    for el in soup.select(
        ".t-title, .t-descr, .t-heading, .t-text, .t-name, .t-btntext, "
        ".t-uptitle, .t-submit, .t-card__title, .t-card__descr, "
        ".t-feed__post-popup__title, .t-feed__post-popup__text, "
        ".tn-atom__title, .tn-atom, .tn-atom__html"
    ):
        txt = el.get_text(separator="\n", strip=True)
        if txt and len(txt) > 2 and txt not in text_blocks:
            text_blocks.append(txt)

    # Fallback: pull headings + paragraphs if no Tilda classes matched
    if not text_blocks:
        for el in soup.find_all(["h1", "h2", "h3", "h4", "p", "li"]):
            txt = el.get_text(strip=True)
            if txt and len(txt) > 4:
                text_blocks.append(txt)

    # Collect all images (img tags + bgimg data attrs)
    seen_img = set()
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-original") or img.get("data-src")
        if src and src.startswith("http") and src not in seen_img:
            seen_img.add(src)
            local = dl_image(src, img_dir)
            if local:
                images.append({"remote": src, "local": local, "alt": img.get("alt", "")})

    for el in soup.find_all(attrs={"data-original": True}):
        src = el.get("data-original")
        if src and src.startswith("http") and src not in seen_img:
            seen_img.add(src)
            local = dl_image(src, img_dir)
            if local:
                images.append({"remote": src, "local": local, "alt": ""})

    # Background images from inline styles
    for el in soup.find_all(style=True):
        m = re.search(r"url\(['\"]?(https?://[^'\"\)]+)['\"]?\)", el.get("style", ""))
        if m:
            src = m.group(1)
            if src not in seen_img:
                seen_img.add(src)
                local = dl_image(src, img_dir)
                if local:
                    images.append({"remote": src, "local": local, "alt": "bg"})

    og_local = dl_image(og_image, img_dir) if og_image else None

    STATIC.mkdir(parents=True, exist_ok=True)
    out = STATIC / f"{slug}.mdx"
    fm_lines = [
        "---",
        f'title: "{title}"',
        f'slug: "{slug}"',
        f'url: "{BASE + url}"',
        f'description: "{(description or "").replace(chr(34), chr(39))}"',
        f'ogImage: "/{og_local}"' if og_local else "ogImage: null",
        f'ogImageRemote: "{og_image}"' if og_image else "ogImageRemote: null",
        f'imagesCount: {len(images)}',
        f'textBlocksCount: {len(text_blocks)}',
        "---",
        "",
    ]
    body = "\n\n".join(text_blocks)

    # Append image manifest
    if images:
        body += "\n\n---\n\n## Images\n\n"
        for img in images:
            alt = img["alt"] or "(no alt)"
            body += f'- ![{alt}](/{img["local"]}) — `{img["remote"]}`\n'

    out.write_text("\n".join(fm_lines) + body + "\n")
    print(f"{slug}: {len(body)} chars, {len(images)} images, {len(text_blocks)} text blocks -> {out.relative_to(ROOT)}")
    return {"slug": slug, "chars": len(body), "images": len(images), "blocks": len(text_blocks)}


def main():
    results = []
    for url, slug in PAGES:
        results.append(extract(slug, url))
    (ROOT / "static-manifest.json").write_text(json.dumps(results, ensure_ascii=False, indent=2))
    print(f"\nDone: {len(results)} pages")


if __name__ == "__main__":
    main()
