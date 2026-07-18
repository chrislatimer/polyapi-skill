Source: https://docs.polyapi.io/webhooks/webhook-security-functions.html

# Webhook Security Functions

Your webhook listeners can be configured to call one or more security functions before invoking any downstream triggers. Security functions are server functions that will be executed in the order you define them and have the power to reject any incoming webhook event. Each security function will be passed the webhook request body, headers, and parsed params from the url and should return a boolean true value to accept the request, else return a false value to reject the request.

You can configure them directly via the API using the following JSON structure:

```
{
  "name": "My webhook",
  "securityFunctions": [
    { "id": "yourServerFunctionId", "message": "Message to deliver if this security function flags the request." }
    { "id": "anotherServerFunctionId", "message": "Message to deliver if this security function flags the request." }
  ]
}
```

Or you can configure within the PolyAPI Web UI:

[![View of PolyAPI Web UI showing the form for adding/updating security functions on a webhook.](../_images/webhook-canopy-security-functions.png)](../_images/webhook-canopy-security-functions.png)

Let’s create a new security function for use in securing the webhook we created in the previous page.

Create a new server function:

```
async function hasValidCode(
  body: string,
  headers: any,
  params: any
): Promise<any> {
  const event = JSON.parse(body) as { code?: string };
  if (!event || !event.code) return false;
  // Ideally you have authentication secrets stored securely in vari
  // const expected = await vari.test.myWebhookSecret.get();
  // But for an easy demo let's use a hard-coded value:
  const expected = '2hj532kj3k3h4g53';
  if (event.code !== expected) return false;
  return true;
}
```

And then train this function to poly:

`npx poly function add hasValidCode ./src/hasValidCode.ts --server`

Now update your webhook to add the security function:

Navigate to the function detail in the Web UI, and click the “Update” button.

At the bottom of the form click the “+ Add” button to add a new security function.

Drop in the id of your new function from when you trained it or search for it in the Web UI picker.

Add an error message for users like: “Invalid or missing ‘code’ in event payload.”

Now let’s save and try out the webhook in the execute UI.

First try to execute the webhook passing an empty event and you’ll see your request is rejected:

[![View of PolyAPI Web UI showing a webhook execution that has failed to pass through a security function.](../_images/webhook-security-fn-fail.png)](../_images/webhook-security-fn-fail.png)

Now try adding the secret code to your payload, and when triggered you’ll see the webhook request sails on through as expected.

[![View of PolyAPI Web UI showing a webhook execution that has successfully passed through a security function.](../_images/webhook-security-fn-pass.png)](../_images/webhook-security-fn-pass.png)
