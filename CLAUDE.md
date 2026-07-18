# PolyAPI project context

This repository is a local knowledge pack for the PolyAPI documentation.

When a task involves PolyAPI, always do the following before answering or coding:

1. Read `knowledge/SECTION_INDEX.md` to locate the relevant section.
2. Read the smallest set of page files from `knowledge/pages/` needed for the task.
3. Prefer the per-page files over `knowledge/polyapi-docs-combined.md` unless you need broad synthesis.
4. Preserve the documented PolyAPI terminology from the source pages.
5. Quote or reference the `Source:` URL at the top of each page file when useful.

## Important sections

- `api_functions/` — API Function Training, OpenAPI, Postman
- `generated_sdks/` — Python, TypeScript, Java, .NET, client functions
- `authentication/` — users, API keys, permissions, SSO, MFA
- `canopy/` — architecture, applications, CRUD, API implementation
- `vari_variables/` — variables in code, UI, execute endpoints
- `tabi_tables/` — table management, row operations, limitations
- `webhooks/` — setup, triggers, testing, security functions
- `graphql_subscriptions/` — subscriptions and management
- `jobs/` — executions and managing jobs
- `logging/` — logs access and APIs
- `schemas/` — creating and using schemas
- `snippets/` — creating and using snippets
- `project_glide/` — git integration and workflows
- `copilot/` — GitHub Copilot extension docs

## Expected behavior

- Do not invent PolyAPI endpoints, UI features, or SDK behavior.
- If the answer depends on product behavior, verify it from the local docs first.
- If several docs are relevant, synthesize them into one implementation plan.
- When generating code, align names and workflow with the docs in this repo.
