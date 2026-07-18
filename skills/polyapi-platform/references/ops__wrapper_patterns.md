Source: field notes (two idioms developed while filling gaps in AI Functions)

# Wrapper Patterns

Two idioms that turn thin PolyAPI server functions into leverage on top of AI Functions. Both come from the fact that AI functions (currently ALPHA) lack native observability and can't yet be codegenned into the SDK — see [ops__ai_functions.md](ops__ai_functions.md).

---

## Pattern 1 — Observability Wrapper

**Problem.** AI functions have no `/logs`, `/system-logs`, or `/executions` endpoints. You can't answer "what did the LLM say to this input three days ago?"

**Shape.** A server function that owns the invocation: it calls the AI function via `POST /functions/ai/{id}/execute`, records `(input, output, model, provider, started_at, latency_ms, error, execution_id, caller)` to a Tabi table, then returns the AI response. Route all callers through the wrapper instead of hitting the AI function directly.

```
[caller]
   │
   ▼
[server function wrapper]  ─── writes ─►  Tabi table: ai_function_history
   │
   ▼  POST /functions/ai/{id}/execute
[AI function]
   │
   ▼
raw response
```

**Minimal Python.** See the `polyCustom` and `polyapi.config.get_api_key_and_url()` notes in [ops__server_function_runtime.md](ops__server_function_runtime.md).

```python
import time
from datetime import datetime, timezone

import requests
from polyapi import polyCustom
from polyapi.config import get_api_key_and_url
from polyapi.tabi.<ctx>.<Table> import <Table>          # generated Tabi module
from polyapi.typedefs import PolyServerFunction

polyConfig: PolyServerFunction = {
    "name": "invoke_ai_function",
    "context": "<ctx>",
    "logs_enabled": True,
    "visibility": "ENVIRONMENT",
}

def invoke_ai_function(ai_function_id, input_body, ai_function_slug="",
                       model="", provider="", caller=""):
    key, base_url = get_api_key_and_url()
    started_at = datetime.now(timezone.utc)
    started_perf = time.perf_counter()
    error_text, output_text = None, ""
    try:
        r = requests.post(
            f"{base_url}/functions/ai/{ai_function_id}/execute",
            headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
            json=input_body, timeout=60,
        )
        r.raise_for_status()
        output_text = r.text
        return output_text
    except Exception as exc:
        error_text = str(exc); raise
    finally:
        <Table>.insert_many(data=[{
            "ai_function_id": ai_function_id,
            "ai_function_slug": ai_function_slug,
            "input_json": input_body,
            "output_text": output_text,
            "model": model, "provider": provider,
            "started_at": started_at.isoformat(),
            "latency_ms": int((time.perf_counter() - started_perf) * 1000),
            "error": error_text,
            "caller": caller,
            "execution_id": polyCustom.get("executionId") or "",
        }])
```

**Recommended Tabi columns.** Beyond the auto `id`/`createdAt`/`updatedAt`:

| Column | Type | Notes |
|---|---|---|
| `ai_function_id` | text (required) | Correlates the row to the AI function |
| `ai_function_slug` | text (required) | Human-friendly label; useful for filtering |
| `input_json` | jsonb (required) | Full input payload as sent to `/execute` |
| `output_text` | text | Raw response body — leave as text, don't try to jsonb it (AI outputs vary) |
| `model` | text | Snapshot at invocation time |
| `provider` | text | Snapshot at invocation time |
| `started_at` | timestamptz (required) | Wall-clock start of the AI call |
| `latency_ms` | integer | How long the AI call took |
| `error` | text | Set when the AI call raised |
| `caller` | text | Free-form; who invoked this (user, job, service) |
| `execution_id` | text | `polyCustom["executionId"]` — Poly's id for the wrapper's run |

Optional add-ons: `exported_to_hindsight_at timestamptz` for external export gates, `code_path_error text` if you go on to Pattern 2.

**Coverage gap.** The wrapper only sees calls that go through it. If anyone hits `/functions/ai/{id}/execute` directly, you miss that call. Options:

- Restrict the AI function's visibility so only the wrapper's execution API key can invoke it.
- Wait for PolyAPI to ship native AI-function execution logging (it's ALPHA).

**Cost note.** The wrapper adds one server-function execution to every AI call, and one Tabi row. Both are cheap.

---

## Pattern 2 — Smart (Reducer) Wrapper

**Problem.** Many AI functions handle a mix of "trivially deterministic" and "genuinely LLM" inputs. For the deterministic slice, you're paying LLM latency and cost for nothing. Example: a calculator AI function that gets `addition, 2, 3` — the LLM is overkill and takes ~2 seconds.

**Shape.** Same wrapper, plus an internal dispatcher. The wrapper tries a pure-Python code path for the given input. On success, it returns synthesized structured output and does **not** write to Tabi. On unknown input or code-path exception, it falls through to the AI function (Pattern 1 write applies), tagging the row so downstream automation knows whether "no code coverage yet" or "code coverage broke on this input".

```
inputs
  │
  ▼
[smart wrapper] ── code path exists? ──yes──► try lambda
  │                                            ├── success → return, NO Tabi row
  │                                            └── exception → set code_path_error
  │                                                             ▼
  └── no code path → fall through ───────────────────────► [AI function], write Tabi row
```

**Minimal Python.**

```python
CODE_PATHS = {
    "addition":       lambda a, b: a + b,
    "subtraction":    lambda a, b: a - b,
    "multiplication": lambda a, b: a * b,
    "division":       lambda a, b: a / b,
}

def invoke_chris_calculator(operation, a, b, caller=""):
    op = CODE_PATHS.get(operation)
    code_path_error = ""
    if op is not None:
        try:
            result = op(a, b)
            return {  # match the AI function's outputSchema shape
                "status": "success", "result": result, "operation": operation,
                "a": a, "b": b, "confidence": 1,
                "message": "Computed via code path.", "explanation": None,
            }
        except Exception as exc:
            code_path_error = f"{type(exc).__name__}: {exc}"

    raw = invoke_ai_function(
        ai_function_id=CHRIS_CALCULATOR_ID,
        input_body={"operation": operation, "a": a, "b": b},
        ai_function_slug="chriscalculator",
        model="gpt-5.5", provider="openai",
        caller=caller,
        code_path_error=code_path_error,       # extra column on the Tabi row
    )
    return json.loads(raw)
```

**Extra Tabi column.** Add `code_path_error text` to the history table. Populated only when the wrapper tried a code path and it raised. The reducer / dashboard can then query:

- `WHERE code_path_error IS NOT NULL` → broken code paths (highest priority)
- `WHERE code_path_error = ''` → uncovered inputs (backlog for new code paths)
- Row absent → covered and working (no visibility, but you don't need any)

**Observed latency delta.** For a calculator with add/sub/mul/div coded:

| | AI path | Code path |
|---|---|---|
| Median | ~2050ms | ~130ms |
| Mean | ~2450ms | ~130ms (warm) |
| Speedup | — | ~16× |

Cost saved is bigger than latency saved — each covered call drops one LLM request.

**When NOT to use Pattern 2.** If the AI function's outputs are inherently generative (haiku, ad copy, summary, "explain like I'm 5"), do not try to reduce. The dispatcher pattern is for functions with structured deterministic outputs. See the "Function-level classification" discussion at the end of this page.

---

## Composition: observability first, reducer second

Pattern 1 is a prerequisite for Pattern 2 — you can't decide which inputs to reduce until you can see them. The typical evolution:

1. **Day 1.** Deploy the AI function. Deploy the Pattern-1 wrapper. Route callers through the wrapper. Tabi fills with I/O history.
2. **Day 30.** Query Tabi. Group by input shape. Identify high-frequency deterministic patterns.
3. **Day 30+.** Fork the wrapper into Pattern 2. Add code paths for those patterns. Their rows disappear from Tabi (good — that's the signal reduction is happening). The remaining rows are your ongoing backlog.
4. **Day 90+.** If Tabi drains to zero, the AI function is effectively dead — its callers all hit code. You can delete the AI function or keep it as a safety net.

## Function-level classification (do this BEFORE Pattern 2)

Not every AI function is a good reducer candidate. Classify first:

- **Deterministic** (calculator, unit converter, date parser, JSON reshape) → aggressive reduction, target 100% code coverage.
- **Rule-based / structured** (extract invoice fields, keyword classifier) → hybrid: code paths for common patterns, AI fallback for the long tail.
- **Generative** (haiku, summary, ad copy) → do NOT reduce. Keep as AI. Maybe cache exact-match inputs.

The classification can be done by prompting Claude with the AI function's `systemPrompt` + `arguments` + `outputSchema` + a sample of Tabi outputs.
