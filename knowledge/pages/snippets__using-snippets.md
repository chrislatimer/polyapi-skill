Source: https://docs.polyapi.io/snippets/using-snippets.html

# Using Snippets

Snippets can be fetched from PolyAPI through the Web UI, API, and VSCode extension. As mentioned in the management section, snippets are created at the environment, tenant, or public level. Once created, they are available to other users at those scopes.

Note

You don’t need any special permissions to use snippets.

## Web UI Snippets

To copy a snippet from Poly’s browser UI, head to the following path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login.

Click “Snippets” in the sidebar and select the snippet you want to view. You should see a screen like this:

[![Snippet Detail](../_images/snippet-detail-ui.png)](../_images/snippet-detail-ui.png)

Copy the snippet of code by clicking the “Copy” button located at the top right of the code block section.

[![Snippet Copy](../_images/snippet-copy-code-ui.png)](../_images/snippet-copy-code-ui.png)

## API Snippets

To fetch snippets with Poly’s API, head to Swagger for your instance (or use your favorite API tool).

`/swagger`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/swagger>

Click “Authorize” and enter your api key.

PolyAPI provides the following endpoints to fetch snippets:

1. GET /snippets
2. GET /snippets/{id}
3. GET /snippets/{id}/code

The third endpoint is useful for fetching and copying just the code portion of a snippet object:

[![Snippet Code](../_images/snippet-copy-code-api.png)](../_images/snippet-copy-code-api.png)

## SDK VSCode Extension Snippets

You can also grab snippets directly from VSCode. The PolyAPI extension provides effortless access to context organized snippets, right from the Poly Tree.

For example, using the PolyAPI TypeScript SDK, you can generate the SDK to have all the latest snippets available.

```
$ npx poly generate
```

You should see the following output:

```
Generating Poly TypeScript SDK...DONE
```

Now, you can copy any snippet from the Poly Tree with one click, and paste right into your code.

[![Snippet Copy](../_images/snippet-copy-code-tree.png)](../_images/snippet-copy-code-tree.png)

## Conclusion

Snippets are a powerful way to share and consume reusable code blocks across your organization, teams, or publicly. They can be managed or consumed from the PolyAPI web UI, API, and VSCode extension.
