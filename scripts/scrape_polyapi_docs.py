import csv
import json
import os
import re
import shutil
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

BASE = 'https://docs.polyapi.io/'
SEARCHINDEX = urljoin(BASE, 'searchindex.js')
OUTDIR = '/Users/christopher/polyapi-docs-markdown'
PAGES_DIR = os.path.join(OUTDIR, 'pages')
MANIFEST = os.path.join(OUTDIR, 'manifest.csv')
SUMMARY = os.path.join(OUTDIR, 'summary.json')

session = requests.Session()
session.headers.update({'User-Agent': 'Mozilla/5.0 HermesAgent/1.0'})


def fetch(url: str) -> str:
    r = session.get(url, timeout=30)
    r.raise_for_status()
    if not r.encoding or r.encoding.lower() == 'iso-8859-1':
        r.encoding = r.apparent_encoding or 'utf-8'
    return r.text


def parse_docnames(searchindex_js: str):
    m = re.search(r'"docnames"\s*:\s*\[(.*?)\]\s*,\s*"envversion"', searchindex_js, re.S)
    if not m:
        raise RuntimeError('Could not find docnames array in searchindex.js')
    raw = '[' + m.group(1) + ']'
    return json.loads(raw)


def docname_to_url(docname: str) -> str:
    if docname == 'index':
        return urljoin(BASE, 'index.html')
    return urljoin(BASE, docname + '.html')


def safe_filename(docname: str) -> str:
    return docname.replace('/', '__') + '.md'


def clean_main(soup: BeautifulSoup):
    main = soup.select_one('article#furo-main-content') or soup.select_one('article[role="main"]') or soup.select_one('main') or soup.body or soup

    for selector in [
        'script', 'style', 'noscript',
        '.sidebar-drawer', '.toc-drawer', '.toc-tree', '.related-pages',
        '.prev-next-footer', '.footer', 'footer', 'nav',
        '.headerlink', '.reference.internal > .pre', '.back-to-top',
        '.content-icon-container', '.sig-prename'
    ]:
        for node in main.select(selector):
            node.decompose()

    for node in main.select('button'):
        node.decompose()

    return main


def normalize_markdown(text: str) -> str:
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' +\n', '\n', text)
    return text.strip() + '\n'


def render_page(url: str, docname: str):
    html = fetch(url)
    soup = BeautifulSoup(html, 'lxml')
    title_node = soup.select_one('main h1')
    title = title_node.get_text(' ', strip=True) if title_node else (soup.title.get_text(' ', strip=True) if soup.title else docname)

    main = clean_main(soup)
    markdown = md(str(main), heading_style='ATX', bullets='-', escape_asterisks=False, escape_underscores=False)
    markdown = normalize_markdown(markdown)
    content = f'Source: {url}\n\n{markdown}'
    return title, content


def main():
    os.makedirs(PAGES_DIR, exist_ok=True)

    searchindex_js = fetch(SEARCHINDEX)
    docnames = parse_docnames(searchindex_js)

    rows = []
    failures = []
    expected_files = set()

    for docname in docnames:
        url = docname_to_url(docname)
        filename = safe_filename(docname)
        path = os.path.join(PAGES_DIR, filename)
        expected_files.add(filename)
        try:
            title, content = render_page(url, docname)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            rows.append({
                'docname': docname,
                'title': title,
                'url': url,
                'filename': filename,
                'path': path,
            })
            print(f'OK  {docname} -> {filename}')
        except Exception as e:
            failures.append({'docname': docname, 'url': url, 'error': str(e)})
            print(f'ERR {docname}: {e}')

    # Remove stale files from previous runs.
    for filename in os.listdir(PAGES_DIR):
        if filename.endswith('.md') and filename not in expected_files:
            os.remove(os.path.join(PAGES_DIR, filename))

    rows_sorted = sorted(rows, key=lambda r: r['docname'])
    with open(MANIFEST, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['docname', 'title', 'url', 'filename', 'path'])
        writer.writeheader()
        writer.writerows(rows_sorted)

    actual_files = sorted(fn for fn in os.listdir(PAGES_DIR) if fn.endswith('.md'))
    expected_from_rows = {r['filename'] for r in rows_sorted}
    missing_files = sorted(expected_from_rows - set(actual_files))
    extra_files = sorted(set(actual_files) - expected_from_rows)

    summary = {
        'output_dir': OUTDIR,
        'pages_dir': PAGES_DIR,
        'manifest': MANIFEST,
        'searchindex_url': SEARCHINDEX,
        'docnames_count': len(docnames),
        'rendered_count': len(rows_sorted),
        'file_count': len(actual_files),
        'failure_count': len(failures),
        'failures': failures,
        'missing_files': missing_files,
        'extra_files': extra_files,
    }

    with open(SUMMARY, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)

    print('\nSUMMARY')
    print(json.dumps(summary, indent=2))

    if failures or missing_files or extra_files or len(rows_sorted) != len(docnames):
        raise SystemExit(1)


if __name__ == '__main__':
    main()
