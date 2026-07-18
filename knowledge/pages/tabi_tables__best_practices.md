Source: https://docs.polyapi.io/tabi_tables/best_practices.html

# Tabi Best Practices

This page covers best practices and recommendations for using Tabi tables.

## Paginating large result sets

If you use `selectMany` to read all rows from a table with `offset` for pagination, you must include an `orderBy` clause. Without a deterministic sort order, row order can shift between requests and you may miss or duplicate rows across pages.

Warning

Always set `orderBy` when paginating with `offset`. Use a column with a stable, unique ordering (for example `id` or `createdAt`).

Instead of this:

```
await tabi.customer.data.MyTable.selectMany({
  where: { data_type: "company" },
  limit: 50,
  offset: pageNumber * 50,
});
```

Do this:

```
await tabi.customer.data.MyTable.selectMany({
  where: { data_type: "company" },
  limit: 50,
  offset: pageNumber * 50,
  orderBy: { id: "asc" },
});
```
