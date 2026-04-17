"""Scrape remaining digitalburo.tech pages that blog migration didn't cover.
- Static: /, /leadership, /career, /virazh
- Podcasts: 6 x /tpost/
- Vacancies: 4 x /tpost/
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
from markdownify import markdownify as md

ROOT = Path(__file__).parent
RAW = ROOT / "raw-html"
IMAGES = ROOT / "images"
STATIC = ROOT / "static"
PODCASTS = ROOT / "podcasts"
VACANCIES = ROOT / "vacancies"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.7",
}

BASE = "https://digitalburo.tech"

STATIC_PAGES = [
    ("/", "home"),
    ("/leadership", "leadership"),
    ("/career", "career"),
    ("/virazh", "virazh"),
]

PODCASTS_URLS = [
    "/tpost/ayz5zzj661-1-iskusstvo-zakaznoi-razrabotki",
    "/tpost/ndpfff4ll1-2-kak-ustroen-internet",
    "/tpost/4rgihsday1-3-kak-python-razrabotchik-prevraschaetsy",
    "/tpost/lubrbml771-4-pochemu-gospodryadi-peredayut-druzyam",
    "/tpost/tzvjfmakz1-5-snachala-distributsiya-zatem-produkt",
    "/tpost/p33fpx4f71-6-kak-vibirayut-yazik-programmirovaniya",
]

VACANCIES_URLS = [
    "/tpost/9pyckxd3n1-flutter-razrabotchik",
    "/tpost/yo0iei17a1-middle-php-laravel-web-razrabotchik",
    "/tpost/g1vvl19a91-menedzher-po-b2b-prodazham",
    "/tpost/ji623k2n61-middle-project-manager",
]


def fetch(url: str) -> str:
    path = url if url.startswith("http") else BASE + url
    for d in (RAW,):
        d.mkdir(parents=True, exist_ok=True)
    key = hashlib.md5(path.encode()).hexdigest()[:10]
    cache = RAW / f"{key}-{urlparse(path).path.strip('/').replace('/', '_')[:60] or 'home'}.html"
    if cache.exists():
        return cache.read_text()
    print(f"GET {path}")
    r = requests.get(path, headers=HEADERS, timeout=30)
    r.raise_for_status()
    cache.write_text(r.text)
    time.sleep(0.5)
    return r.text


def dl_image(url: str, subdir: Path) -> str | None:
    if not url or not url.startswith("http"):
        return None
    subdir.mkdir(parents=True, exist_ok=True)
    name = unquote(urlparse(url).path.split("/")[-1]).split("?")[0]
    name = re.sub(r"[^A-Za-z0-9._-]+", "_", name)[:80] or hashlib.md5(url.encode()).hexdigest()[:10]
    dest = subdir / name
    if dest.exists():
        return str(dest.relative_to(ROOT))
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        if r.status_code == 200:
            dest.write_bytes(r.content)
            return str(dest.relative_to(ROOT))
    except Exception as e:
        print(f"  ! image fail {url}: {e}")
    return None


def extract_meta(soup: BeautifulSoup) -> dict:
    def mp(prop, attr="content"):
        el = soup.find("meta", attrs={"property": prop}) or soup.find("meta", attrs={"name": prop})
        return el.get(attr) if el else None
    title = soup.find("title")
    return {
        "title": (title.text.strip() if title else None),
        "description": mp("description") or mp("og:description"),
        "og_title": mp("og:title"),
        "og_image": mp("og:image"),
        "og_type": mp("og:type"),
        "canonical": (soup.find("link", rel="canonical") or {}).get("href") if soup.find("link", rel="canonical") else None,
    }


def extract_body(soup: BeautifulSoup) -> str:
    """Strip Tilda chrome, keep article/main content blocks."""
    for sel in ["script", "style", "noscript", "iframe", "header", "footer", "nav", ".t228", ".t190", ".t396__artboard"]:
        for el in soup.select(sel):
            el.decompose()
    main = soup.find("article") or soup.find("main") or soup.find("div", class_=re.compile("t-body|t-container"))
    if main:
        return str(main)
    return str(soup.body) if soup.body else ""


def scrape_page(url: str, out_dir: Path, kind: str, slug: str):
    html = fetch(url)
    soup = BeautifulSoup(html, "html.parser")
    meta = extract_meta(soup)
    body_html = extract_body(soup)
    body_md = md(body_html, heading_style="ATX", bullets="-")
    body_md = re.sub(r"\n{3,}", "\n\n", body_md).strip()

    img_dir = IMAGES / slug
    images = []
    for m in re.finditer(r"!\[[^\]]*\]\(([^)]+)\)", body_md):
        src = m.group(1)
        if src.startswith("http"):
            local = dl_image(src, img_dir)
            if local:
                images.append({"remote": src, "local": local})
                body_md = body_md.replace(src, "/" + local)

    og_local = None
    if meta.get("og_image"):
        og_local = dl_image(meta["og_image"], img_dir)

    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"{slug}.mdx"
    fm = {
        "title": meta["title"],
        "slug": slug,
        "url": BASE + url if not url.startswith("http") else url,
        "description": meta["description"],
        "ogImage": "/" + og_local if og_local else None,
        "ogImageRemote": meta["og_image"],
        "kind": kind,
    }
    fm_lines = ["---"]
    for k, v in fm.items():
        if v is None:
            fm_lines.append(f'{k}: null')
        elif isinstance(v, str):
            safe = v.replace('"', '\\"')
            fm_lines.append(f'{k}: "{safe}"')
        else:
            fm_lines.append(f'{k}: {json.dumps(v, ensure_ascii=False)}')
    fm_lines.append("---\n")
    out_file.write_text("\n".join(fm_lines) + "\n" + body_md + "\n")
    print(f"  -> {out_file.relative_to(ROOT)} ({len(body_md)} chars, {len(images)} images)")
    return {"slug": slug, "url": url, "meta": meta, "out": str(out_file.relative_to(ROOT)), "images": len(images), "body_chars": len(body_md)}


def main():
    manifest = {"static": [], "podcasts": [], "vacancies": []}

    for url, slug in STATIC_PAGES:
        manifest["static"].append(scrape_page(url, STATIC, "static", slug))

    for url in PODCASTS_URLS:
        slug = url.rsplit("/tpost/", 1)[-1]
        manifest["podcasts"].append(scrape_page(url, PODCASTS, "podcast", slug))

    for url in VACANCIES_URLS:
        slug = url.rsplit("/tpost/", 1)[-1]
        manifest["vacancies"].append(scrape_page(url, VACANCIES, "vacancy", slug))

    (ROOT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"\nManifest -> {ROOT / 'manifest.json'}")
    print(f"Static: {len(manifest['static'])}, Podcasts: {len(manifest['podcasts'])}, Vacancies: {len(manifest['vacancies'])}")


if __name__ == "__main__":
    main()
