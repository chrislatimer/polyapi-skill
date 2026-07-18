Source: https://docs.polyapi.io/platform_overview.html

> **Docs gap.** The Functions bullet below omits **AI Functions** (`/functions/ai/*`), a first-class PolyAPI resource type currently in `ALPHA`. See [ops__ai_functions.md](ops__ai_functions.md) for the full primitive, endpoints, and spec shape until the official overview catches up.

# Platform Overview

**The PolyAPI Platform consists of:**

- A cloud-agnostic managed serverless platform built on Knative providing full observability into your integrations and services.
- A central gateway for receiving external cloud events, webhooks, and executing third party APIs and functions.
- A unified catalogue of vendor and internal APIs, functions, and webhooks, accessible via a generated SDK or our RESTful API.
- A helpful AI assistant embedded in your IDE to help you explore your catalogue and write integrations.
- A web portal to see and manage all your resources, and to host your own custom CRUD applications with auto-generated UI.

There are currently 2 separate, managed instances of our serverless platform that you can sign up for:

- `NA1` hosted on AWS us-west-2 <https://na1.polyapi.io/canopy/polyui/signup>
- `EU1` hosted on AWS eu-west-1 <https://eu1.polyapi.io/canopy/polyui/signup>

PolyAPI can also be self-hosted, allowing you to deploy it anywhere Kubernetes is supported.

## PolyAPI Resources

Poly makes it easy to create, host, and manage all the resources needed for any cloud service:

- **Functions**

  - **Server Functions** - Knative, serverless functions run in our cloud
  - **Client Functions** - Shared functions run wherever executed
  - [API Functions](api_functions/index.html) - API calls to third-party services invoked via our gateway
- [Variables](vari_variables/index.html) - Variables and secrets which are stored securely and can be injected into your functions at runtime
- [Webhooks](webhooks/index.html) - Public facing webhooks to accept external events
- [GraphQL Subscriptions](graphql_subscriptions/index.html) - Long-lived provider event streams that invoke Poly server functions when new events arrive
- **Triggers** - Setup cloud events to trigger functions
- [Jobs](jobs/index.html) - Execute functions at a set time, interval, or CRON schedule
- **Cloud Events** - The back-bone of every scalable, serverless workflow
- [Schemas](schemas/index.html) - Shared JSONSchema definitions to type your events and application data
- **Snippets** - Shared snippets to encourage best practices and eliminate boilerplate
- **Permission Policies** - Configurable policies that govern what resources and permissions your users have in one or more environments
- **Identity Providers** - Used to enable single sign-on authentication in your applications.

All PolyAPI resources you create will be catalogued, documented, and made available to your team in a custom SDK generated in any supported language.

## Tenants, Environments & Visibility

Within a Poly Instance there can be many Tenants. Tenants typically have 1-to-1 relations with a company that uses Poly (except in the case of self-hosting), and billing for services on PolyAPI are billed on a per-tenant basis.

Each Tenant may create one or more Environments which can be used to contain and isolate sets of PolyAPI resources in whatever manner desired–representing different services, or different teams, or even different development environments.

Most resources in PolyAPI have a `visibility` property which controls if the resource should be visible at the `ENVIRONMENT` level, or `TENANT` level, or `PUBLIC` level.
Depending on the visibility set the resource will be made available for discovery and use to all API Keys of the same environment, of the same tenant, or even of the same PolyAPI instance respectively.
Though a resource may be visible on a Tenant or Public level, it will still only be modifiable by API keys with the necessary permissions in the same environment.

Note

Anything created with a PUBLIC visibility is easily discoverable by ANY user from any other Tenant in the PolyAPI Instance, so should be considered truly public to anyone who’s curious.

Learn more about environments here:
[Environments](environments/index.html)

## Users, API Keys & Permissions

Each Tenant may contain any number of Users which sit outside of Environments.

Creating a User does not immediately give them access to the resources in their Tenant. You will need to give a user an API Key in order for them to access to Poly.

API Keys are bound to a specific Environment, and has a set of granular permissions which can be used to control access to resources within the API Keys’ environment.

Learn more about authentication here:
[Authentication](authentication/index.html)
