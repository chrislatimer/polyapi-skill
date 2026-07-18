Source: https://docs.polyapi.io/graphql_subscriptions/ohip-subscriptions.html

# OHIP GraphQL Subscriptions

OHIP subscriptions are a specialized GraphQL subscription type in PolyAPI for Oracle Hospitality Integration Platform streaming events.

Compared to a general `CUSTOM` subscription, OHIP streams have stricter rules around keep-alives, disconnection, replay, and offsets. PolyAPI exposes OHIP-specific fields so you can control how the stream starts and whether Poly should persist an exact replay checkpoint after successful event handling.

Warning

OHIP delivery in PolyAPI is **at-least-once**.

It is **not exactly-once** and **not “only-once.”**

A replay, reconnect, recovery restart, or uncertainty around the last successfully processed checkpoint can cause the same event to be delivered more than once.

## Delivery Guarantees

When `ohipMaintainOffset` is enabled, PolyAPI persists the last successfully handled OHIP offset after your server function finishes processing the event.

That persisted checkpoint is the practical acknowledgment boundary, but it does **not** turn the stream into exactly-once delivery. If the connection drops, if a restart happens mid-recovery, or if an event is replayed from the last known checkpoint, your handler may observe the same event more than once.

Treat OHIP consumers as idempotent:

- use `metadata.uniqueEventId` to deduplicate work where possible
- make downstream writes safe to retry
- maintain your own poison-message / DLQ path for events that cannot be processed safely

Note

PolyAPI does not provide an exactly-once acknowledgment protocol or a server-managed DLQ for OHIP streams.

## Build the Query for Checkpointing

If you set `ohipMaintainOffset=true`, your subscription query must select `metadata.offset`.

PolyAPI strongly recommends also selecting `metadata.uniqueEventId` so your handler can implement idempotency and better troubleshooting.

Example OHIP query:

```
"query": "subscription StreamUpdates { newEvent(input: { chainCode: \"CHA\" }) { moduleName eventName primaryKey timestamp metadata { offset uniqueEventId } detail { elementName oldValue newValue } } }"
```

## Create-Time Offset Options

OHIP create requests support two starting modes:

- `ohipOffsetSelection = "PROVIDER_HIGHEST"`
- `ohipOffsetSelection = "SPECIFIC"`

Use `PROVIDER_HIGHEST` when you want the provider to start from its current highest event and you do not want to replay older retained events.

Use `SPECIFIC` when you want to replay from an exact previously observed OHIP offset. In that case, `ohipOffset` is required.

## Start from Provider Highest

This example starts from the provider’s current highest event and tells PolyAPI to persist future checkpoints after successful handling:

```
curl --request POST 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "name": "OperaEventsLatest",
    "context": "opera.events.latest",
    "type": "OHIP",
    "visibility": "ENVIRONMENT",
    "transportProtocol": "WS",
    "websocketUrl": "wss://YOUR_OHIP_STREAM/graphql",
    "query": "subscription StreamUpdates { newEvent(input: { chainCode: \"CHA\" }) { moduleName eventName metadata { offset uniqueEventId } detail { elementName oldValue newValue } } }",
    "functionId": "YOUR_SERVER_FUNCTION_ID",
    "ohipOffsetSelection": "PROVIDER_HIGHEST",
    "ohipMaintainOffset": true,
    "enabled": true
  }'
```

## Start from a Specific Offset

This example replays from a previously observed OHIP checkpoint:

```
curl --request POST 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "name": "OperaEventsReplay",
    "context": "opera.events.replay",
    "type": "OHIP",
    "visibility": "ENVIRONMENT",
    "transportProtocol": "WS",
    "websocketUrl": "wss://YOUR_OHIP_STREAM/graphql",
    "query": "subscription StreamUpdates { newEvent(input: { chainCode: \"CHA\" }) { moduleName eventName metadata { offset uniqueEventId } } }",
    "functionId": "YOUR_SERVER_FUNCTION_ID",
    "ohipOffsetSelection": "SPECIFIC",
    "ohipOffset": "4815",
    "ohipMaintainOffset": true,
    "enabled": true
  }'
```

## Update-Time Offset Options

OHIP update requests support these restart choices:

- `ohipOffsetSelection = "PROVIDER_HIGHEST"`
- `ohipOffsetSelection = "PERSISTED"`

Use `PERSISTED` when you want the next start to resume from the last successfully persisted Poly checkpoint.

If no checkpoint has been stored yet, `PERSISTED` is invalid and the request fails.

## Resume from the Persisted Checkpoint

The following request tells PolyAPI to resume an OHIP subscription from the last persisted checkpoint and continue maintaining checkpoints afterward:

```
curl --request PATCH 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "ohipOffsetSelection": "PERSISTED",
    "ohipMaintainOffset": true
  }'
```

If you instead want to discard backlog and jump to the provider’s current latest event, use `"ohipOffsetSelection": "PROVIDER_HIGHEST"`.

## Offsets Are Opaque

Warning

Oracle states that OHIP offsets are non-linear. Treat them as opaque checkpoints, not arithmetic counters.

Do **not**:

- increment an offset by one
- subtract one offset from another
- infer exact event distance from the numeric-looking value
- assume a manually derived offset will reconnect safely

Use only offsets that you actually received from OHIP or that PolyAPI previously persisted for the subscription.

## Replay and Retention

OHIP retains replayable events for a bounded period. If you reconnect with an offset older than the retained history, OHIP may resume from the oldest event it still retains instead of the exact offset you requested.

OHIP also supports a provider-side “highest” start mode that skips older retained events and starts from the newest available event.

Choose the starting mode based on your business requirement:

- use `PROVIDER_HIGHEST` when you only care about the latest state going forward
- use a specific or persisted offset when historical continuity matters

## Replay Overload Guard

PolyAPI includes a runtime guardrail to reduce the chance that a very old offset or a very large replay burst overwhelms the subscription consumer.

Note

This runtime guard is a protective safety measure. It is **not** a general backpressure solution and it does **not** upgrade OHIP from at-least-once delivery to exactly-once delivery.

Warning

Reconnecting from a very old offset can trigger a large replay burst. If that burst exceeds PolyAPI’s replay-overload threshold while the subscription is running without persisted checkpoint recovery, PolyAPI may disable the subscription to protect the consumer.

If `ohipMaintainOffset=true`, PolyAPI first tries to restart from the last persisted checkpoint instead of disabling immediately. If no persisted checkpoint exists, or if overload recovery keeps repeating without forward progress, the subscription can still be disabled.

You should still design your consumer to:

- buffer before writing to downstream systems
- tolerate replayed events
- keep processing idempotent
- move poison events into your own DLQ or operator workflow

## Operational Best Practices

PolyAPI’s OHIP runtime is designed to align with Oracle’s published streaming best practices. In practice, this means Poly:

- keeps the stream connected instead of treating OHIP as a polling-style integration
- sends the client keep-alives needed to keep the stream open
- follows the `complete` shutdown flow during graceful disconnects
- waits before resubscribing after a graceful disconnect
- coordinates ownership so only one active Poly consumer reads a given OHIP stream identity at a time
- detects replay overload and uses restart or disable paths to avoid unbounded burst pressure on the consumer

The main things you still need to design for in your own handlers are:

- model the consumer as at-least-once
- make the handler idempotent
- buffer or otherwise absorb bursts before writing to downstream systems
- keep track of `uniqueEventId`
- treat the offset as an opaque checkpoint

## Conclusion

OHIP subscriptions give PolyAPI a managed way to consume Oracle streaming events, but the stream still carries Oracle’s operational constraints and replay semantics.

If you need durable recovery, enable `ohipMaintainOffset`, include `metadata.offset` and `metadata.uniqueEventId` in the query, and design the target function for at-least-once delivery rather than exactly-once processing.
