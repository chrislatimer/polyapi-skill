# PolyAPI documentation agent instructions

This repository packages the PolyAPI documentation as local Markdown for coding agents.

## Required lookup workflow

For any task involving PolyAPI:

1. Open `knowledge/SECTION_INDEX.md` first.
2. Identify the exact subsection relevant to the request.
3. Read the corresponding files in `knowledge/pages/`.
4. Only use `knowledge/polyapi-docs-combined.md` when you need broad synthesis or full-document review.
5. Base implementation details on the local docs, not on assumptions.

## Implementation rules

- Keep PolyAPI terminology consistent with the docs.
- Use the page-level `Source:` URL when summarizing or justifying behavior.
- If the docs are ambiguous, say so explicitly and point to the relevant pages.
- Prefer minimal targeted reads over loading the entire combined export.

## Section guide

- `knowledge/pages/api_functions__*.md`
- `knowledge/pages/generated_sdks__*.md`
- `knowledge/pages/authentication__*.md`
- `knowledge/pages/canopy__*.md`
- `knowledge/pages/vari_variables__*.md`
- `knowledge/pages/tabi_tables__*.md`
- `knowledge/pages/webhooks__*.md`
- `knowledge/pages/graphql_subscriptions__*.md`
- `knowledge/pages/jobs__*.md`
- `knowledge/pages/logging__*.md`
- `knowledge/pages/schemas__*.md`
- `knowledge/pages/snippets__*.md`
- `knowledge/pages/project_glide__*.md`
- `knowledge/pages/copilot__*.md`

## Good prompt patterns

- `Use the local PolyAPI docs in this repo to implement ...`
- `Read the relevant PolyAPI pages and summarize the documented workflow for ...`
- `Check the local docs before changing this PolyAPI integration.`
