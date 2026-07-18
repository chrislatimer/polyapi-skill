Source: https://docs.polyapi.io/graphql_subscriptions/index.html

# GraphQL Subscriptions

GraphQL subscriptions let Poly keep a long-lived connection open to an upstream provider and invoke one of your Poly server functions whenever the provider pushes a new event.

Use GraphQL subscriptions when a provider exposes an event stream over GraphQL and you want Poly to manage the connection lifecycle, authentication handoff, and delivery into your own processing function.

PolyAPI currently exposes two GraphQL subscription types:

- `CUSTOM` for general provider-managed GraphQL streams.
- `OHIP` for Oracle Hospitality Integration Platform streams, which have additional replay, offset, and keep-alive rules.

Start with the general guide if you are creating or managing subscriptions for the first time. Use the OHIP guide when you need Oracle-specific subscription behavior.

- [Managing GraphQL Subscriptions](managing-subscriptions.html)
- [OHIP GraphQL Subscriptions](ohip-subscriptions.html)
