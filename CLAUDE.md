# PolyAPI project context

This repository is a local knowledge pack for the PolyAPI documentation.

When a task involves PolyAPI, always do the following before answering or coding:

1. Read `knowledge/SECTION_INDEX.md` to locate the relevant section.
2. Read the smallest set of page files from `knowledge/pages/` needed for the task.
3. Prefer the per-page files over `knowledge/polyapi-docs-combined.md` unless you need broad synthesis.
4. Preserve the documented PolyAPI terminology from the source pages.
5. Quote or reference the `Source:` URL at the top of each page file when useful.

## Important sections

- **`ops__*.md`** — field notes (AI Functions, Python setup gotchas, server-function runtime, Tabi caveats, wrapper patterns). Read first when the topic is ALPHA or the official docs are known-incomplete.
- `api_functions/` — API Function Training, OpenAPI, Postman
- `generated_sdks/` — Python, TypeScript, Java, .NET, client functions
- `authentication/` — users, API keys, permissions, SSO, MFA
- `canopy/` — architecture, applications, CRUD, API implementation
- `vari_variables/` — variables in code, UI, execute endpoints
- `tabi_tables/` — table management, row operations, limitations (also see `ops__tabi_gotchas.md`)
- `webhooks/` — setup, triggers, testing, security functions
- `graphql_subscriptions/` — subscriptions and management
- `jobs/` — executions and managing jobs
- `logging/` — logs access and APIs (server functions only — AI functions have no logs; see `ops__ai_functions.md`)
- `schemas/` — creating and using schemas
- `snippets/` — creating and using snippets
- `project_glide/` — git integration and workflows
- `copilot/` — GitHub Copilot extension docs

## Load-bearing gotchas

- **AI Functions are not covered on docs.polyapi.io but ARE a real PolyAPI primitive.** See `knowledge/pages/ops__ai_functions.md`.
- **`POLY_API_KEY` in the shell environment overrides `.config.env`.** First-time 401s are almost always this. See `knowledge/pages/ops__python_setup.md`.
- **`PATCH /tables/{id}` `columns` is REPLACE, not APPEND.** Always GET first, PATCH the full list. See `knowledge/pages/ops__tabi_gotchas.md`.
- **`python -m polyapi generate` silently skips `aiFunction` specs.** No `poly.<ctx>.<ai_function_name>()` symbol exists; use REST or wrap in a server function.

## Expected behavior

- Do not invent PolyAPI endpoints, UI features, or SDK behavior.
- If the answer depends on product behavior, verify it from the local docs first.
- If several docs are relevant, synthesize them into one implementation plan.
- When generating code, align names and workflow with the docs in this repo.
- If a scraped page and an `ops__*.md` page disagree, `ops__*.md` wins for behavior-in-practice — the field notes were made by running the SDK against the live API.
