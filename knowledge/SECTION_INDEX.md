# PolyAPI section index

Total pages: 75 (70 scraped from docs.polyapi.io + 5 field-notes pages)

This file maps the PolyAPI docs into sections that are easy for coding agents to navigate. Scraped-from-website pages have `Source:` URLs; field-notes pages (`ops__*.md`) capture behavior the official docs don't cover yet — read those first when working with AI Functions, SDK setup, or any feature marked ALPHA.

## ops (field notes — start here for anything ALPHA or gotcha-prone)

- `ops/ai_functions` — [AI Functions primitive: endpoints, spec shape, missing observability](knowledge/pages/ops__ai_functions.md)
- `ops/python_setup` — [Python SDK real setup: env-var override, config file, common 401s](knowledge/pages/ops__python_setup.md)
- `ops/server_function_runtime` — [polyCustom, execution ids, calling other functions, calling Tabi from server functions](knowledge/pages/ops__server_function_runtime.md)
- `ops/tabi_gotchas` — [PATCH `/tables/{id}` columns is REPLACE not APPEND, plus other Tabi caveats](knowledge/pages/ops__tabi_gotchas.md)
- `ops/wrapper_patterns` — [Observability wrapper + smart (reducer) wrapper for AI functions](knowledge/pages/ops__wrapper_patterns.md)

## api_functions

- `api_functions/index` — [API Function Training - PolyAPI documentation](knowledge/pages/api_functions__index.md)
- `api_functions/openapi` — [Using OpenAPI Specs - PolyAPI documentation](knowledge/pages/api_functions__openapi.md)
- `api_functions/postman` — [Using Postman - PolyAPI documentation](knowledge/pages/api_functions__postman.md)

## authentication

- `authentication/api-key-permissions` — [API Key Permissions - PolyAPI documentation](knowledge/pages/authentication__api-key-permissions.md)
- `authentication/enable-mfa-tenant` — [Enable MFA for Your Tenant - PolyAPI documentation](knowledge/pages/authentication__enable-mfa-tenant.md)
- `authentication/index` — [Authentication - PolyAPI documentation](knowledge/pages/authentication__index.md)
- `authentication/managing-users-and-api-keys` — [Managing Users and API Keys - PolyAPI documentation](knowledge/pages/authentication__managing-users-and-api-keys.md)
- `authentication/setup-sso` — [Setting up Single Sign-On - PolyAPI documentation](knowledge/pages/authentication__setup-sso.md)
- `authentication/setup-user-mfa` — [Setting up MFA for your User Account - PolyAPI documentation](knowledge/pages/authentication__setup-user-mfa.md)

## canopy

- `canopy/architecture` — [Canopy Architecture and Configurations - PolyAPI documentation](knowledge/pages/canopy__architecture.md)
- `canopy/create_application` — [Create a Canopy UI Application - PolyAPI documentation](knowledge/pages/canopy__create_application.md)
- `canopy/implement_api` — [Enhancing Canopy Applications with APIs - PolyAPI documentation](knowledge/pages/canopy__implement_api.md)
- `canopy/implement_crud` — [Implementing CRUD Operations in Canopy Applications - PolyAPI documentation](knowledge/pages/canopy__implement_crud.md)
- `canopy/index` — [Canopy - PolyAPI documentation](knowledge/pages/canopy__index.md)
- `canopy/using_canopy` — [Using a Canopy Application - PolyAPI documentation](knowledge/pages/canopy__using_canopy.md)

## copilot

- `copilot/copilot-vscode-install` — [Installing the Copilot Extension - PolyAPI documentation](knowledge/pages/copilot__copilot-vscode-install.md)
- `copilot/copilot-vscode-usage` — [Using the Copilot Extension - PolyAPI documentation](knowledge/pages/copilot__copilot-vscode-usage.md)
- `copilot/index` — [GitHub Copilot Extension - PolyAPI documentation](knowledge/pages/copilot__index.md)

## environments

- `environments/index` — [Environments - PolyAPI documentation](knowledge/pages/environments__index.md)
- `environments/pushing` — [Pushing to Another Environment - PolyAPI documentation](knowledge/pages/environments__pushing.md)
- `environments/ui` — [Managing Environments - PolyAPI documentation](knowledge/pages/environments__ui.md)

## error_handlers

- `error_handlers/error-handler-module` — [errorHandler Module - PolyAPI documentation](knowledge/pages/error_handlers__error-handler-module.md)
- `error_handlers/error-handler-trigger` — [Error Handler Triggers - PolyAPI documentation](knowledge/pages/error_handlers__error-handler-trigger.md)
- `error_handlers/index` — [Error Handlers - PolyAPI documentation](knowledge/pages/error_handlers__index.md)

## generated_sdks

- `generated_sdks/client_functions` — [Client Functions - PolyAPI documentation](knowledge/pages/generated_sdks__client_functions.md)
- `generated_sdks/dotnet` — [.NET (Beta) - PolyAPI documentation](knowledge/pages/generated_sdks__dotnet.md)
- `generated_sdks/index` — [Generated SDKs - PolyAPI documentation](knowledge/pages/generated_sdks__index.md)
- `generated_sdks/java` — [Java - PolyAPI documentation](knowledge/pages/generated_sdks__java.md)
- `generated_sdks/python` — [Python - PolyAPI documentation](knowledge/pages/generated_sdks__python.md)
- `generated_sdks/typescript` — [TypeScript (Node) - PolyAPI documentation](knowledge/pages/generated_sdks__typescript.md)

## graphql_subscriptions

- `graphql_subscriptions/index` — [GraphQL Subscriptions - PolyAPI documentation](knowledge/pages/graphql_subscriptions__index.md)
- `graphql_subscriptions/managing-subscriptions` — [Managing GraphQL Subscriptions - PolyAPI documentation](knowledge/pages/graphql_subscriptions__managing-subscriptions.md)
- `graphql_subscriptions/ohip-subscriptions` — [OHIP GraphQL Subscriptions - PolyAPI documentation](knowledge/pages/graphql_subscriptions__ohip-subscriptions.md)

## (root)

- `index` — [PolyAPI documentation](knowledge/pages/index.md)
- `next_steps` — [Next Steps - PolyAPI documentation](knowledge/pages/next_steps.md)
- `platform_overview` — [Platform Overview - PolyAPI documentation](knowledge/pages/platform_overview.md)
- `quickstart` — [Quickstart - PolyAPI documentation](knowledge/pages/quickstart.md)
- `versions` — [Versions - PolyAPI documentation](knowledge/pages/versions.md)

## jobs

- `jobs/executions` — [Checking Job Executions - PolyAPI documentation](knowledge/pages/jobs__executions.md)
- `jobs/index` — [Jobs - PolyAPI documentation](knowledge/pages/jobs__index.md)
- `jobs/managing` — [Managing Jobs - PolyAPI documentation](knowledge/pages/jobs__managing.md)

## logging

- `logging/index` — [Logging - PolyAPI documentation](knowledge/pages/logging__index.md)
- `logging/logs_api` — [Logs API - PolyAPI documentation](knowledge/pages/logging__logs_api.md)
- `logging/logs_canopy` — [Logs in Canopy UI - PolyAPI documentation](knowledge/pages/logging__logs_canopy.md)

## project_glide

- `project_glide/disable-ai` — [Using Glide without AI - PolyAPI documentation](knowledge/pages/project_glide__disable-ai.md)
- `project_glide/git-integration` — [Setup Glide Workflow - PolyAPI documentation](knowledge/pages/project_glide__git-integration.md)
- `project_glide/gitlab-workflow` — [Gitlab Workflow - PolyAPI documentation](knowledge/pages/project_glide__gitlab-workflow.md)
- `project_glide/index` — [Project Glide - PolyAPI documentation](knowledge/pages/project_glide__index.md)
- `project_glide/manual-prepare-and-sync` — [Manually Preparing and Syncing - PolyAPI documentation](knowledge/pages/project_glide__manual-prepare-and-sync.md)
- `project_glide/resources` — [Supported Resources - PolyAPI documentation](knowledge/pages/project_glide__resources.md)

## schemas

- `schemas/create_schemas` — [Creating Schemas - PolyAPI documentation](knowledge/pages/schemas__create_schemas.md)
- `schemas/index` — [Schemas - PolyAPI documentation](knowledge/pages/schemas__index.md)
- `schemas/use_schemas` — [Using Schemas - PolyAPI documentation](knowledge/pages/schemas__use_schemas.md)

## snippets

- `snippets/index` — [Snippets - PolyAPI documentation](knowledge/pages/snippets__index.md)
- `snippets/managing-snippets` — [Managing Snippets - PolyAPI documentation](knowledge/pages/snippets__managing-snippets.md)
- `snippets/using-snippets` — [Using Snippets - PolyAPI documentation](knowledge/pages/snippets__using-snippets.md)

## tabi_tables

- `tabi_tables/best_practices` — [Tabi Best Practices - PolyAPI documentation](knowledge/pages/tabi_tables__best_practices.md)
- `tabi_tables/index` — [Tabi Tables - PolyAPI documentation](knowledge/pages/tabi_tables__index.md)
- `tabi_tables/limitations` — [Tabi Limitations - PolyAPI documentation](knowledge/pages/tabi_tables__limitations.md)
- `tabi_tables/row_operations` — [Tabi Row Operations - PolyAPI documentation](knowledge/pages/tabi_tables__row_operations.md)
- `tabi_tables/table_management` — [Manage Tabi Tables - PolyAPI documentation](knowledge/pages/tabi_tables__table_management.md)

## vari_variables

- `vari_variables/code` — [Vari in Your Code - PolyAPI documentation](knowledge/pages/vari_variables__code.md)
- `vari_variables/execute_endpoints` — [Using Variables with Execute Endpoints - PolyAPI documentation](knowledge/pages/vari_variables__execute_endpoints.md)
- `vari_variables/index` — [Vari Variables - PolyAPI documentation](knowledge/pages/vari_variables__index.md)
- `vari_variables/ui` — [Vari Management UI - PolyAPI documentation](knowledge/pages/vari_variables__ui.md)

## webhooks

- `webhooks/index` — [Webhooks - PolyAPI documentation](knowledge/pages/webhooks__index.md)
- `webhooks/managing-triggers` — [Managing Triggers - PolyAPI documentation](knowledge/pages/webhooks__managing-triggers.md)
- `webhooks/managing-webhooks` — [Managing Webhooks - PolyAPI documentation](knowledge/pages/webhooks__managing-webhooks.md)
- `webhooks/testing` — [Testing Webhooks - PolyAPI documentation](knowledge/pages/webhooks__testing.md)
- `webhooks/webhook-security-functions` — [Webhook Security Functions - PolyAPI documentation](knowledge/pages/webhooks__webhook-security-functions.md)
