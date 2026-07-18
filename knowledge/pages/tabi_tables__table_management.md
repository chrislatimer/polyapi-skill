Source: https://docs.polyapi.io/tabi_tables/table_management.html

# Manage Tabi Tables

This page covers table lifecycle operations using the REST API.

## Base URL and auth

Use your environment hostname (for example `eu1.polyapi.io`, `na1.polyapi.io`) and send your bearer token.

```
curl -H "Authorization: Bearer $YOUR_BEARER_TOKEN" \
    https://eu1.polyapi.io/tables
```

## Table endpoints

- `GET /tables` list tables
- `POST /tables` create table
- `GET /tables/{id}` get one table
- `PATCH /tables/{id}` update table metadata or schema
- `DELETE /tables/{id}` delete table

## Create a table

Note: Tabi automatically provides these columns on every table:

- `id` (UUID primary key)
- `created_at`
- `updated_at`

So there’s no need to include those in your column definitions when creating a table!

```
curl -X POST https://eu1.polyapi.io/tables \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $YOUR_BEARER_TOKEN" \
  -d '{
    "name": "MyTable",
    "context": "customer.data",
    "description": "Structured records for customer sync",
    "visibility": "ENVIRONMENT",
    "columns": [
      {
        "name": "data_type",
        "type": "text",
        "required": true,
        "unique": false,
        "primary": false,
        "schema": { "type": "string", "enum": ["building", "company", "user"] }
      },
      {
        "name": "external_id",
        "type": "text",
        "required": true,
        "unique": true,
        "primary": false,
        "schema": { "type": "string" }
      },
      {
        "name": "json_data",
        "type": "jsonb",
        "required": true,
        "unique": false,
        "primary": false,
        "schema": { "type": "object" }
      }
    ]
  }'
```

Notes:

- `name` and `columns` are required.
- `visibility` values are `ENVIRONMENT` or `TENANT`.
- Column `schema` is used for generated SDK type hints and documentation, not runtime enforcement.

## Supported column data types

Tabi accepts the following column type names and aliases:

- `string`, `text`, `varchar` -> stored as `text`
- `char` -> stored as `char`
- `uuid` -> stored as `uuid`
- `number`, `numeric`, `decimal` -> stored as `numeric`
- `float`, `double`, `float8` -> stored as `double precision`
- `int`, `integer`, `int4` -> stored as `integer`
- `bigint`, `int8` -> stored as `bigint`
- `serial` -> stored as `serial`
- `bigserial` -> stored as `bigserial`
- `boolean`, `bool` -> stored as `boolean`
- `date` -> stored as `date`
- `time`, `timesec` -> stored as `time`
- `timestamp`, `timestamptz` -> stored as `timestamptz`
- `json`, `jsonb`, `object` -> stored as `jsonb`

## Update a table

Use `PATCH /tables/{id}` to update name/context/description/visibility and apply supported schema changes.

```
curl -X PATCH https://eu1.polyapi.io/tables/$YOUR_TABLE_ID \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $YOUR_BEARER_TOKEN" \
  -d '{
    "description": "Updated table description",
    "columns": [
      {
        "name": "new_status",
        "type": "text",
        "required": false,
        "unique": false,
        "primary": false,
        "schema": { "type": "string" }
      }
    ]
  }'
```

Warning

Schema changes currently support adding or dropping columns only.

## Delete a table

```
curl -X DELETE https://eu1.polyapi.io/tables/$YOUR_TABLE_ID \
    -H "Authorization: Bearer $YOUR_BEARER_TOKEN"
```

## References

- [Swagger /tables endpoints](https://eu1.polyapi.io/swagger/#/Tables)
