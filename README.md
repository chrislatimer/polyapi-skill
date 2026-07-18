# polyapi-docs-skill

A git-ready, agent-friendly repository that packages the PolyAPI documentation as local Markdown knowledge plus reusable instructions for Claude Code and Codex.

## What is in this repo

- `knowledge/pages/` — one Markdown file per PolyAPI documentation page
- `knowledge/manifest.csv` — page manifest with source URLs and local paths
- `knowledge/SECTION_INDEX.md` — section-by-section map for quick navigation
- `knowledge/polyapi-docs-combined.md` — full combined export
- `.claude/skills/polyapi-platform.md` — Claude Code skill file
- `CLAUDE.md` — project instructions automatically loaded by Claude Code
- `AGENTS.md` — project instructions for Codex and other coding agents
- `skills/polyapi-platform/SKILL.md` — shareable generic skill document
- `scripts/scrape_polyapi_docs.py` — scraper used to build the knowledge base

## Purpose

This repo turns the PolyAPI docs into a local knowledge pack that coding agents can consult while building integrations, Canopy apps, webhook handlers, generated SDK usage, authentication flows, and other PolyAPI-related work.

## Recommended agent workflow

1. Read `knowledge/SECTION_INDEX.md` to find the right section.
2. Read only the specific page files needed for the task.
3. Use `knowledge/polyapi-docs-combined.md` only for broad synthesis or full-text search.
4. Cite the source URL from the page file header when explaining behavior.

## Using with Claude Code

Claude Code auto-loads `CLAUDE.md` from the repo root. The repo also includes `.claude/skills/polyapi-platform.md` for task-specific guidance.

If you want to install this knowledge pack into another Claude Code project, run this inside that target project after you push this repo to GitHub:

```bash
npx github:YOUR_GITHUB_USER/polyapi-docs-skill
```

That vendors the PolyAPI docs into:

- `.claude/polyapi-docs-skill/knowledge/`
- `.claude/polyapi-docs-skill/AGENTS.md`
- `.claude/skills/polyapi-platform.md`

If you need to overwrite an existing install:

```bash
npx github:YOUR_GITHUB_USER/polyapi-docs-skill --force
```

Typical prompts:

- `Use the PolyAPI docs in this repo to build a webhook handler.`
- `Read the relevant PolyAPI pages and implement authentication for this SDK client.`
- `Use the PolyAPI skill and tell me which docs cover Canopy CRUD.`

## Using with Codex

Codex and similar coding agents can use `AGENTS.md` as the repo-level instruction file.

Typical prompts:

- `Use AGENTS.md and the local PolyAPI docs to scaffold a Canopy app.`
- `Find the relevant PolyAPI docs in knowledge/pages and implement variable injection.`

## Refreshing the docs

Re-run:

```bash
python3 scripts/scrape_polyapi_docs.py
```

Then review changes and commit them.

## Push to GitHub

This repo is safe to initialize and push after review:

```bash
git init
git add .
git commit -m "Initial PolyAPI docs skill repo"
```

If you want a GitHub remote:

```bash
gh repo create polyapi-docs-skill --source=. --private --push
```

Change `--private` to `--public` if desired.

Once pushed, the installer command for other Claude Code projects is:

```bash
npx github:YOUR_GITHUB_USER/polyapi-docs-skill
```
