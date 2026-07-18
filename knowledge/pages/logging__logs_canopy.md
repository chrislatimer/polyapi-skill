Source: https://docs.polyapi.io/logging/logs_canopy.html

# Logs in Canopy UI

Poly’s **Canopy UI** provides an easy way to view **System Logs** for your server functions.

## Accessing Logs

1. Navigate to **Server Functions** from the sidebar nav in Poly’s **Canopy UI**.
2. Hover over a function from the list view and select `show logs`.

[![Screenshot of the show logs option from the server function list view in Canopy UI.](../_images/logs_show_from_list.png)](../_images/logs_show_from_list.png)

3. Alternatively, you can:

   - Click on the function name or select `show details` to open its detail view.
   - Click the `Show Logs` button from the top of the detail view.

[![Screenshot of the show logs button from the server function detail view in Canopy UI.](../_images/logs_show_from_detail.png)](../_images/logs_show_from_detail.png)

This will open the logs page and display the most recent parsed **System Logs** for the selected server function.

Note

Logs will only be available when the server function has **Logs Enabled** set to `true`, the server function has been invoked since enabling this option, and the log level is at `INFO` or higher.

[![Screenshot of the logs page in Canopy UI ordered by most recent system logs first.](../_images/logs_page.png)](../_images/logs_page.png)

## Filtering Logs

When viewing logs, you can narrow results using the **filter bar**:

- **Keyword** – Search for log entries containing specific text.
- **Last hours** – Show only logs from the last *n* hours.
- **Last days** – Show only logs from the last *n* days.
- **Limit** – Restrict the number of log entries returned.

You can combine filters (e.g., keyword + time range) to quickly locate specific events.

## Log Limitation

The **maximum log line size** is **16,384 bytes** (containerd limit). Any log lines exceeding this size will not be parsed and stored by Poly.

## Deleting Logs

Logs can be deleted manually by clicking the `Clear logs` button. This will bring up a confirmation modal prompting you to confirm the deletion.

[![Screenshot of the logs delete confirmation modal.](../_images/logs_delete_confirm.png)](../_images/logs_delete_confirm.png)

## Conclusion

Poly’s **Canopy UI** offers a simple, visual interface for working with your server function’s **System Logs** — under the hood, it simply exercises Poly’s [Logs API](logs_api.html). For details on available endpoints, parameters, and examples, see the next section on working with logs via the **API**.
