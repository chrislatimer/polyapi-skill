Source: https://docs.polyapi.io/api_functions/openapi.html

# Using OpenAPI Specs

This document will guide you through training PolyAPI functions and webhook handlers from OpenAPI specifications.

Important

Poly currently supports OpenAPI Spec 3.0 or higher.

## Create a Specification Input File

A `Specification Input` object defines Poly resources you want to add in your environment.
You can create it manually but the most straightforward way to do it is through the `poly` typescript cli.

Note

If you do not have `poly` cli installed, head over to [Generated SDKs](../generated_sdks/index.html) to install it.

First, create a new file called `json-placeholder-spec.yaml` which will contain following OpenAPI spec:

```
openapi: 3.0.0
info:
    title: Fake json placeholder spec
    version: 1.0.0
paths:
    /posts:
        post:
            operationId: createPost
            description: Creates a new post.
            requestBody:
                content:
                    application/json:
                        schema:
                            $ref: "#/components/schemas/CreatePost"
            responses:
                "201":
                    description: "Created"
                    content:
                        application/json:
                            schema:
                                $ref: "#/components/schemas/Post"
components:
    schemas:
        Post:
            required:
                - id
                - name
            properties:
                id:
                    type: integer
                    format: int64
                name:
                    type: string
        CreatePost:
            required:
                - name
            properties:
                name:
                    type: string
```

Now run following command:

```
$ npx poly model generate ./json-placeholder-spec.yaml --context "jsonPlaceholder"
```

This command should create a new json file called `fake-json-placeholder-spec.json` which will contain the `Specification Input` object inside.

Before running this command, please make sure your OpenAPI document is valid and does not contain errors.

Use one of the following validators:

- Version 3.0.x: [Swagger editor](https://editor.swagger.io/)
- Version >=3.1: [Next Swagger editor](https://editor-next.swagger.io/)

## Train API Functions

Now that you have your `Specification Input` object saved in `fake-json-placeholder-spec.json` you are able to
add all resources it contains into your Poly environment with the following command:

```
$ npx poly model train ./fake-json-placeholder-spec.json
```

Warning

This command executes an upsert operation for each api function (or webhook handler) defined in `Specification Input` object, meaning that if an api function or webhook
handler exists in your environment with same `name` and `context` it will be overwritten.

## Use Your New API Functions

To use your new API function imported from your OpenAPI spec, create a new file called `index.ts` and add the following code:

```
import poly from 'polyapi';

(async () => {

    const response = await poly.jsonPlaceholder.createPost('https://jsonplaceholder.typicode.com', {
        name: 'Foo'
    });

    console.log(response.data);

})();
```

Now run the typescript file:

```
$ npx ts-node ./index.ts
```

You should see the following object printed in the console:

```
{ name: 'Foo', id: 101 }
```

## Train Webhook Handlers

You can also import webhooks from an OpenAPI Specification Document into Poly as Webhook Handlers.

The `webhooks` object which was introduced in [Open Api 3.1.](https://spec.openapis.org/oas/v3.1.0#oasWebhooks)

Here’s an example:

```
openapi: 3.1.0
info:
    title: Fake json placeholder spec
    version: 1.0.0
webhooks:
    /{id}/events:
        post:
            operationId: onPostCreation
            requestBody:
                description: Information about a new post created into the system.
                content:
                    application/json:
                        schema:
                            $ref: "#/components/schemas/Post"
            responses:
                "200":
                    description: Return a 200 status to indicate that the data was received successfully
components:
    schemas:
        Post:
            required:
                - id
                - name
            properties:
                id:
                    type: integer
                    format: int64
                name:
                    type: string
```

Tip

You can define both Webhooks and APIs in the same OpenAPI document. Poly will parse and import them both!

### Define the Webhook Name and Subpath

The webhook name is self-explanatory. The webhook subpath is a part of the URL that comes after the webhook id.
For example, in the URL `https://na1.polyapi.com/webhook/{id}/events`, the webhook subpath is `/events`.

The subpath is not required but can be a useful way to hint what the purpose of the webhook is.

There are 2 ways to define your webhook name and subpath:

1. As the above example showed, you can define your webhook name through `operationId` field and the `subpath` will be taken from the parent key name,
in this case `/events`. if your parent key contains a “/” character Poly will assume you are using it to define the `subpath`.

2. You can define your webhook name in the parent key and the `subpath` through the `x-subpath` extension key, like the following example:
   :   ```
       openapi: 3.1.0
       info:
           title: Fake json placeholder spec
           version: 1.0.0
       webhooks:
           onPostCreation:
               post:
                   x-subpath: /{id}/events
                   requestBody:
                       description: Information about a new post created into the system.
                       content:
                           application/json:
                               schema:
                                   $ref: "#/components/schemas/Post"
                   responses:
                       "200":
                           description: Return a 200 status to indicate that the data was received successfully
       components:
           schemas:
               Post:
                   required:
                       - id
                       - name
                   properties:
                       id:
                           type: integer
                           format: int64
                       name:
                           type: string
       ```

## Modify a Specification Input

As we mentioned before, a `Specification Input` is an object that defines Poly resources you want to add to your environment.

After running the command `npx poly model generate ...`, you can modify the `Specification Input` inside the generated `json`
file if you want to change some details of the resources defined there.

Here’s an example `Specification Input`:

```
{
    "functions": [
        {
            "name": "createPost",
            "context": "jsonPlaceholder",
            "description": "Creates a new post.",
            "arguments": [
                {
                    "name": "hostUrl",
                    "type": "string",
                    "required": true,
                    "description": "Specifies the host URL for the service. It should be a fully qualified URL string that provides the base address of the service endpoint.",
                    "removeIfNotPresentOnExecute": false
                },
                {
                    "name": "body",
                    "type": "object",
                    "typeSchema": {
                        "$schema": "http://json-schema.org/draft-06/schema#",
                        "required": [
                            "name"
                        ],
                        "properties": {
                            "name": {
                                "type": "string"
                            }
                        },
                        "x-readme-ref-name": "CreatePost",
                        "definitions": {}
                    },
                    "required": true,
                    "description": "The payload containing the details of the new blog post. This should include necessary information such as the title, content, author, and any other relevant metadata required by the blog platform.",
                    "removeIfNotPresentOnExecute": false
                }
            ],
            "returnType": "object",
            "returnTypeSchema": {
                "$schema": "http://json-schema.org/draft-06/schema#",
                "required": [
                    "id",
                    "name"
                ],
                "properties": {
                    "id": {
                        "type": "number",
                        "format": "int64"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "x-readme-ref-name": "Post",
                "definitions": {}
            },
            "source": {
                "auth": {
                    "type": "noauth"
                },
                "method": "POST",
                "body": {
                    "mode": "raw",
                    "raw": "{{body}}",
                    "language": "json"
                },
                "url": "{{hostUrl}}/posts",
                "headers": []
            }
        }
    ],
    "webhooks": []
}
```

You can modify details like:

- `arguments`
- `name`
- `returnTypeSchema`
- `source`
- etc…

If you want to see all available options, please visit:

- [CreateApiFunctionDto schema](https://na1.polyapi.io/swagger#/default/FunctionController_upsertApiFunction)
- [CreateWebhookHandleDto schema](https://na1.polyapi.io/swagger#/default/WebhookController_upsertWebhookHandle)

After you edit your `Specification Input`, you can also the Poly library to verify it is valid:

```
$ npx poly model validate ./fake-json-placeholder-spec.json
```

## Onward

Now check out how to you can:

- Install the PolyAPI SDK.
- Use this API Function via your language’s SDK.
- Use Custom Functions to coordinate many API functions using the full power of code.

Head over to [Generated SDKs](../generated_sdks/index.html) to learn more!
