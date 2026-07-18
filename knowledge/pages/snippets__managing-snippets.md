Source: https://docs.polyapi.io/snippets/managing-snippets.html

# Managing Snippets

Note

You must have the “Manage Snippets” permission to manage snippets.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create a Snippet via the Web UI

Head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Click “Snippets” in the sidebar. Then click “+ Create”.

You will see a screen like this:

[![Snippet Create](../_images/snippet-create-ui.png)](../_images/snippet-create-ui.png)

For the “Name”, enter “SnippetTest”.

For the “Context”, enter “test”.

Leave “Description” blank or add your own.

For “Visibility”, select “Environment”.

For “Language”, select “JavaScript”.

Enter the following code for the snippet:

```
function exampleSnippet(): string {
    return 'This is a TS snippet!';
}
```

Click “Submit” to create the snippet.

## Updating / Deleting a Snippet via the Web UI

After submitting, you should see your snippet’s detail page like this:

[![Snippet Detail](../_images/snippet-detail-ui.png)](../_images/snippet-detail-ui.png)

Click “Update” to update your snippet or “Delete” to delete it.

## Create a Snippet via the API

Head to Swagger for your instance (or use your favorite API tool of choice).

`/swagger`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/swagger>

Click “Authorize” and Enter your api key to get started!

Search for “Snippet” in the browser search and click on “/snippets” POST endpoint. Next, click on “Try it out”, you should see the following:

[![Snippet Create Swagger](../_images/snippet-create-api.png)](../_images/snippet-create-api.png)

Update the Request body with the following JSON:

```
{
  "name": "SnippetTestAPI",
  "context": "test",
  "code": "function exampleSnippet(): string {\n    return 'This is a TS snippet!';\n}",
  "visibility": "ENVIRONMENT",
  "language": "typescript"
}
```

Click “Execute” to create the snippet.

## Updating / Deleting a Snippet via the API

After executing, you should get a 201 response back with the snippet details like this:

[![Snippet Detail](../_images/snippet-detail-api.png)](../_images/snippet-detail-api.png)

You can copy the “id” from the response to update or delete the snippet you just created.

Update with the PATCH endpoint “/snippets/{id}”

Delete with the DELETE endpoint “/snippets/{id}”

## Create a Snippet via SDK

For this example we’ll use the PolyAPI SDK for TypeScript.

More info on generating and using the TypeScript SDK can be found here [TypeScript (Node)](../generated_sdks/typescript.html).

## Deploy a Snippet to PolyAPI

Creating a snippet is very similar to creating a function.

Helpful Resources

[Snippets Video](https://www.youtube.com/watch?v=AZqUf0nv-AI)

Open a new file called `my-snippet.ts` and add the following code:

```
async function mySnippet(): string {
    return 'My Poly Snippet!';
}
```

Next use the PolyAPI TypeScript SDK to deploy this Snippet:

```
$ npx poly snippet add mySnippet ./my-snippet.ts --context best.snippets
```

You should get back output like this:

```
Adding snippet...
Success: Snippet successfully added.
Snippet ID: 52aa6377-580c-4695-8d2d-d1a4a0b747d6
Updating snippet in specs...DONE
```

That’s it! You’ve now deployed a snippet!

If you are using VSCode and have the Poly Assistant extension installed, you can now see your new snippet in the Poly Tree like this:

[![Snippet in VSCode Poly Tree](../_images/snippet-poly-tree.png)](../_images/snippet-poly-tree.png)

## Conclusion

You have successfully created a snippet (or a few)! Now let’s hop over to [Using Snippets](using-snippets.html)
