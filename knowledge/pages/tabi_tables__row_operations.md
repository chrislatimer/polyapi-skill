Source: https://docs.polyapi.io/tabi_tables/row_operations.html

# Tabi Row Operations

This page covers row-level operations on a table.

## Tabi SDK

For row operations, the recommended approach is to use the generated PolyAPI SDK.

Create your table first in [Manage Tabi Tables](table_management.html), then regenerate your SDK:

```
$ npx poly generate
```

The following SDK operations are all demonstrated in TypeScript, but the same operations are available in the Python SDK as well.

## Insert Rows (SDK)

Now in TypeScript, import `tabi` and call methods on your generated table path.

```
import { tabi } from "polyapi";

(async () => {
  const result = await tabi.customer.data.MyTable.insertMany({
    data: [
      {
        external_id: "cust_001",
        data_type: "company",
        json_data: { name: "Acme", region: "EMEA" },
      },
      {
        external_id: "cust_002",
        data_type: "company",
        json_data: { name: "Globex", region: "NA" },
      },
    ],
  });

  console.log(result);
})();
```

## Select Rows (SDK)

```
import { tabi } from "polyapi";

(async () => {
  const result = await tabi.customer.data.MyTable.selectMany({
    where: {
      data_type: "company",
    },
    limit: 50,
    offset: 0,
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(result.results);
  console.log(result.pagination);
})();
```

## Count Rows (SDK)

```
import { tabi } from "polyapi";

(async () => {
  const result = await tabi.customer.data.MyTable.count({
    where: {
      data_type: "company",
    },
  });

  console.log(result.count);
})();
```

## Upsert Rows (SDK)

```
import { tabi } from "polyapi";

(async () => {
  const result = await tabi.customer.data.MyTable.upsertMany({
    data: [
      {
        external_id: "cust_001",
        data_type: "company",
        json_data: { name: "Acme Updated", region: "EMEA" },
      },
    ],
  });

  console.log(result);
})();
```

Warning

Current upsert behavior can target only one unique column.

## Update Rows (SDK)

```
import { tabi } from "polyapi";

(async () => {
  const result = await tabi.customer.data.MyTable.updateMany({
    where: {
      external_id: "cust_001",
    },
    data: {
      data_type: "company",
    },
  });

  console.log(result);
})();
```

## Delete Rows (SDK)

```
import { tabi } from "polyapi";

(async () => {
  const result = await tabi.customer.data.MyTable.deleteMany({
    where: {
      external_id: "cust_002",
    },
  });

  console.log(result);
})();
```

## Response shape

- Insert/select/upsert/update return a query result object with `results` and `pagination`.
- Count returns `{ "count": <number> }`.
- Delete returns `{ "deleted": <number> }`.

## REST Endpoint Reference

In general, users of PolyAPI do not need to perform row operations through REST directly, and should use the SDK instead.

However, for advanced users who want to call the REST endpoints directly (for example, from a non-Node/Python environment), here are the details:

- `POST /tables/{id}/insert`
- `POST /tables/{id}/upsert`
- `POST /tables/{id}/count`
- `POST /tables/{id}/select`
- `POST /tables/{id}/update`
- `POST /tables/{id}/delete`

Swagger reference:

[Swagger /tables endpoints](https://eu1.polyapi.io/swagger/#/Tables)
