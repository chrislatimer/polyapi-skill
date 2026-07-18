# polyapi-docs-skill

A Claude Code skill that teaches Claude how to work with [PolyAPI](https://polyapi.io). Ships the full docs.polyapi.io reference as local Markdown, plus five hand-written pages that cover gotchas the official docs don't (most importantly: **AI Functions**, which aren't documented publicly, and the Python SDK setup mode that causes most first-time 401 errors).

Once installed, Claude will consult it automatically whenever your task touches PolyAPI.

## Install

```bash
npx skills add chrislatimer/polyapi-docs-skill --skill polyapi-platform --agent claude-code
```

Add `-g` to install globally (available in every project) instead of just the current one.

## Verify

Open Claude Code in the project and type `/skills`. You should see `polyapi-platform` in the list. Try:

> Use the polyapi-platform skill to show me how to invoke an AI Function.

## Alternate installs

**Full install** — also vendors the entire docs.polyapi.io site (~70 pages) locally so Claude can grep it offline:

```bash
npx github:chrislatimer/polyapi-docs-skill
```

Flags: `--target <dir>` to install into a different project, `--force` to overwrite an existing install.

**Plugin / contributing** — clone the repo. It has `.claude-plugin/plugin.json` and `skills/polyapi-platform/SKILL.md` at the expected paths, so Claude Code auto-discovers the skill when the repo is open as a project.

```bash
git clone https://github.com/chrislatimer/polyapi-docs-skill.git
```

## License

MIT — see [LICENSE](LICENSE).
