Source: https://docs.polyapi.io/tabi_tables/limitations.html

# Tabi Limitations

- Table PATCH only supports adding or dropping columns, not renaming columns or changing column types.
- UNIQUE constraints are supported per column (not composite).
- UNIQUE constraints can be added during or after creation, but cannot be removed.
- PostgreSQL allows multiple `NULL` values for a UNIQUE column.
- Composite indexes are not currently supported.
- Foreign keys are not currently supported.
- Upsert currently supports matching on one unique column.
- `jsonb` columns are great for storing flexible payloads, but query support inside JSON content is currently limited. Today, plan to query using top-level columns where possible, and use `jsonb` mostly for payload storage and retrieval.

Many of these limitations, like composite columns, are on the roadmap to be added and/or can be manually addressed by Poly staff.

Please [reach out](mailto:support%40polyapi.io) if your use case requires support for these features!
