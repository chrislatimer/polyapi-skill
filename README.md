# polyapi-docs-skill

A drop-in Claude Code skill for PolyAPI. Ships the official docs.polyapi.io export as local Markdown **plus** five field-notes pages covering behavior the official docs don't: AI Functions, Python SDK setup gotchas, server-function runtime internals, Tabi's PATCH-is-REPLACE trap, and the observability + reducer wrapper patterns for AI Functions.

> Replace `YOUR_GITHUB_USER` in the install commands below with the GitHub owner this repo is published under.

---

## Install

Three install paths depending on how much you want.

### 1. Skill + field notes only (lightest, `npx skills add`)

```bash
npx skills add YOUR_GITHUB_USER/polyapi-docs-skill --skill polyapi-platform --agent claude-code
```

Installs `.claude/skills/polyapi-platform/{SKILL.md,references/}` — the skill's entry point and the five field-notes pages. About 60 KB total. Best when you already have the docs.polyapi.io tab open and just want the operational knowledge on hand.

Global install (all your projects, `~/.claude`):

```bash
npx skills add YOUR_GITHUB_USER/polyapi-docs-skill --skill polyapi-platform --agent claude-code -g
```

### 2. Skill + full local docs pack (`npx github:...`)

```bash
npx github:YOUR_GITHUB_USER/polyapi-docs-skill
```

Runs the installer script in the current directory. Vendors:

```
.claude/polyapi-docs-skill/knowledge/           # 70 scraped docs.polyapi.io pages + SECTION_INDEX + combined export
.claude/polyapi-docs-skill/AGENTS.md            # Codex/Cursor-style agent guidance
.claude/skills/polyapi-platform/SKILL.md        # skill entry point (auto-discovered by Claude Code)
.claude/skills/polyapi-platform/references/     # the five field-notes pages
```

Best for offline work or when you want Claude to grep across the full docs without hitting the network.

Flags:

```bash
npx github:YOUR_GITHUB_USER/polyapi-docs-skill --target /path/to/project
npx github:YOUR_GITHUB_USER/polyapi-docs-skill --force            # overwrite existing install
```

### 3. Clone the repo (contributor / plugin path)

```bash
git clone https://github.com/YOUR_GITHUB_USER/polyapi-docs-skill.git
```

The repo doubles as a Claude Code plugin — it has `.claude-plugin/plugin.json` and `skills/polyapi-platform/SKILL.md` at the expected paths. Open it in Claude Code and the skill auto-registers; or reference it via a plugin marketplace once published.

---

## What's inside

### Field notes (always present with any install)

Under `skills/polyapi-platform/references/` (in the repo) or `.claude/skills/polyapi-platform/references/` (after install):

| File | Covers |
|---|---|
| `ops__ai_functions.md` | The undocumented `aiFunction` primitive: endpoints, full spec shape, missing observability, `/functions/ai/*` vs the legacy `/ai-functions/*` |
| `ops__python_setup.md` | Real setup path including the `POLY_API_KEY` env-var override that causes most first-time 401s |
| `ops__server_function_runtime.md` | `polyCustom`, execution ids, calling Tabi from a server function, HTTP fallback for endpoints the SDK skips |
| `ops__tabi_gotchas.md` | `PATCH /tables/{id}` `columns` is REPLACE not APPEND, plus recovery steps and other Tabi caveats |
| `ops__wrapper_patterns.md` | Observability wrapper (log AI I/O to Tabi) and smart/reducer wrapper (code path first, AI fallback) idioms |

### Full docs pack (install path 2 or 3 only)

Under `knowledge/` (in the repo) or `.claude/polyapi-docs-skill/knowledge/` (after installer):

- `pages/*.md` — one Markdown file per page on docs.polyapi.io, with a `Source:` URL header on each
- `SECTION_INDEX.md` — section map that Claude reads first to locate the right page
- `polyapi-docs-combined.md` — everything in one file, for grep-heavy synthesis
- `manifest.csv` — source URL → local file mapping

---

## Verify the skill loaded

After install path 1 or 2, open Claude Code in the target project and type `/skills` — you should see `polyapi-platform` listed. If not, check that `.claude/skills/polyapi-platform/SKILL.md` exists and starts with YAML frontmatter (`---\nname: polyapi-platform\n...`).

Sample prompts:

- `Use the PolyAPI platform skill to explain how AI Functions are invoked.`
- `Check the local docs before writing this Tabi table.`
- `Deploy this server function and wrap it with the observability pattern from the ops notes.`

---

## Refreshing the docs

The scraper builds the `knowledge/` pack from docs.polyapi.io:

```bash
python3 scripts/scrape_polyapi_docs.py
```

Then rebuild the section index:

```bash
python3 scripts/build_section_index.py
```

Review the diff and commit. The `ops__*.md` field notes live under `skills/polyapi-platform/references/` (symlinked from `knowledge/pages/`) and are hand-maintained — the scraper leaves them alone.

---

## Publishing this repo

```bash
git init
git add .
git commit -m "Initial PolyAPI docs skill repo"
gh repo create polyapi-docs-skill --source=. --public --push
```

Once pushed, the install commands above will work — replace `YOUR_GITHUB_USER` in the README, plugin.json, and package.json with your actual GitHub handle.

---

## License

MIT — see [LICENSE](LICENSE).
