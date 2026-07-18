Source: https://docs.polyapi.io/logging/logs_api.html

# Logs API

Poly’s **Logs API** provides programmatic access to both **Execution Logs** and **System Logs** for your server functions.

## Log Types

- **Execution Logs**

  Captures only logs emitted from inside the server function.

  Endpoints:

  ```
  GET    /functions/server/{id}/logs
  DELETE /functions/server/{id}/logs
  ```
- **System Logs**

  Includes **Execution Logs** plus additional container-level logs useful for deeper debugging.

  Endpoints:

  ```
  GET    /functions/server/{id}/system-logs
  DELETE /functions/server/{id}/system-logs
  ```

Note

Logs will only be available when the server function has **Logs Enabled** set to `true`, the server function has been invoked since enabling this option, and the log level is at `INFO` or higher.

## Log Limitation

The **maximum log line size** is **16,384 bytes** (containerd limit). Any log lines exceeding this size will not be parsed and stored by Poly.

## Query Parameters

The GET endpoints support the following optional query parameters:

- **keyword** *(string)* – Return only entries containing this text.
- **lastHours** *(integer ≥ 1)* – Number of hours to look back. Empty strings are ignored.
- **lastDays** *(integer ≥ 1)* – Number of days to look back. Empty strings are ignored.
- **limit** *(integer ≥ 1)* – Maximum number of log entries to return. Empty strings are ignored.
- **executionId** *(string)* – Filter logs to a specific execution (run) of the server function.

Example: Retrieve last 5 **Execution Logs** containing the keyword “foo” from the past 24 hours:

```
curl -X GET "https://api.polyapi.io/functions/server/123/logs?keyword=foo&lastHours=24&limit=5" \
  -H "Authorization: Bearer <your_token>"
```

## Deleting Logs

Use the DELETE endpoints to manually remove stored logs for a given server function.

Example: Delete all **System Logs** for a server function:

```
curl -X DELETE "https://api.polyapi.io/functions/server/123/system-logs" \
  -H "Authorization: Bearer <your_token>"
```

## Response Format

GET responses return:

- **logsEnabled** *(boolean)* – Whether Poly-parsed logs are enabled for this server function.
- **logs** *(array)* – List of log entries, each with:

  - **timestamp** *(string, ISO 8601 Z)* – Log timestamp.
  - **value** *(string)* – Log message text.
  - **level** *(string)* – Log level (e.g., INFO, WARN, ERROR).
  - **executionId** *(string)* – Identifier of the execution/run.

**Example response:**

```
{
  "logsEnabled": true,
  "logs": [
    {
      "timestamp": "2024-07-15T18:02:42.530938702Z",
      "value": "string",
      "level": "string",
      "executionId": "string"
    }
  ]
}
```

## Conclusion

Poly’s **Logs API** (used by [Logs in Canopy UI](logs_canopy.html)) enables observability, automation, and integration in your workflows.
