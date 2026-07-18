# Maintaining polyapi-docs-skill

Notes for whoever is updating this repo. Not needed if you're just installing the skill.

## Repo layout

```
.
├── .claude-plugin/plugin.json        # Claude Code plugin manifest (auto-discovery)
├── package.json                      # npm metadata + bin for `npx github:` installer
├── scripts/
│   ├── install.js                    # runs on `npx github:chrislatimer/polyapi-docs-skill`
│   ├── scrape_polyapi_docs.py        # rebuilds knowledge/pages/*.md from docs.polyapi.io
│   └── build_section_index.py        # rebuilds knowledge/SECTION_INDEX.md
├── knowledge/
│   ├── SECTION_INDEX.md              # navigation index (generated)
│   ├── polyapi-docs-combined.md      # single-file export (generated)
│   ├── manifest.csv                  # source URL → local path (generated)
│   ├── summary.json                  # scraper metadata (generated)
│   └── pages/
│       ├── *.md                      # 70 scraped docs.polyapi.io pages (generated)
│       └── ops__*.md                 # 5 symlinks → skills/polyapi-platform/references/
└── skills/polyapi-platform/
    ├── SKILL.md                      # skill entry point with YAML frontmatter
    └── references/
        └── ops__*.md                 # 5 hand-written field-notes pages (SOURCE OF TRUTH)
```

## Why ops__*.md is symlinked

The field notes live physically at `skills/polyapi-platform/references/` so they travel with the skill on `npx skills add` (which copies the skill's subdir). The symlinks at `knowledge/pages/ops__*.md` make them visible to callers that browse the full docs pack (e.g. from `SECTION_INDEX.md`).

Edit the files at the source (`skills/polyapi-platform/references/`) — never the symlinks.

## Refreshing the scraped docs

When docs.polyapi.io changes:

```bash
python3 scripts/scrape_polyapi_docs.py
python3 scripts/build_section_index.py
git diff knowledge/                   # review
git add knowledge/
git commit -m "Refresh scraped docs from docs.polyapi.io"
```

The scraper walks `docs.polyapi.io/searchindex.js` and writes one Markdown file per page under `knowledge/pages/`. It won't touch the `ops__*.md` symlinks (they're outside the docnames list).

Heads up: the scraper's `OUTDIR` in `scripts/scrape_polyapi_docs.py` is currently hardcoded to `/Users/christopher/polyapi-docs-markdown` — a legacy staging path. Either change it to `knowledge/` or copy the results in manually after each run.

## Editing the field notes

Edit `skills/polyapi-platform/references/ops__*.md` directly. The five files are:

- `ops__ai_functions.md` — the undocumented AI Function primitive
- `ops__python_setup.md` — Python SDK setup gotchas (env var override, config file location)
- `ops__server_function_runtime.md` — `polyCustom`, execution ids, calling Tabi from server functions
- `ops__tabi_gotchas.md` — PATCH-is-REPLACE and other Tabi caveats
- `ops__wrapper_patterns.md` — observability + reducer wrapper idioms

Rules that keep them useful:

1. **Cross-refs between ops pages** use bare filenames (`[foo](ops__foo.md)`) — they work from both physical locations.
2. **Cross-refs to scraped pages** use `docs.polyapi.io` URLs, not relative paths — so they resolve even in the lean install where the scraped pack isn't present.
3. **Every claim must come from something you observed** — a live API probe, an SDK source read, or a reproducible test. Not from reasoning about "how it should work."
4. **When behavior changes**, note the observation date in the file so future you knows how stale the claim is.

## Testing the installers

**Lean install** (`npx skills add`):

```bash
TMP=$(mktemp -d) && cd "$TMP" && \
  npx --yes skills add /Users/christopher/polyapi-docs-skill \
    --yes --skill polyapi-platform --agent claude-code && \
  find .claude
```

Expect `.claude/skills/polyapi-platform/{SKILL.md,references/ops__*.md}`.

**Full install** (`node scripts/install.js`):

```bash
TMP=$(mktemp -d) && \
  node scripts/install.js --target "$TMP" && \
  find "$TMP/.claude" -maxdepth 4
```

Expect both `.claude/polyapi-docs-skill/knowledge/…` (with symlinks resolved to real files) and `.claude/skills/polyapi-platform/…`.

## Bumping the version

Three places to keep in sync:

- `package.json` → `version`
- `.claude-plugin/plugin.json` → `version`
- `skills/polyapi-platform/SKILL.md` → frontmatter `version`

Then:

```bash
git commit -am "v1.2.1 — <what changed>"
git tag v1.2.1
git push --tags
```

## Publishing / republishing

The first time:

```bash
git init                                          # if not already a repo
git add .
git commit -m "Initial PolyAPI docs skill repo"
gh repo create polyapi-docs-skill --source=. --public --push
```

After that, every commit to `main` is what `npx skills add chrislatimer/polyapi-docs-skill` and `npx github:chrislatimer/polyapi-docs-skill` resolve to — no separate release step needed.

## What NOT to change without care

- **`.gitignore`** — the `myenv/`, `.venv/`, and `venv/` entries protect against accidentally committing a PolyAPI `.config.env` file (which contains an unwrapped API key). Do not remove.
- **`skills/polyapi-platform/SKILL.md` frontmatter** — the `name` field is what `npx skills add --skill <name>` matches on. Renaming it breaks the install command in the README.
- **The symlink direction under `knowledge/pages/`** — `knowledge/pages/ops__*.md` → `../../skills/polyapi-platform/references/ops__*.md`. Flipping this breaks lean installs because `skills add` would then copy a symlink pointing outside the skill subtree.
