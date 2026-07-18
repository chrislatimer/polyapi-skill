Source: field notes (discovered by breaking a live table)

# Tabi Gotchas

Load-bearing warnings on top of [docs.polyapi.io/tabi_tables/table_management](https://docs.polyapi.io/tabi_tables/table_management.html) and [tabi_tables/row_operations](https://docs.polyapi.io/tabi_tables/row_operations.html) (both vendored in the full docs pack as `tabi_tables__*.md`).

## PATCH `/tables/{id}` `columns` is REPLACE, not APPEND

**This is destructive.** Sending a partial column list drops every non-system column not in the list. Postgres runs an actual `DROP COLUMN` — data in the dropped columns is gone, not archived.

### Wrong

```bash
# Intent: "add execution_id column"
# Reality: drops all other columns, data included
curl -X PATCH /tables/$ID -d '{
  "columns": [
    {"name": "execution_id", "type": "text", "required": false, ...}
  ]
}'
```

### Right

```bash
# 1. Read the current schema
curl /tables/$ID | jq '.columns'

# 2. PATCH with the full list plus your new column
curl -X PATCH /tables/$ID -d '{
  "columns": [
    { ...every existing non-system column... },
    {"name": "execution_id", "type": "text", "required": false, ...}
  ]
}'
```

System columns (`id`, `createdAt`, `updatedAt`) are always preserved automatically — you don't need to include them.

### Symptoms if this bites you

- `POST /tables/{id}/select` returns rows with only `id`, `createdAt`, `updatedAt`, and any columns from your last PATCH — everything else is missing.
- `python -m polyapi generate` regenerates the tabi module with only those columns.
- Existing rows still exist but hold NULL for the dropped columns.

### Recovery

Two paths, depending on whether you want to keep the old rows:

**Option A — delete rows first, then restore full schema with original constraints.**

```bash
# Delete all rows (or a filtered subset)
curl -X POST /tables/$ID/delete -d '{"where": {}}'

# Now safely re-PATCH with all previously-required columns still marked required
curl -X PATCH /tables/$ID -d '{"columns": [...full list with required: true...]}'
```

**Option B — restore schema with all previously-required columns flipped to `required: false`.**

Necessary if you want to keep the orphan rows. Postgres won't let you add a NOT NULL column to a table where existing rows would violate the constraint. Flip `required` to `false`, then either backfill and re-tighten later, or leave loose.

## Other Tabi caveats

### Row-level requiredness is only checked on insert

The `required` flag on a column is enforced by Poly at insert time — Postgres itself does not have a NOT NULL constraint on those columns (only truly required system columns have that). Consequence: rows inserted via direct SQL, migrations, or column-drop-and-re-add can end up with NULL in "required" columns.

### `schema` on a column is documentation, not enforcement

Per the official [tabi_tables/table_management](https://docs.polyapi.io/tabi_tables/table_management.html) page: *"Column `schema` is used for generated SDK type hints and documentation, not runtime enforcement."* You can insert `{"json_data": "not-an-object"}` even if `schema` says `{"type": "object"}`. Enforce shapes in your writing code.

### Upsert supports only one unique column

Per [tabi_tables/row_operations](https://docs.polyapi.io/tabi_tables/row_operations.html). Composite upsert keys aren't supported.

### `POST /tables/{id}/select` uses Prisma-shaped where clauses

Not raw SQL. Filter operators are `equals`, `in`, `not_in`, `lt`, `lte`, `gt`, `gte`, `contains`, `starts_with`, `ends_with`, `not`, etc. Structure:

```json
{
  "where": {"col_a": {"equals": "foo"}, "col_b": {"gt": 10}},
  "orderBy": {"createdAt": "desc"},
  "limit": 50,
  "offset": 0
}
```

Full filter typedefs are in the generated SDK — grep `polyapi/typedefs.py` for `StringFilter`, `NumberFilter`, etc.

### Delete-all requires `{"where": {}}`, not empty body

```bash
# Deletes every row
curl -X POST /tables/$ID/delete -d '{"where": {}}'
```

Response: `{"deleted": <count>}`. There's no confirmation prompt.

### `PATCH` writes returned by row operations

- Insert/select/upsert/update return `{results: [...], pagination: {...}}`
- Count returns `{count: <n>}`
- Delete returns `{deleted: <n>}`

## Before any schema change

Rule to burn in:

1. `GET /tables/{id}` first.
2. Append/edit locally.
3. PATCH the full column list back.
4. If you're removing a column that has data, delete the data or accept the loss explicitly.
5. Rerun `python -m polyapi generate` to refresh the local tabi module.
