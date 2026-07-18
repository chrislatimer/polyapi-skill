---
name: polyapi-platform
description: Use when a task depends on PolyAPI product behavior, SDK usage, Canopy apps, auth, variables, tables, jobs, webhooks, AI functions, schemas, snippets, or other PolyAPI workflows.
version: 1.2.0
license: MIT
---

# PolyAPI Platform Skill

## What ships with this skill

- **`references/ops__*.md`** — five field-notes pages that always travel with the skill: AI Functions, Python setup gotchas, server-function runtime, Tabi PATCH-is-REPLACE, and observability/reducer wrapper patterns. These cover behavior the official docs don't.

## What is only present with the full install

If the user cloned the repo or installed the docs pack via `npx github:chrislatimer/polyapi-skill`, they will also have:

- **`knowledge/pages/*.md`** — the full docs.polyapi.io export (~70 pages) as local Markdown, with per-page `Source:` URLs
- **`knowledge/SECTION_INDEX.md`** — section map
- **`knowledge/polyapi-docs-combined.md`** — single-file combined export

Check for `knowledge/SECTION_INDEX.md` first. If it exists, use it. If it doesn't, you have the lean install — the five ops pages plus the live web docs at [docs.polyapi.io](https://docs.polyapi.io) are your sources.

## Load-bearing gotchas (read first)

- **AI Functions** (`/functions/ai/*`) are a real first-class PolyAPI primitive **that is not on docs.polyapi.io**. See [references/ops__ai_functions.md](references/ops__ai_functions.md).
- **The Python SDK's `.config.env` is silently overridden by `POLY_API_KEY` env var.** Cause of most first-time 401s. See [references/ops__python_setup.md](references/ops__python_setup.md).
- **`PATCH /tables/{id}` `columns` is REPLACE, not APPEND.** A partial column list drops every column not in it. Always send the full list. See [references/ops__tabi_gotchas.md](references/ops__tabi_gotchas.md).
- **`python -m polyapi generate` silently skips `aiFunction` specs.** No `poly.<ctx>.<name>()` symbol exists — invoke AI functions via REST or through a server-function wrapper. See [references/ops__ai_functions.md](references/ops__ai_functions.md) and [references/ops__wrapper_patterns.md](references/ops__wrapper_patterns.md).

## When to use this skill

- **AI Functions** (`/functions/ai/*`) — creating, invoking, wrapping, observability, reducer patterns
- API Function Training
- Generated SDKs in Python, TypeScript, Java, or .NET
- Server functions, Client functions, and their runtime context (`polyCustom`, execution ids, calling Tabi from inside)
- Authentication, API keys, SSO, MFA, and permissions
- Canopy applications, architecture, CRUD, and implementation
- Vari Variables and Tabi Tables (pair Tabi with the gotchas page)
- Jobs, webhooks, GraphQL subscriptions, logging, schemas, and snippets
- Environments, Project Glide, versions

Do not use this skill when the task is unrelated to PolyAPI.

## Lookup workflow

1. **Is this an AI Function question, a first-time-setup question, a Tabi schema question, a server-function-runtime question, or a wrapper-pattern question?** → open the matching `references/ops__*.md` page. These win over anything else for behavior-in-practice.
2. **Otherwise, is `knowledge/SECTION_INDEX.md` available?** → yes, use it to locate the relevant scraped page. Prefer page-level reads over the combined export.
3. **If `knowledge/` isn't installed** → fetch from [docs.polyapi.io](https://docs.polyapi.io) directly, or ask the user to install the full docs pack via `npx github:chrislatimer/polyapi-skill`.
4. **Synthesize** across pages when the workflow spans several features. When a scraped page and an `ops__*.md` page disagree, `ops__*.md` wins — those were written by probing the live API and reading the SDK source.

## Section map (full install only — under `knowledge/pages/`)

- `api_functions__*.md` — API Function Training, OpenAPI, Postman
- `generated_sdks__*.md` — Python, TypeScript, Java, .NET, client functions
- `authentication__*.md` — keys, users, SSO, MFA, permissions
- `canopy__*.md` — architecture, app creation, CRUD, API implementation
- `vari_variables__*.md` — variables in code, UI, endpoint execution
- `tabi_tables__*.md` — table management, best practices, limitations, row operations (pair with `references/ops__tabi_gotchas.md`)
- `jobs__*.md` — job management and executions
- `webhooks__*.md` — webhooks, triggers, testing, security functions
- `graphql_subscriptions__*.md` — subscription setup and management
- `logging__*.md` — UI logs and logs API (server functions only — AI functions have no logs)
- `schemas__*.md` — schema creation and use
- `snippets__*.md` — snippet management and usage
- `environments__*.md` — environments and pushing
- `project_glide__*.md` — git integration and workflow docs
- `copilot__*.md` — GitHub Copilot extension docs
- root pages — `quickstart`, `platform_overview`, `versions`, `next_steps`

## Common pitfalls

1. Loading `knowledge/polyapi-docs-combined.md` first when a single page would do. Fix: start at the section index, then read only the matching page.
2. Treating PolyAPI behavior as generic iPaaS behavior. Fix: verify the concrete product workflow from the local docs before coding.
3. Forgetting the page-level `Source:` URL. Fix: keep the source URL with any summary, implementation note, or answer that depends on scraped docs.
4. Ignoring the `references/ops__*.md` pages because they aren't under `knowledge/`. Fix: check the ops pages BEFORE scraped pages whenever the topic is AI Functions, Python setup, server-function runtime, or Tabi schema changes.

## Verification checklist

- [ ] Relevant `references/ops__*.md` page checked when the topic touches AI Functions / Python setup / server-function runtime / Tabi schema
- [ ] Relevant scraped page identified (via `knowledge/SECTION_INDEX.md` when available)
- [ ] Implementation or explanation grounded in the pages consulted
- [ ] Ambiguities called out explicitly instead of guessed
- [ ] Combined export used only when page-level lookup was insufficient
