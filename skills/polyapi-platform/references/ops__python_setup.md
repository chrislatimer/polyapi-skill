Source: field notes (the official Python setup page omits the failure modes described here)

# Python SDK: Setup Reality

The official Python setup page — [docs.polyapi.io/generated_sdks/python](https://docs.polyapi.io/generated_sdks/python.html), also vendored as `generated_sdks__python.md` in the full docs pack — walks through the happy path. This page captures the failure modes that actually bite first-time users, in the order you hit them.

## The API key lives inside your virtualenv

`python -m polyapi setup` prompts for a server URL and API key, then writes them to:

```
<venv>/lib/pythonX.Y/site-packages/polyapi/.config.env
```

Sample contents:

```
[polyapi]
poly_api_key = dd028dcd-99bc-45a9-a1db-55f3ebffae80
poly_api_base_url = https://dev.polyapi.io
last_generate_no_types_used = false
```

Important consequences:

1. **The file is inside your venv's site-packages.** If you delete the venv, the key goes with it. If you switch venvs, you have to run setup again.
2. **`.gitignore` your entire venv.** Do NOT commit site-packages — the config file contains your unwrapped API key.
3. **Different venvs = different keys.** There is no home-directory config; every venv has its own.
4. **Regenerating the SDK also caches auth args** in `.config.env` (see `last_generate_no_types_used`).

## The `POLY_API_KEY` env var overrides the config file

This is the failure mode that trips up almost every first-time user, and the docs don't mention it. If you have any of these environment variables set in your shell:

```
POLY_API_KEY
POLY_API_BASE_URL
```

…they **override** whatever is in `.config.env`. So the symptom is:

- You run `python -m polyapi setup` with your fresh key.
- You run `python -m polyapi generate` and get `401 Unauthorized` or `NotImplementedError: b'{"message":"Unauthorized","statusCode":401}'`.
- The `.config.env` file looks correct.
- Nothing works.

Diagnose with:

```bash
env | grep POLY
```

If `POLY_API_KEY` is set (often from a shell rc file or a previous session), you have three choices:

1. **Unset it** so `.config.env` wins:  `unset POLY_API_KEY POLY_API_BASE_URL`
2. **Export the correct value** so it wins:  `export POLY_API_KEY=<the-good-key>`
3. **Update `.config.env` and unset the env var.**

The safe pattern for a shared/dev machine is to always export the key at the start of a session and never rely on `.config.env`:

```bash
export POLY_API_KEY=... POLY_API_BASE_URL=https://dev.polyapi.io
```

## Setup does not verify the key works

`python -m polyapi setup` writes whatever you type into `.config.env` — it does not make a test call to confirm the key is valid. The first API call (usually `generate`) is where you'll find out.

## The venv activation is mandatory for the CLI

`python -m polyapi ...` requires the venv where `polyapi` is installed to be active. Otherwise you get "No module named polyapi". Standard drill:

```bash
source myenv/bin/activate
python -m polyapi generate
```

Rule of thumb: prefix every polyapi command with `source myenv/bin/activate && export POLY_API_KEY=... && ...` when scripting.

## Regenerate after every remote schema change

`python -m polyapi generate` reads the live `/specs` endpoint and writes typed Python modules under `polyapi/poly/*` and `polyapi/tabi/*`. Rerun `generate` any time you:

- Create/update/delete a server function
- Create/update/delete an API function
- Create/update/delete a Tabi table (schema changes are common — see [ops__tabi_gotchas.md](ops__tabi_gotchas.md))
- Change a Vari variable's type or visibility

The CLI helpfully runs `generate` for you after `function add`, but not after direct REST changes (e.g., PATCHing a table via curl). If in doubt, regenerate.

## Filter regeneration to speed things up

Full regeneration pulls every spec in the environment (hundreds of resources in a shared dev tenant). To scope:

```bash
python -m polyapi generate --contexts chris.ai
python -m polyapi generate --names invoke_ai_function
python -m polyapi generate --ids <resource-id>
```

These are additive filters. Cached in `.config.env` under the `last_*` keys so subsequent runs reuse them unless you pass `--contexts ""` to clear.

## AI functions are silently skipped by generate

`aiFunction` isn't in the SDK's recognized type list, so `generate` produces no Python code for AI functions. Detailed explanation in [ops__ai_functions.md](ops__ai_functions.md).

## Common failure symptoms and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `401 Unauthorized` from generate | Env var overriding a stale/wrong key in `.config.env` | `env \| grep POLY` — unset or re-export |
| `NotImplementedError: b'{"message":"Unauthorized","statusCode":401}'` | Same as above (that's how the SDK surfaces 401) | Same |
| `unrecognized arguments: --data ...` on function execute | `python -m polyapi function execute` takes positional args, not `--data` | Use curl to the execute endpoint, or pass args positionally |
| `poly.foo.bar` doesn't exist after `generate` | Function is an AI function (silently skipped) | See [ops__ai_functions.md](ops__ai_functions.md); wrap in a server function or hit the REST endpoint directly |
| Generation completes but `tabi.<ctx>.<Table>` isn't there | Table was created but generate wasn't re-run | `python -m polyapi generate` |
| Committed `.config.env` to git | You accidentally added site-packages | `git rm --cached ...` and add `myenv/` to `.gitignore` |
