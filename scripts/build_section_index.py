import csv
import os
import collections

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(REPO, 'knowledge', 'manifest.csv')
OUT = os.path.join(REPO, 'knowledge', 'SECTION_INDEX.md')

rows = []
with open(MANIFEST, newline='', encoding='utf-8') as f:
    rows = list(csv.DictReader(f))

sections = collections.OrderedDict()
for row in sorted(rows, key=lambda r: r['docname']):
    section = row['docname'].split('/')[0] if '/' in row['docname'] else '(root)'
    sections.setdefault(section, []).append(row)

parts = [
    '# PolyAPI section index\n',
    '\n',
    f'Total pages: {len(rows)}\n',
    '\n',
    'This file maps the scraped PolyAPI docs into sections that are easy for coding agents to navigate.\n',
]

for section, items in sections.items():
    parts.append(f'\n## {section}\n\n')
    for row in items:
        rel = 'knowledge/pages/' + row['filename']
        parts.append(f'- `{row["docname"]}` — [{row["title"]}]({rel})\n')

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(''.join(parts))

print(OUT)
