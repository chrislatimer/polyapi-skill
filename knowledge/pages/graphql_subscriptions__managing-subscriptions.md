Source: https://docs.polyapi.io/graphql_subscriptions/managing-subscriptions.html

# Managing GraphQL Subscriptions

GraphQL subscriptions are managed through Poly’s REST API and documented in Swagger on your instance.

Head to Swagger for your instance:

`/swagger`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/swagger>

Authorize with your API key before trying the endpoints.

Note

You must have the “Manage GraphQL Subscriptions” permission to create, update, or delete GraphQL subscriptions.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need this permission added.

## What a GraphQL Subscription Includes

Each GraphQL subscription tells PolyAPI:

- which upstream GraphQL endpoint to connect to
- which subscription query to run
- which Poly server function should receive the events
- whether the subscription should currently be enabled
- which provider-specific options should be used for connection parameters or replay behavior

Core subscription fields include:

- `name` and `context`
- `type`
- `transportProtocol`
- `websocketUrl`
- `query`
- `functionId`
- `enabled`

Optional fields such as `description`, `visibility`, `paramsVariableId`, `paramsSfxId`, `paramsObject`, and `functionParams` let you adapt the subscription to your provider and event handler.

## Subscription Types

PolyAPI currently supports these GraphQL subscription types:

- `CUSTOM` for general-purpose provider streams.
- `OHIP` for Oracle Hospitality Integration Platform event streams.

OHIP subscriptions expose additional fields for replay control and persisted checkpoint handling. See [OHIP GraphQL Subscriptions](ohip-subscriptions.html) for the OHIP-specific behavior and delivery guarantees.

## REST API

GraphQL subscriptions are managed through the following endpoints:

```
GET    /subscriptions/graphql
GET    /subscriptions/graphql/{id}
POST   /subscriptions/graphql
PATCH  /subscriptions/graphql/{id}
DELETE /subscriptions/graphql/{id}
```

Use Swagger on your instance for the current request and response schema details.

## Creating a Custom GraphQL Subscription

The following example creates a `CUSTOM` GraphQL subscription that forwards provider events into an existing Poly server function:

```
curl --request POST 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "ShopifyOrdersStream",
    "context": "shopify.orders.stream",
    "type": "CUSTOM",
    "visibility": "ENVIRONMENT",
    "transportProtocol": "WS",
    "websocketUrl": "wss://example-provider.com/graphql",
    "query": "subscription OrderUpdates { orderUpdated { id status updatedAt } }",
    "functionId": "YOUR_SERVER_FUNCTION_ID",
    "enabled": true
  }'
```

This payload focuses on the minimum fields you will usually need. Add the optional parameter fields only when your provider requires them.

Tip

Keep the target server function small, observable, and safe to retry. An upstream provider, a transport reconnect, or your own recovery logic may cause a subscription event to be delivered more than once.

## Listing and Inspecting Subscriptions

Use the list endpoint to retrieve all GraphQL subscriptions in the current environment:

```
curl --request GET 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

Use the detail endpoint when you want the full resource, including OHIP checkpoint fields when applicable:

```
curl --request GET 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

## Updating a Subscription

Use `PATCH /subscriptions/graphql/{id}` to change the target function, rename the subscription, update the query, or enable and disable the stream.

For example, this request disables a subscription without deleting it:

```
curl --request PATCH 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "enabled": false
  }'
```

For OHIP subscriptions, the update endpoint is also where you choose whether the next start should use the provider’s latest event or the last persisted Poly checkpoint. That behavior is covered in [OHIP GraphQL Subscriptions](ohip-subscriptions.html).

## Deleting a Subscription

Delete a subscription when you no longer want PolyAPI to maintain the upstream connection:

```
curl --request DELETE 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED'
```

Deleting removes the managed subscription resource. If you only want to pause delivery temporarily, prefer `PATCH` with `"enabled": false`.

## Conclusion

GraphQL subscriptions give PolyAPI a managed way to receive provider-pushed events and hand them to your own server function.

Start with the general REST management flow on this page, then move to [OHIP GraphQL Subscriptions](ohip-subscriptions.html) if you are integrating with Oracle OHIP.
