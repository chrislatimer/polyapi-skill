Source: https://docs.polyapi.io/webhooks/testing.html

# Testing Webhooks

Ok, so you’ve [created your webhook](managing-webhooks.html) and
[created your trigger](managing-triggers.html), now let’s test it!

## Testing via PolyUI

There is a “Trigger” button on the webhook detail page.

Click it, enter a value for the “Event Payload” then click “Trigger”.

You should receive back the response you expect!

## Testing via curl

For this tutorial, we will use curl to test our webhook.

Replace `YOUR_WEBHOOK_ID` with your webhook ID and `YOUR_API_KEY` with your API key:

```
curl --location 'https://na1.polyapi.io/webhooks/YOUR_WEBHOOK_ID' \
    -X POST \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Bearer YOUR_API_KEY' \
    --data '{"n": 5}'
```

That’s it! You should see back “Hello Weekly Report” in the response.

## More Testing

Now let’s change the value of our server function to do something with the eventPayload received in
the HTTP Post request.

Here’s the code:

```
// npx poly function add --server --context test weeklyReport weeklyReport.ts
function weeklyReport(eventPayload, headersPayload, paramsPayload) {
    console.log("Running weekly report job!");
    return eventPayload.n * 2;
}
```

Now update the function by running:

```
npx poly function add --server --context test weeklyReport weeklyReport.ts
```

Now run the curl command again!

You should see back “10” in the response.

Congratulations! You’ve created a webhook that can accept any number as input and return double that number!

## Complex Use Cases

PolyAPI webhooks have built in tools to handle more complex use cases like:

- Authentication
- XML Parsing
- Non-Trigger Webhook Handlers
- Error Handlers

If you have any questions or need help, please don’t hesitate to reach out to us at [support@polyapi.io](mailto:support%40polyapi.io)

## Conclusion

To review we have:

- Created a webhook.
- Created a trigger linking that webhook to a server function.
- Set “Wait For Response : true” on the trigger so the HTTP request
  will wait for the server function to finish and return the server function return value.

That’s it! You can now create arbitrary APIs around your PolyAPI server functions.

And integrate with other systems that want to send data via HTTP request to your application!
