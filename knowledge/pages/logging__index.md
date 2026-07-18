Source: https://docs.polyapi.io/logging/index.html

# Logging

**Logging** in PolyAPI provides visibility into both function-level (execution) and system-level activity logs for your server functions.
Logs are shipped to **Loki**, where the Poly server parses and enriches them for access via the **API** and **Canopy UI**.

Server functions have a **Logs Enabled** attribute. When set to `true`, Poly parses and stores logs for retrieval through the API and Canopy UI.

Note

Logs are retained for up to **30 days** for log level **INFO** and above.

Logs can also be deleted manually through either the API or Canopy UI.

Warning

The container runtime limits log line size to **16,384 bytes** (containerd). Lines exceeding this limit are not parsed and stored by Poly.

Logging visibility is available at two levels:

1. **Execution Logs** – Captures only logs from inside the server function.
2. **System Logs** – Includes **Execution Logs** plus additional container-level logs.

Tip

Poly’s **Canopy UI** provides an easy-to-use interface for exploring server function **System Logs**.

- [Logs in Canopy UI](logs_canopy.html)
- [Logs API](logs_api.html)
