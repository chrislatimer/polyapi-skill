---
name: polyapi-platform
description: Use when a task depends on PolyAPI product behavior, SDK usage, Canopy apps, auth, variables, tables, jobs, webhooks, schemas, snippets, or other documented PolyAPI workflows.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [polyapi, documentation, sdk, canopy, webhooks, auth]
    related_skills: []
---

# PolyAPI Platform Skill

## Overview

This repository packages the PolyAPI documentation as local Markdown so coding agents can answer product questions and implement features without relying on fuzzy recollection.

The core operating rule is simple: before writing code or explaining behavior, find the relevant page in the local knowledge pack and ground the answer in it.

## When to Use

Use this skill when the task involves:

- PolyAPI API Function Training
- Generated SDKs in Python, TypeScript, Java, or .NET
- Authentication, API keys, SSO, MFA, and permissions
- Canopy applications, architecture, CRUD, and implementation
- Vari Variables and Tabi Tables
- Jobs, webhooks, GraphQL subscriptions, logging, schemas, and snippets
- Environments, Project Glide, versions, or next-step guidance

Do not use this skill when the task is unrelated to PolyAPI.

## Repository Layout

- `knowledge/SECTION_INDEX.md` — fastest section-level entry point
- `knowledge/pages/*.md` — page-level Markdown exports with `Source:` URLs
- `knowledge/polyapi-docs-combined.md` — full combined export for broad synthesis
- `knowledge/manifest.csv` — source-to-file mapping
- `scripts/scrape_polyapi_docs.py` — rebuilds the exported docs set
- `CLAUDE.md` — project instructions for Claude Code
- `AGENTS.md` — project instructions for Codex and similar agents

## Lookup Workflow

1. Start with `knowledge/SECTION_INDEX.md`.
   Completion criterion: you have identified the smallest relevant documentation subsection.
2. Read only the necessary page files in `knowledge/pages/`.
   Completion criterion: you can point to the exact pages that support the implementation or answer.
3. If the task spans several features, synthesize across the relevant pages.
   Completion criterion: each major claim maps back to at least one source page.
4. Use `knowledge/polyapi-docs-combined.md` only when you need broad review or cross-section search.
   Completion criterion: you have a clear reason not to stay at page level.

## Section Map

- `api_functions__*.md` — API Function Training, OpenAPI, Postman
- `generated_sdks__*.md` — client functions and language SDK docs
- `authentication__*.md` — keys, users, SSO, MFA, permissions
- `canopy__*.md` — architecture, app creation, CRUD, API implementation
- `vari_variables__*.md` — variables in code, UI, endpoint execution
- `tabi_tables__*.md` — table management, best practices, limitations, row operations
- `jobs__*.md` — job management and executions
- `webhooks__*.md` — webhooks, triggers, testing, security functions
- `graphql_subscriptions__*.md` — subscription setup and management
- `logging__*.md` — UI logs and logs API
- `schemas__*.md` — schema creation and use
- `snippets__*.md` — snippet management and usage
- `environments__*.md` — environments and pushing
- `project_glide__*.md` — git integration and workflow docs
- `copilot__*.md` — GitHub Copilot extension docs
- root pages — quickstart, platform overview, versions, next steps

## Common Pitfalls

1. Loading the combined export first.
   Fix: start at `knowledge/SECTION_INDEX.md`, then read only the matching page files.
2. Treating PolyAPI behavior as generic iPaaS behavior.
   Fix: verify the concrete product workflow from the local docs before coding.
3. Forgetting the page-level `Source:` URL.
   Fix: keep the source URL with any summary, implementation note, or answer that depends on documentation.
4. Mixing several features without verifying each one.
   Fix: read one page per feature area and then synthesize.

## Verification Checklist

- [ ] Relevant section identified in `knowledge/SECTION_INDEX.md`
- [ ] Supporting pages read from `knowledge/pages/`
- [ ] Implementation or explanation grounded in documented behavior
- [ ] Ambiguities called out explicitly instead of guessed
- [ ] Combined export used only when page-level lookup was insufficient
