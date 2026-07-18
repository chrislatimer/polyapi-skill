Source: field notes (details taken from the Python SDK source and live probes)

# Server Function Runtime

What a Python server function can actually see and do at runtime, beyond the setup covered in [docs.polyapi.io/generated_sdks/python](https://docs.polyapi.io/generated_sdks/python.html) (also vendored as `generated_sdks__python.md` in the full docs pack).

## The `polyCustom` object

Inside a server function you can import a per-invocation context object:

```python
from polyapi import polyCustom

def my_server_function(...):
    exec_id = polyCustom["executionId"]        # Poly-assigned UUID for this run
    api_key = polyCustom.get("executionApiKey") # runtime API key (if configured)
```

Defined in `polyapi/__init__.py:26+`. Read-only for `executionId` by default (Poly assigns it on invocation and then locks the slot). Other keys can be set to influence the response — search for `polyCustom` in the SDK source for the full menu.

Use `polyCustom["executionId"]` when you want the row in your custom log table to correlate to what Poly logs on its side, for later cross-referencing via the server-function logs endpoints.

## Response headers on server-function calls

When a caller hits `POST /functions/server/{id}/execute`, the response headers include:

```
x-poly-execution-id: 6e7647bb-9181-44c4-9f29-0e89ba22b546
x-poly-execution-duration: 16125          (milliseconds)
x-poly-api-version: 1
```

The `x-poly-execution-id` header value equals `polyCustom["executionId"]` for the corresponding invocation. AI function calls (`/functions/ai/{id}/execute`) do NOT emit this header — see [ops__ai_functions.md](ops__ai_functions.md).

## Server-function-to-server-function calls nest execution ids

When server function A calls server function B via the generated SDK (`poly.<ctx>.<b>(...)`), Poly assigns B its own execution id. `polyCustom["executionId"]` inside B returns B's id, not A's. Callers of A see A's id in the `x-poly-execution-id` response header.

Practical consequence for wrapper patterns: if you have

```
caller → invoke_chris_calculator (A) → invoke_ai_function (B) → writes Tabi row
```

then the Tabi row's `execution_id` (populated from `polyCustom["executionId"]` inside B) is B's id, not the caller-facing A id. To capture both, pass A's `polyCustom["executionId"]` down as an explicit argument to B.

## Calling Tabi from a server function

Generated Tabi modules are importable at runtime under `polyapi.tabi.<context>.<TableName>`. All standard row operations work:

```python
from polyapi.tabi.chris.ai import AiFunctionHistory

AiFunctionHistory.insert_many(data=[{
    "ai_function_id": "...",
    "input_json": {...},
    # ...
}])

AiFunctionHistory.select_many(where={"exported_to_hindsight_at": {"equals": None}}, limit=50)
```

Method names on the class are snake_case in Python (`insert_many`, `select_many`, `upsert_many`, `update_many`, `delete_many`, `count`). The generated file at `polyapi/tabi/<ctx>/<name>/__init__.py` also contains TypedDicts for row shapes, where filters, and insert queries — useful for editor autocomplete and mypy.

Under the hood these operations use the runtime API key (either `polyCustom["executionApiKey"]` if set, or the deploy-time key). The row insert uses `x-poly-execution-id: <current exec id>` as a header, so Poly can correlate the Tabi write with the server function invocation.

## Calling PolyAPI HTTP endpoints directly from a server function

If you need to hit an endpoint the SDK doesn't cover (like `POST /functions/ai/{id}/execute`), use `requests` with `polyapi.config.get_api_key_and_url()`:

```python
import requests
from polyapi.config import get_api_key_and_url

key, base_url = get_api_key_and_url()
r = requests.post(
    f"{base_url}/functions/ai/{ai_id}/execute",
    headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    json=payload,
    timeout=60,
)
r.raise_for_status()
```

Works from both local scripts (where the key comes from `.config.env` or env vars) and deployed server functions (where Poly injects the key at runtime).

## Deploy command reference

```bash
python -m polyapi function add <name> <file.py> --context <ctx> --server \
  [--client]                              # deploy as a client function instead
  [--description "..."]
  [--logs {enabled,disabled}]             # enable Poly's log capture
  [--execution-api-key <key>]             # override runtime auth
  [--visibility {ENVIRONMENT,TENANT,PUBLIC}]
  [--image <docker-image>]
  [--generate-contexts <csv>]             # limit codegen after deploy
  [--cache-poly-library=true]             # faster cold starts (TypeScript flag; Python parity varies)
  [--skip-generate]                       # don't run generate after add
```

Redeploying an existing function (same `name` + `context`) updates it in place — the function id stays stable. This means callers with a hard-coded id keep working across redeploys.

## Logs

Poly captures logs for a server function only when `--logs enabled` was passed at deploy (or the equivalent `logs_enabled: True` in a `PolyServerFunction` config block for Glide-style deploys). Fetch them at:

```
GET /functions/server/{id}/logs?executionId=<x-poly-execution-id>
GET /functions/server/{id}/system-logs?executionId=<x-poly-execution-id>
```

`system-logs` includes container-level output; `logs` is only what your function `print`ed or logged. Full endpoint schema at [docs.polyapi.io/logging/logs_api](https://docs.polyapi.io/logging/logs_api.html) (vendored as `logging__logs_api.md`).

## Runtime environment

Server functions run in a Knative container. Python `print()` output goes to system logs. `requests` and other stdlib-friendly packages are available. Cold starts vary; the first call after a deploy can be several seconds. The `--cache-poly-library=true` flag (Node) reduces this — Python behavior is similar but the flag's exact effect isn't documented.
