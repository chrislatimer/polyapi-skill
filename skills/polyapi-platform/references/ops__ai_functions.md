Source: field notes (docs.polyapi.io does not cover this primitive yet)

# AI Functions

**AI Functions are a first-class PolyAPI resource type — but they are not documented on docs.polyapi.io.** Everything on this page comes from probing the live API against `dev.polyapi.io` and reading the actual Python SDK source. Treat this page as the authoritative reference until the official docs catch up.

## Two different "AI function" systems

PolyAPI exposes two unrelated resources whose names collide. Do not confuse them.

| System | Route root | Id shape | Concept | Conversation history? |
|---|---|---|---|---|
| **New — first-class AI function** | `/functions/ai` | UUID | Single LLM invocation with a fixed system prompt, typed args, and optional structured output schema | **No** |
| **Legacy — AI orchestrator** | `/ai-functions` | Integer (slug-addressable) | Multi-turn agent that wraps regular Poly functions as tools | **Yes** — `/ai-functions/{slug}/conversations` |

The rest of this page is about the new first-class primitive at `/functions/ai/*`, which is what appears in Canopy as **AI Functions**.

## Lifecycle state

The `state` field on every AI function is currently `"ALPHA"`. Consequence: several capabilities that server functions have are missing here (see [Missing observability](#missing-observability)).

## Endpoints

```
GET    /functions/ai                          list
POST   /functions/ai                          create
GET    /functions/ai/{id}                     get full spec
PATCH  /functions/ai/{id}                     update
DELETE /functions/ai/{id}                     delete
POST   /functions/ai/{id}/execute             run
POST   /functions/ai/{id}/voice/twilio        voice webhook
GET    /functions/ai/resolve-tool-functions   utility
```

Full list came from `https://dev.polyapi.io/swagger/swagger-ui-init.js`. Note that **none of the observability endpoints** that server functions have (`/logs`, `/system-logs`, `/executions`) exist for AI functions.

## Full spec shape

`GET /functions/ai/{id}` returns considerably more than the summary `/specs` endpoint shows. A real example:

```json
{
  "id": "0420939d-7583-49ee-a051-3c132f96c95a",
  "slug": "chriscalculator",
  "name": "chrisCalculator",
  "context": "chris.ai",
  "description": "…",
  "environmentId": "…",
  "visibility": "ENVIRONMENT",
  "state": "ALPHA",
  "enabled": true,

  "type": "TEXT",              // implies a VOICE subtype exists
  "provider": "openai",
  "apiType": "responses",      // OpenAI Responses API
  "model": "gpt-5.5",

  "arguments": [               // typed inputs
    {"key": "operation", "type": "string", "required": true, "description": "..."},
    {"key": "a",         "type": "number", "required": true, "description": ""},
    {"key": "b",         "type": "number", "required": true, "description": ""}
  ],
  "returnType": null,
  "returnTypeSchema": null,

  "systemPrompt": "You are a precise mathematical calculator...",
  "systemPromptVariableId": null,      // can pull prompt from a Vari secret
  "inputTemplate": "Perform this math operation: {{operation}} for these two numbers {{a}} and {{b}}",

  "clientPromptEnabled": false,        // let caller override prompt at call time
  "clientPromptRequired": false,
  "clientPromptArgName": "",

  "toolFunctionIds": [],               // bind other Poly functions as OpenAI tools
  "toolFunctions": [],

  "outputSchema": { ...JSON Schema... }, // structured output when set

  "voiceConnectProvider": "TWILIO",
  "voiceOutput": "ALLOY",
  "voiceConnectWebhookUrl": ".../voice/twilio"
}
```

Notable fields worth using:

- **`inputTemplate`** — Handlebars-style `{{arg}}` interpolation over `arguments`. The rendered string is the user message sent to the LLM. If you leave `inputTemplate` empty, the arguments are still available but you need to explain in `systemPrompt` how to use them.
- **`systemPromptVariableId`** — swap the prompt in for a Vari secret variable, useful if you want the prompt itself to be secret or environment-specific.
- **`outputSchema`** — when set, the LLM is forced to return JSON matching the schema. Combines with providers that support structured outputs (OpenAI Responses API does).
- **`toolFunctionIds`** — list of Poly server/api function IDs to expose as tools to the LLM. The LLM can invoke them and use results in its response.
- **`clientPromptEnabled` / `clientPromptRequired` / `clientPromptArgName`** — if enabled, callers can pass an extra arg (named by `clientPromptArgName`) that overrides or augments the system prompt at call time.

## Creating an AI function

`POST /functions/ai` with a JSON body. Server-generated fields (`id`, `createdAt`, `updatedAt`, `environmentId`, `voiceConnectWebhookUrl`, `state`) are omitted. Minimum body:

```bash
curl -X POST https://dev.polyapi.io/functions/ai \
  -H "Authorization: Bearer $POLY_API_KEY" \
  -H "content-type: application/json" \
  -d '{
    "name": "chrisCalculator",
    "context": "chris.ai",
    "description": "Does sweet math.",
    "visibility": "ENVIRONMENT",
    "enabled": true,
    "type": "TEXT",
    "provider": "openai",
    "apiType": "responses",
    "model": "gpt-5.5",
    "arguments": [
      {"key": "operation", "type": "string", "required": true, "description": ""},
      {"key": "a", "type": "number", "required": true, "description": ""},
      {"key": "b", "type": "number", "required": true, "description": ""}
    ],
    "systemPrompt": "You are a precise mathematical calculator...",
    "inputTemplate": "Perform this math operation: {{operation}} for these two numbers {{a}} and {{b}}",
    "outputSchema": {...},
    "voiceConnectProvider": "TWILIO",
    "voiceOutput": "ALLOY"
  }'
```

Returns the full spec including the assigned UUID.

## Executing an AI function

```bash
curl -X POST https://dev.polyapi.io/functions/ai/{id}/execute \
  -H "Authorization: Bearer $POLY_API_KEY" \
  -H "content-type: application/json" \
  -d '{"operation":"multiplication","a":7,"b":6}'
```

Response body is **the raw model output** — either plain text or a JSON object matching `outputSchema`, depending on the function. Status code is `201`.

Response headers do **not** include an execution id. You can't correlate the AI call to any Poly-side identifier — you only get whatever id you assign yourself (e.g., a wrapper's Tabi row id).

If the function takes no arguments, POST `{}`.

## The Python SDK does not codegen AI functions

`python -m polyapi generate` silently skips every `aiFunction` in the spec catalog. The reason is in `polyapi/typedefs.py`: the `SpecificationDto.type` literal only lists

```python
Literal['apiFunction', 'customFunction', 'serverFunction',
        'authFunction', 'webhookHandle', 'serverVariable', 'table']
```

`aiFunction` isn't in that list, so codegen ignores it. Practical consequence: you cannot do `poly.chris.ai.chrisCalculator(...)` — that symbol doesn't exist in the generated SDK. Until the SDK catches up, invoke via direct HTTP (curl / `requests.post(...)`) or via a server-function wrapper (see [ops__wrapper_patterns.md](ops__wrapper_patterns.md)).

## Missing observability

None of these work for AI functions (they do for server functions):

- `GET /functions/ai/{id}/logs`
- `GET /functions/ai/{id}/system-logs`
- `GET /functions/ai/{id}/executions`

The AI function spec also has **no `logsEnabled` field**. If you need I/O history, log it yourself in a wrapper — see [ops__wrapper_patterns.md](ops__wrapper_patterns.md).

## Confusing sibling: `/ai-functions/{slug}/conversations`

If you see the `/ai-functions` route in the Swagger and think it's for AI functions, note: it's the **legacy AI orchestrator**, a completely separate resource. It has `/conversations` and `/conversations/{conversationSlug}` sub-routes and stores multi-turn dialog. Its resources look like:

```json
{"id": 187, "slug": "messagegen", "name": "Message Generator", "functionIds": "[...]", "environmentId": "..."}
```

Integer id, `functionIds` field, no `model`/`provider`/`systemPrompt`. Distinct from the new primitive.

## When to use AI functions

Good fit:
- Deterministic-looking transformations you don't want to write parsers for (unstructured → structured JSON with `outputSchema`)
- Prompt-heavy workflows you want centralized and versioned
- Voice interactions (Twilio wiring built in)
- Tool-using agents (via `toolFunctionIds` — the LLM invokes your Poly server/api functions)

Poor fit (right now):
- Anything needing native execution history (until Poly ships it)
- High-QPS deterministic logic — use a server function instead, or wrap the AI function with a smart wrapper that short-circuits on known patterns (see [ops__wrapper_patterns.md](ops__wrapper_patterns.md))
