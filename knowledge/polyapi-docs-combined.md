# PolyAPI documentation export
Total pages: 70

---

## api_functions/index

Source: https://docs.polyapi.io/api_functions/index.html

# API Function Training

This document will guide you through training your first PolyAPI function.

API functions are trained either from Postman or from OpenAPI Specs.

Please click one of the following links to get started:

- [Using Postman](postman.html)
- [Using OpenAPI Specs](openapi.html)

---

## api_functions/openapi

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

---

## api_functions/postman

Source: https://docs.polyapi.io/api_functions/postman.html

# Using Postman

For this tutorial, we will train an API function using Postman.

## Download Postman

If you don’t have Postman installed, you can download it here:

<https://www.postman.com/downloads/>

Helpful Resource

[Training APIs to Poly Video](https://www.youtube.com/watch?v=1QsuFV9jXaQ&list=PLrMPJ9Jjy1LTtT4rAGAOHhPgcZK63ts3-&index=6)

## Create a New HTTP Request

Open Postman, and create a new HTTP request.

Enter this JSON example api for the URL:

<https://jsonplaceholder.typicode.com/todos>

Then click “Send”.

You should see a response like this:

```
[
 {
     "userId": 1,
     "id": 1,
     "title": "delectus aut autem",
     "completed": false
 },
 // etc
]
```

Great! Now you have a working API. To invoke this API in Python code, you could do something like this:

```
import requests
response = requests.get("https://jsonplaceholder.typicode.com/todos")
```

But Poly makes things easier than that! Especially for APIs with authentication, complex argument types, and complex response types!

After we train an API function for this URL on PolyAPI, we will be able to invoke it like this:

```
from polyapi import poly
response = poly.todos.getList()
```

The API’s response will be examined by the AI and types will be generated for it.

For this example, the AI will generate the following types for the API response:

```
class Todo(TypedDict):
    userId: int
    id: int
    title: str
    completed: bool

class GetResponse:
    status_code: int
    data: List[Todo]
    content_type: str
```

Most API return types are significantly more complicated than this. The more complex the API, the more helpful PolyAPI’s AI becomes!

But for now, let’s keep things simple and just teach Poly how to do a simple get request!

## Download the Required Scripts

The next step is to download the Poly Postman scripts. Here they are:

<https://na1.polyapi.io/postman/scripts.zip>

## Copy Scripts into Postman

After downloading, extract the ZIP file. You will find two important scripts: a pre-request script `pre-request.js`
and a post-request script named `post-request.js`.

Copy the contents of the `pre-request.js` script into “Pre-request script” tab.

Copy the contents of the `post-request.js` script into “Tests” tab.

Note

When training functions in Postman, we recommend you structure your folders like this:

[![Postman folder structure](../_images/postman_folders.png)](../_images/postman_folders.png)

With this structure you can paste the contents of the pre-request and post-request scripts at the collection or parent folder level (e.g. Specific Project), and they will apply to all requests with in the collection/folder.

See [our public Postman collection](https://www.postman.com/poly-api-team/workspace/poly-management-apis/collection/26293942-35307084-6dc2-49e2-822d-0f5d4ab14f7e) for more ideas and code!

## Set Your API Key

In the “Pre-request Script”, you will see this line:

```
pm.environment.set('polyData', { polyApiKey: 'YourApiKeyHere', });
```

Replace `YourApiKeyHere` with your PolyAPI key.

## Training Your First Function

Now that the scripts have been added, let’s train the function!

To train, the function, just click the “Send” button.

That’s it! The Pre-request and Test script will take care of adding the API function to Poly. If you look in the console, you should see log statements showing that the function was trained and POST request to Poly’s APIs which did the ingestion of the request. You can also view functions that you’ve trained via the [Poly web app](https://na1.polyapi.io/canopy/polyui/collections/api-functions).

Important

If you don’t see the function or recent updates via the app, try refreshing the page or clicking the refresh button.

When you are training many API requests on Poly, you don’t have to add the Pre-request and Test scripts every time.

You can just make a “Collection” or “Folder” of all your API requests and add the Pre-request and Test scripts to the Collection.

For more on creating a Collection, see the Postman documentation:

<https://learning.postman.com/docs/collections/using-collections/>

## Looking at Your API Function

To look at your API functions, create a new request in Postman and set the URL to:

<https://na1.polyapi.io/functions/api>

Then in the “Authorization” tab, set the “Type” to “Bearer Token” and paste in your PolyAPI key.

Then click “Send” to send the request.

You should see something like this:

```
[{
     "id": "your-id",
     "name": "getList",
     "context": "jsonPlaceholder.todos",
     "description": "Retrieve a list of to-do items from the JSONPlaceholder API. This endpoint returns an array of to-do objects, each containing userId, id, title, and completed status. Useful for fetching sample to-do data for testing and prototyping purposes.",
     "visibility": "ENVIRONMENT"
}]
```

You should see your new function, complete with AI generated context, name, description, and input/output types.

You can interact with your PolyAPI functions through many other endpoints, documented in the PolyAPI Swagger:

<https://na1.polyapi.io/swagger>

## Control Training with Pre-Request Options

By default, the AI will generate the context, name, description, etc. for your function.

However, it is possible to set these fields explicitly in the pre-request script. There are commented out examples in the pre-request script demonstrating how to do this.

## Variables in Request Body

When training an API endpoint that has a request body (aka POST/PUT/PATCH request), specify the variables in the request body in this way:

```
{
  "name": "{{name}}",
  "location": "{{location}}"
}
```

You can also specify any variables in the URL like so:

`https://jsonplaceholder.typicode.com/users/{{id}}`

Note

You need to set the value of the variable `id` in a Postman Variable.

Here’s some documentation on [how to set a variable in Postman](https://learning.postman.com/docs/sending-requests/variables/variables/).

In this case, because it is the jsonPlaceholder API, any positive integer can be chosen for the `id`. But for a real API, please chose a valid user id. Which user id doesn’t matter, we just need a valid one so Poly can see the shape of the response.

With the above request body and the method `PATCH`, setting the variables as above results in the following API function:

```
{
     "id": "your-id",
     "type": "apiFunction",
     "context": "jsonPlaceholder.users.update",
     "name": "patchUser",
     "description": "Update user details on JSONPlaceholder. Use this API call to modify user information such as name and location. The request payload should include 'name' and 'location'. The response returns the updated user data including address, phone, and company details.",
     "function": {
         "arguments": [
             {
                 "name": "id",
                 "description": "A unique identifier for the user whose details are to be updated. This is typically a string representing the user's ID in the jsonPlaceholder database.",
                 "required": true,
                 "type": {
                     "kind": "primitive",
                     "type": "string"
                 }
             },
             {
                 "name": "name",
                 "description": "The name of the user that you want to update. This should be a string representing the user's full name.",
                 "required": true,
                 "type": {
                     "kind": "primitive",
                     "type": "string"
                 }
             },
             {
                 "name": "location",
                 "description": "The location of the user that you want to update. This should be a string representing the user's address or geographical location.",
                 "required": true,
                 "type": {
                     "kind": "primitive",
                     "type": "string"
                 }
             }
         ],
         "returnType": "..."
}
```

If you need to pass function arguments to the headers or auth section of the API request, you can use double curly brackets there too like `{{myToken}}`.

The AI will understand that the headers or auth section of the API request should be filled with the value of the variable.

## Editing Your Function

Another approach to customizing your trained functions is just to train your function without explicitly setting any field,
and then edit the function after the fact to tweak the description, context, etc.

To do so, use a PATCH request to `https://na1.polyapi.io/functions/api/yourFunctionId`.

For example, if you wanted to change the description:

```
{
  "description": "My tweaked description",
}
```

## Onward

Now check out how to you can:

- Install the PolyAPI SDK.
- Use this API Function via your language’s SDK.
- Use Custom Functions to coordinate many API functions using the full power of code.

Head over to [Generated SDKs](../generated_sdks/index.html) to learn more!

---

## authentication/api-key-permissions

Source: https://docs.polyapi.io/authentication/api-key-permissions.html

# API Key Permissions

PolyAPI provides a fine-grained permissions system for API keys, allowing precise control over what operations can be performed. Permissions can be assigned at both the environment and tenant levels, with most permissions being environment-scoped except for tenant and user management which are tenant-wide.

![PolyApi api key permission example](../_images/api-key-create.png)

API keys are the gateway to interacting with Poly’s backend and frontend features. By assigning the right permissions, you can ensure that each key only has access to the resources and actions it truly needs. This helps keep your environments secure and your workflows efficient.

## Environment-Scoped Permissions

Environment-scoped permissions let you control access to specific features and resources within a given environment (such as development, staging, or production). This means you can grant different levels of access to different teams or automation scripts, depending on their needs.

1. **Execute Functions**

   Allows invocation and usage of all primitives in Poly.

   - Execute API Functions
   - Execute Server Functions
   - Trigger Webhooks
   - Use execution endpoints
   - Access generated libraries
2. **Use Applications**

   Enables access to Canopy applications.

   - Access Poly Management UI
   - Use other applications protected by PolyAPI keys
   - View application interfaces
3. **Generate Library**

   Permits generation of SDKs and libraries.

   - Generate SDKs for integration
   - Create client libraries
   - Generate API documentation
4. **Manage API Functions**

   Full control over API function management.

   - Create new API functions
   - Modify existing functions
   - Delete functions
   - Manage function training
   - Configure function settings
5. **Manage Webhooks**

   Control over webhook configuration.

   - Create webhooks
   - Modify webhook settings
   - Delete webhooks
   - Configure webhook endpoints
6. **Manage Triggers**

   Management of trigger configurations.

   - Create triggers
   - Modify trigger settings
   - Delete triggers
   - Configure trigger conditions
7. **Custom Dev**

   Development and deployment capabilities.

   - Deploy client functions
   - Deploy server functions
   - Redeploy functions
   - Manage development environments
   - Access development tools
8. **Manage Applications**

   Control over application management.

   - Create applications
   - Modify application settings
   - Delete applications
   - Configure application access
   - Manage application resources
9. **Manage Schemas**

   Schema management capabilities.

   - Create schemas
   - Modify schemas
   - Delete schemas
   - Validate schemas
   - Manage schema versions
10. **Auth Config**

    Authentication configuration management.

    - Configure authentication providers
    - Manage auth settings
    - Set up SSO
    - Configure OAuth
    - Manage API key authentication
11. **Manage Snippets**

    Code snippet management.

    - Create snippets
    - Modify snippets
    - Delete snippets
    - Publish snippets from CLI
    - Share snippets
12. **Manage Variables**

    Management of non-secret variables.

    - Create variables
    - Modify variables
    - Delete variables
    - View variable values
    - Manage variable scopes
13. **Manage Secret Variables**

    Management of sensitive variables.

    - Create secret variables
    - Modify secret variables
    - Delete secret variables
    - Rotate secrets
    - Manage secret access
14. **Manage Jobs**

    Job management capabilities.

    - Create jobs
    - Modify job settings
    - Delete jobs
    - View job status
    - Manage job schedules

## Tenant-Scoped Permissions

Some permissions operate at the tenant level, giving administrators the ability to manage users, API keys, and tenant-wide settings across all environments. These are powerful permissions and should be granted with care.

15. **Manage Users** (Admin-only)

    User and API key management across all environments.

    - Create users
    - Modify user settings
    - Delete users
    - Manage user roles
    - Create and manage API keys
    - Reset user MFA
    - Manage user permissions
16. **Manage Tenant** (Admin-only)

    Tenant-level configuration and management.

    - Configure tenant settings
    - View audit logs
    - Manage environments
    - Change tier settings
    - Configure tenant-wide policies

## Important Notes

Assigning permissions is a critical part of securing your Poly environment. Here are some key points and best practices to keep in mind as you manage API keys:

- **Admin-Only Permissions**

  - Manage Users and Manage Tenant permissions are restricted to admin keys only
  - These permissions operate at the tenant level, affecting all environments
- **Environment Scoping**

  - Most permissions are scoped to specific environments
  - This allows for granular control over different development, staging, and production environments
- **Default Access**

  - All users with valid keys retain access to the Poly AI Assistant
  - This is a system-wide permission that cannot be revoked
- **Security Considerations**

  - Secret variables require special handling and should be managed carefully
  - Admin permissions should be granted judiciously
  - Regular review of permissions is recommended
- **Best Practices**

  - Use the principle of least privilege when assigning permissions
  - Regularly audit API key usage and permissions
  - Rotate API keys periodically
  - Use environment-specific keys for different deployment stages

By thoughtfully assigning permissions and following these guidelines, you can ensure your Poly-powered applications remain secure, flexible, and easy to manage for your team.

---

## authentication/enable-mfa-tenant

Source: https://docs.polyapi.io/authentication/enable-mfa-tenant.html

# Enable MFA for Your Tenant

By default, tenants do not have MFA turned on.
However, you can enable MFA for your tenant to add an extra layer of security.

To turn on MFA, please email [support@polyapi.io](mailto:support%40polyapi.io) and we will configure both of the required configuration variables with these calls:

```
PATCH <YOUR_INSTANCE>/tenants/<YOUR_TENANT_ID>/config-variables/MfaEnabled
{"value": true}
```

```
PATCH <YOUR_INSTANCE>/tenants/<YOUR_TENANT_ID>/config-variables/MfaRequiredActions
{
    "value": {
        "variable": {
            "update": true,
            "delete": true
        }
    }
}
```

After your tenant has been setup and your tenant admins have added their personal MFA devices, tenant admins will be able to make the above calls to update your tenant MFA configuration.

Replace `<YOUR_INSTANCE>` with your instance’s base URL, ex <https://na1.polyapi.io> and replace `<YOUR_TENANT_ID>` with your actual tenant UUID.

To see how to setup MFA as a user, see [Setting up MFA for your User Account](setup-user-mfa.html).

Please contact [support@polyapi.io](mailto:support%40polyapi.io) if you have any questions!

---

## authentication/index

Source: https://docs.polyapi.io/authentication/index.html

# Authentication

Poly’s authentication system is designed to provide robust, flexible, and secure access to your resources. Here’s how it works:

## API Keys and Permissions

**Environment-Specific Access:** API Keys are tied to a specific Environment, ensuring scoped access to resources.

**Granular Permissions:** Define permissions for each API Key to control access at a fine-grained level.

**User Access:** Assign API Keys to users to enable access; without an API Key, users cannot interact with resources.

## Single Sign-On

PolyAPI also supports single sign-on (SSO) through your preferred identity provider, in addition to API keys. We are compatible with any provider that uses the OpenID Connect protocol, including public providers like Google and Okta, as well as private providers.

Learn more: [Setting up Single Sign-On](setup-sso.html)

## Multi-Factor Authentication (MFA)

Poly supports MFA to enhance security for your account.

Administrators can enable or disable MFA at the Tenant level to make MFA available across the organization. This configuration allows users to set up MFA individually but does not enforce it.

Users can set up MFA for their accounts to add an extra layer of security. Once enabled, users authenticate with a second factor during login.

For more details, see the following pages:

- [Managing Users and API Keys](managing-users-and-api-keys.html)
- [API Key Permissions](api-key-permissions.html)
- [Enable MFA for Your Tenant](enable-mfa-tenant.html)
- [Setting up MFA for your User Account](setup-user-mfa.html)
- [Setting up Single Sign-On](setup-sso.html)

---

## authentication/managing-users-and-api-keys

Source: https://docs.polyapi.io/authentication/managing-users-and-api-keys.html

# Managing Users and API Keys

To manage users and api keys on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must be an admin and you must have the “Manage Users” permission to manage users and api keys.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create a User

Click “Users” in the left side bar.

If you are starting fresh from a new tenant, you will see a single user listed named “admin”.
This is your default user created when the tenant is created.

If you are logging into an existing tenant, you may see a list of many users.

[![User List](../_images/user-list.png)](../_images/user-list.png)

1. Click “+Create” to create a new user.
2. Enter a name for the user and select a role.
3. Click “Save” to save your new user.

That’s it!

You should see the user details of your new user:

[![User Details](../_images/user-details.png)](../_images/user-details.png)

Now let’s create an API key for your new user.

## Create a New API Key

Click “API keys” in the left side bar.

Click “+Create” to create a new API key.

[![User Details](../_images/api-key-create.png)](../_images/api-key-create.png)

Enter a name for the API key.

Select either an application or user, but not both. For this case, we will select a user and leave the application empty.

(There’s a small bug where you can’t unselect a user/application once you have selected them. If you find yourself stuck by this, just refresh the page to start over.)

Note

Users exist at the tenant level and api keys exist at the environment level. So multiple api keys may exist for a single user!

Select any permissions you want the API key to have. For a detailed description of all available permissions, see [API Key Permissions](api-key-permissions.html).

Click Save.

You’ll see a modal pop up with the new API key. Copy the key and save it somewhere safe.

That’s it! You’ve created a new API key.

## Update / Delete an API Key

Click “API keys” in the left side bar.

Note

You can filter down to just the keys for a specific environment by selecting the environment from the dropdown in the upper right.

Click “Show Details” on the key you want to update or delete.

Then just click the “Update” button to update or the “Delete” button to delete!

Note

You can only see the actual API key value once. If you lose it, you will need to create a new one.

## Update / Delete a User

Updating or deleting a User is very similar!

Click “Users” in the left side bar.

Click “Show Details” on the User you want to update or delete.

Then just click the “Update” button to update or the “Delete” button to delete!

---

## authentication/setup-sso

Source: https://docs.polyapi.io/authentication/setup-sso.html

# Setting up Single Sign-On

PolyAPI supports single sign-on (SSO) using OpenID Connect for your tenant users using your preferred identity provider. Whether you use a public identity provider like Google, Okta, Microsoft, or even if you have your own private identity provider: PolyAPI supports them.

Once you’ve created your PolyAPI tenant and have logged into the PolyAPI application, you’ll be able to start setting up single sign-on and allow your users to log into Poly.

## Setting up Single Sign-On

1. Add your org or tenant id to your PolyAPI tenant. This is the id used by your SSO Identity Provider. For example if your team uses Google Workspace, then this will be the domain of your orgs’ email address, ex. `polyapi.io`

   [![Editing a tenant via the PolyAPI UI](../_images/sso-update-tenant.png)](../_images/sso-update-tenant.png)
2. For each user on your team you wish to allow to SSO into Poly, create a User record in Poly and add their unique SSO ID to their profile. This is typically the id used as the `sub` claim by your identity provider.

   [![Editing a user record via the PolyAPI UI](../_images/sso-update-user.png)](../_images/sso-update-user.png)
3. Configure one or more permission policies for your users which will grant them some set of permissions to one or more of your tenant environments.

   [![Creating a permission policy granting a user access to several environments](../_images/sso-permission-policies.png)](../_images/sso-permission-policies.png)
4. Create a client application in your identity provider system. Your identity provider will assign your application a Client ID, and a Client Secret which you will need in the next step.
5. Register your identity provider in PolyAPI. Set the full url for your identity provider. For example if you’re using Google, then this would be `https://accounts.google.com`. For providers like Okta, this will be your custom Okta domain which includes your custom subdomain.

   Enter the Client ID and Client Secret obtained in the previous step, and make sure you enable the identity provider.

   [![Creating an identity provider](../_images/sso-identity-providers.png)](../_images/sso-identity-providers.png)
6. Create a public PolyAPI Application which your team can use to login to PolyAPI. We’ve provided a template application config below for you to copy, and customize. Be sure to update the subpath to one unique to your tenant that your team will recognize. Lastly make sure to set the id and name of your identity provider.

   ```
   {
       "name": "Your Tenant Name",
       "subpath": "unique-subpath",
       "icon": "/canopy/PolyLogo.svg",
       "login": {
           "title": "Login To Poly",
           "logoSrc": "https://polyapi.io/wp-content/uploads/2024/07/polyapi-logo-color-2024.webp",
           "identityProviders": [
               {
                   "id": "UUID of your identity provider",
                   "name": "Google"
               }
           ],
           "loginToPoly": true,
           "allowPolyApiKey": false,
           "redirectTo": "/polyui/collections/api-functions"
       },
       "collections": []
   }
   ```
7. Once your PolyAPI application is created you’ll need to return to your identity provider and finish configuring the client application. Most providers need some or all of the following data:

   Valid Domain: `https://na1.polyapi.io`

   Redirect URL: `https://na1.polyapi.io/canopy/unique-subpath/auth/finish-oauth`

   Login URL: `https://na1.polyapi.io/canopy/unique-subpath/login`

   Logout URL: `https://na1.polyapi.io/canopy/unique-subpath/logout`

   Note that the URLs provided here are for our NA1 instance. Please replace `na1` with your instance, ex. `https://eu1.polyapi.io` or `https://na2.polyapi.io`
8. At this point your team mates should be able to navigate to your canopy application:
   `https://na1.polyapi.io/canopy/unique-subpath/login`

   Share it with your team and have them bookmark this as their way of authenticating into PolyAPI.

   [![Example application showing Google SSO button for authenticating into PolyAPI](../_images/sso-login-app-example.png)](../_images/sso-login-app-example.png)

---

## authentication/setup-user-mfa

Source: https://docs.polyapi.io/authentication/setup-user-mfa.html

# Setting up MFA for your User Account

PolyAPI supports Multi-Factor Authentication (MFA) for added security.

Warning

You must have MFA enabled for your tenant before you can setup MFA for individual users.

If you are setting up a new tenant, please check out these docs for how to enable MFA for your tenant:

[Enable MFA for Your Tenant](enable-mfa-tenant.html)

## Setup MFA for your Account

To setup MFA for your account, please hit the following endpoint:

```
POST /otp/setup
```

You should receive back a QR code. Please scan the QR code with your Authenticator app of choice!

(Note: you can also receive your pairing link as text (instead of QR code) via the `/otp/pair` endpoint. This is usually used with desktop authenticator apps.)

## Verify MFA for your Account

Before you can use MFA, you must verify it. To do so, please hit the following endpoint:

```
POST /otp/verify
{"token": "123456"}
```

If you have provided a valid token, you should receive back a 200 response.

Great! You are setup and ready to go with MFA! Now let’s use it.

## Use MFA for your Account

To use MFA on an endpoint that requires it, please add your OTP via the following header:

```
x-otp: 123456
```

For example, on the create users endpoint for tenant 123, the request would look like this:

[![Create User with OTP](../_images/create-user.png)](../_images/create-user.png)

## Victory

That’s it!

You are now setup with MFA, providing additional security to your PolyAPI account.

## Reset MFA

If at any point, you want to reset your MFA please have an admin hit the following endpoint:

```
POST /tenants/123/users/456/reset-mfa
```

This will reset MFA for user 456 in tenant 123.

The common use case for this is if a user gets a new MFA device, like a new phone.

User 456 can then to go back to the `Setup` flow and go through MFA setup again on a new device.

Note

If you are a super admin managing your own instance and want to reset MFA, please contact [support@polyapi.io](mailto:support%40polyapi.io) for assistance.

Additional verification is required for super admin users.

---

## canopy/architecture

Source: https://docs.polyapi.io/canopy/architecture.html

# Canopy Architecture and Configurations

**Canopy** operates as a dynamically configurable UI framework within PolyAPI, enabling the creation of tailored user interfaces based on API configurations. This section provides an overview of Canopy’s architecture and the customizable properties and attributes that you can leverage when building **Canopy applications**.

## Canopy Architecture

### General Structure

**Canopy** functions as a **shell application** that dynamically configures itself based on **JSON application configurations**. The high-level structure of **Canopy** consists of the following elements:

- **Canopy Runtime**: The overarching execution environment for **Canopy applications**.
- **Configured Application**: Specific **Canopy-powered** application, defined within PolyAPI.
- **Configured Collection**: Logical grouping of resources within an application.
- **Item Detail**: A view displaying in-depth information about a specific resource within a collection.
- **Item Sub-page**: Additional pages within an item’s detail view.
- **Item Sub-collection**: A nested collection under a primary item.
- **Sub-item Detail**: A detail view for items within sub-collections.
- **Other collections and applications**: **Canopy** supports multiple collections and applications within the same runtime.

The hierarchy of **Canopy applications** is illustrated below:

```
    Canopy Runtime
    ├── Configured Application
    │   ├── Configured Collection
    │   │   ├── Item Detail
    │   │   │   ├── Item Sub-page
    │   │   │   ├── Item Sub-collection
    │   │   │   │   ├── Sub-item Detail
    │   ├── Other collections within the Application
    ├── Other Applications within the Runtime
```

### Base Route and Authentication

The **base route** of **Canopy** serves as the application launch screen. Depending on authentication status, users are either:

- Presented with a list of available **Canopy applications**.
- Redirected to a specific **Canopy application** login/signup screen for authentication.

For **hosted instances** of PolyAPI, the default application is typically **PolyUI**, used for managing Poly-related resources. In **self-hosted instances**, the default application can be modified within the next.config.mjs file.

### High Level Application Structure

Each **Canopy application** can define:

- **Metadata** to define branding and routing details.
- **Collections** for organizing resources.
- **Configurable login/signup screens** (within metadata) tailored to user authentication needs and branding.

## Customizing Canopy Applications

**Canopy applications** are fully customizable, enabling you to modify **metadata**, **collections**, **login/signup**, **items**, **sub-pages**, **sub-collections**, and **function/API operations** based on your requirements.

### Metadata Attributes

**Canopy applications** have a **metadata** property to define branding elements and navigation behavior:

- `name` Display name of the application.
- `subpath` Custom route for the application.
- `icon` URL for the application icon.
- `logoSrc` URL for the application logo.
- `login` Property for the login screen.
- `signUp` Property for the signup screen.

### Metadata Login Attributes

The **login** property within **metadata** can be customized with the following attributes:

- `title` Title for the login screen.
- `logoSrc` Logo for the login screen.

Example **metadata** configuration:

```
{
  "name": "Quantum Quirk",
  "subpath": "quantum-quirk-dashboard",
  "icon": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "login": {
    "title": "Login To Quantum Quirk Dashboard",
    "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.png"
}
```

### Metadata SignUp Attributes

**Canopy applications** support a **signUp** property, which configures the signup experience for users. This property consists of multiple steps, each defining fields and actions:

- `title` Title of the signup process.
- `logoSrc` URL for the signup logo.
- `steps` Ordered list of signup step properties.

Each **step** property within **signUp** can include the following attributes:

- `name` Unique identifier for the step.
- `title` Display title for the step.
- `subtitle` Descriptive text for the step.
- `fields` Array of input fields required for the step.
- `submit` Defines submission behavior for the step.
- `additionalInfo` Extra information displayed to users.
- `texts` Array of text fields and links for the step.

Each **field** property within a **step** can include the following attributes:

- `name` Field name.
- `type` [Supported Attribute Types](#types-section).
- `label` Display label for the field.
- `placeholder` Placeholder text.
- `required` Boolean indicating if the field is mandatory.
- `requiredError` Error message if the field is not filled.
- `values` Predefined options for `enum` fields with `name` and `value` attributes.
- `functionValues` API-driven options for `enum` fields.
- `showValue` Boolean indicating to show field value.
- `queryParam` Name of the query parameter to use as the field value.
- `labelHtml` HTML content for the field label.
- `helperText` Helper text for the field.

Each **submit** property within a **step** can include the following attributes:

- `label` Display label for the action.
- `function` Function property to configure execution upon submission.
- `redirectTo` URL for redirection after submission.
- `redirectWithQueryParams` Boolean indicating if query parameters should be included in the redirect.

[Function Property Attributes](#function-section) are covered below and work the same way for **submit** in **signup**.

Example **signUp** configuration:

```
"signUp": {
  "title": "Create an Account",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/signup-logo.png",
  "steps": [
    {
      "name": "userInfo",
      "title": "Sign Up",
      "fields": [
        { "name": "email", "type": "text", "label": "Email", "required": true },
        { "name": "firstName", "type": "text", "label": "First Name", "required": true },
        { "name": "lastName", "type": "text", "label": "Last Name", "required": true },
        { "name": "terms", "type": "checkbox", "label": "Agree to Terms", "required": true }
      ],
      "submit": {
        "label": "Sign Up",
        "function": { "path": "auth.createUser", "type": "server", "arguments": { "body": { "data": true } } },
        "redirectTo": "/dashboard"
      }
    }
  ]
}
```

### Collections

A **Collection** represents a structured list of items within a **Canopy application**. Key features include:

- **Card-based display** for intuitive visualization.
- **Item detail pages** for deeper exploration of individual records.
- **CRUD support** through Poly functions for authenticated users.

### Collection Configuration

Each **collection** is defined using a structured configuration that specifies:

- `id` A unique identifier.
- `name` Display name.
- `group` Group name for organizing collections.
- `nameProperty` Which property to use as the primary display name for items.
- `properties` A set of properties defining the item structure.
- `itemActions` (Optional) actions available for items list view.
- `list` and `get` Required CRUD operations for items.
- `create`, `update`, `delete` (Optional) CRUD operations for items.

Example **collection** configuration:

```
"collections": [
  {
    "id": "tasks",
    "name": "Tasks",
    "group": "Dashboard",
    "nameProperty": "title",
    "properties": {
      "id": {
        "label": "ID",
        "readOnly": true,
        "excludeFromCreate": true,
        "excludeFromUpdate": true
      },
      "title": {
        "label": "Title",
        "type": "text"
      },
      "description": {
        "label": "Description",
        "type": "multiline",
        "autoSize": true
      },
      "status": {
        "label": "Status",
        "type": "enum",
        "values": [
          {
            "name": "To Do",
            "value": "TODO"
          },
          {
            "name": "In Progress",
            "value": "IN_PROGRESS"
          }
        ]
      }
    },
    "itemActions": [
      "get",
      "update",
      "create"
    ],
    "create": {
      "actionLabel": "Add",
      "submitLabel": "Save",
      "cancelLabel": "Cancel",
      "function": {
        "path": "dashboard.createTask",
        "type": "server",
        "arguments": {
          "body": {
            "data": true
          }
        }
      }
    },
    "list": {
      "function": {
        "path": "dashboard.listTasks",
        "type": "server"
      }
    },
    "get": {},
    "update": {},
    "delete": {}
  }
]
```

### Item Properties

Each **item** within a **Canopy application collection** can include a variety of **customizable properties**, supporting different data types and UI behaviors.

**Canopy** supports the following pre-defined properties for showing basic item information and for navigation:

- `id` Unique identifier for the property.
- `name` Name for the property.
- `description` Description of the property.

Additional properties can be defined for each item based on use case.

### Supported Property Attributes

Each property can be customized with the following attributes:

- `label` Display name for the property.
- `type` Defines how the property is displayed in the UI.
- `values` Predefined options for `enum` type properties.
- `functionValues` Function to return list of predefined options for `enum` type properties.
- `key` Use property as key for CRUD operations.
- `readOnly` Prevents users from modifying the property.
- `excludeFromCreate`, `excludeFromUpdate` Hides the property from specific forms.
- `hideIfEmpty` Automatically hides the property in details view if no value exists.
- `autoSize` Automatically adjusts the input field size based on content.

### Supported Attribute Types

Types dictate how properties are displayed in the UI. Supported types include the following:

- `text` Simple text input.
- `multiline` Text area input.
- `number` Numeric input.
- `boolean` Checkbox input.
- `enum` Select input.
- `multi` Sting or JSON input.
- `nested` Nested object with properties.
- `array` Array of items with properties.
- `json` JSON code editor.
- `code` Code editor with language attribute.

Example **properties** configuration:

```
"properties": {
  "id": {
    "label": "ID",
    "readOnly": true,
    "excludeFromCreate": true,
    "excludeFromUpdate": true
  },
  "title": {
    "label": "Title",
    "type": "text"
  },
  "description": {
    "label": "Description",
    "type": "multiline",
    "autoSize": true
  },
  "status": {
    "label": "Status",
    "type": "enum",
    "values": [
      {
        "name": "To Do",
        "value": "TODO"
      },
      {
        "name": "In Progress",
        "value": "IN_PROGRESS"
      }
    ]
  }
}
```

## Function Configurations

**Canopy applications** support **CRUD operations** for managing **collection items**. Each **CRUD action** is associated with a **PolyAPI function** that performs the necessary operations. In addition to CRUD operations, **Canopy applications** can also leverage functions for other purposes, such as standalone item Sub-pages.

For **Canopy** to operate on **collection items**, it requires **PolyAPI functions** mapped to the following CRUD action properties:

- `list` Retrieves all items.
- `get` Fetches a single item.
- `create` Adds a new item.
- `update` Modifies an existing item.
- `delete` Removes an item.

### CRUD Property Attributes

Each CRUD action can be customized with the following attributes:

- `actionLabel` Display name for the action button.
- `submitLabel` Display name for the submit button.
- `cancelLabel` Display name for the cancel button.
- `function` Property for configuring Poly function associations.

### Function Property Attributes

- `path` Path to the function.
- `type` Type of function (`server` or `API`).
- `arguments` Arguments property to define what gets passed to the associated function. Configuration can draw from any params in the current url, or information from the user’s session data, or even from the collection items themselves.
- `mfaRequired` Specifies if MFA is required for the **function** being called.

### Function Arguments Property Attributes

Each argument within a function can be customized with one of the following attributes:

- `value` Specific static value of the argument.
- `apiKey` If true, value is filled with the API key currently being used by the app.
- `id` If true, value is filled with the item’s ID.
- `variableId` ID of the variable used as the argument, which is resolved by PolyAPI.
- `variablePath` Path (context.name) of the variable that is used as the value of the argument, resolved by PolyAPI.
- `data` If true, then the argument is filled with the data of the item for CRUD operations - if set to key of a property (e.g. “data”: “environmentId”), then the value of the property is used as the argument value.
- `tenant` If true, then the argument is filled with the tenant ID from the session API key.
- `environment` If true, then the argument is filled with the environment ID from the session API key.
- `pathParam` Name of the url path parameter (parsed from the url by nextjs) that is used as the value of the argument.
- `queryParam` Name of query parameter that is used as the value of the argument - additionally you can define a fallback attribute that is used as the value of the argument if the query parameter is not set - having this attribute equal to some property key, creates an additional filter field in the UI based on the property.

Example **function** configuration:

```
"create": {
  "actionLabel": "Add",
  "submitLabel": "Save",
  "cancelLabel": "Cancel",
  "function": {
    "path": "dashboard.createTask",
    "type": "server",
    "arguments": {
      "body": {
        "data": true
      }
    }
  }
}
```

Example **list function** configuration with pagination:

```
...other list properties
"paginated": true,
"function": {
  ...other function properties
  "arguments": {
    ...other arguments
    "page": {
      "queryParam": "page"
    },
    "pageSize": {
      "queryParam": "pageSize"
    },
  }
}
```

### Nested Collections and Sub-pages

Each **collection item** can contain additional **sub-collections** or **custom pages**, allowing for deeper nesting and extended functionality.

- **Sub-collections**: Support their own CRUD functions and nested structures.
- **Item Pages**: Custom standalone views powered by Poly functions.

### Development Cycle for Canopy Applications

**Canopy application** configurations can be edited and applied directly from within the **PolyAPI UI** or via Poly’s API endpoint `PUT /applications/{id}/config`.

## Conclusion

**Canopy** provides a flexible, API-driven framework for dynamically generating UI applications. By leveraging customizable collections, properties, attributes, and function configurations, you can tailor **Canopy applications** to fit your specific use cases.

To learn more, checkout [Using a Canopy Application](using_canopy.html).

---

## canopy/create_application

Source: https://docs.polyapi.io/canopy/create_application.html

# Create a Canopy UI Application

**Canopy** is a powerful framework within PolyAPI that allows you to build custom, auto-generated UI applications backed by API-driven configurations and functions. Whether you’re creating an internal dashboard, a partner portal, or a support tool, **Canopy** provides the flexibility to design a structured, interactive experience—without the need for extensive front-end development.

If you haven’t explored a **Canopy application** yet, be sure to checkout [Canopy Architecture and Configurations](architecture.html) along with [Using a Canopy Application](using_canopy.html)!

🔥 Ready to launch? Let’s get started! Head over to your PolyAPI instance and access Poly’s **Canopy application**:
`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Log in using your API key.

Note

Ensure you have the necessary permissions “Use Applications” and “Manage Applications.

Contact your tenant admin or [support@polyapi.io](mailto:support%40polyapi.io) for permissions assistance.

## Create Application

Select **Applications** from the left sidebar and click **+ Create**.

[![PolyAPI Canopy Select Create Application](../_images/canopy-create-app.png)](../_images/canopy-create-app.png)

### Fill in the following fields:

- **Name**: The name of your application, e.g., Quantum Quirk.
- **Description**: Optional, description of your application, e.g., The ultimate management dashboard app for streamlining productivity.
- **Visibility**: Select appropriate visibility level for your application.
  :   - Public - Visible to all tenants, modifiable only by authorized API keys.
      - Tenant - Shared across tenant environments, restricted to tenant API keys.
      - Environment - Isolated to a single environment, accessible only within it.
- **Config**: JSON configuration for your application. Example to follow bellow.

[![PolyAPI Canopy Create Application form](../_images/canopy-create-form.png)](../_images/canopy-create-form.png)

## JSON Configuration

The example JSON application configuration below defines a **Canopy application** named Quantum Quirk, a management dashboard designed to streamline productivity. It specifies key application settings, login customization, and a structured data collection.

### Key Components

Application Metadata:

- **name**: Defines the app’s name as Quantum Quirk.
- **subpath**: Specifies the app’s dashboard route as /quantum-quirk-dashboard.
- **icon** & **logoSrc**: Provide URLs for branding assets.
- **login**: Customizes the login page title and logo.

Collections & Data Model:

- Defines a **Tasks Collection**, representing structured task management.
- In this example, each task has key properties:
  :   - Title & Description (text, multiline) – Store task details.
      - Status & Priority (enum) – Restrict values to predefined categories.
      - Due Date (text) – Stores a date as a string.
      - Assignee (text) – Assigns a user to a task.

This example base configuration will get you started!

```
{
  "name": "Quantum Quirk",
  "subpath": "quantum-quirk-dashboard",
  "icon": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "login": {
    "title": "Login To Quantum Quirk Dashboard",
    "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.png"
  },
  "collections": [
    {
      "id": "tasks",
      "name": "Tasks",
      "group": "Dashboard",
      "properties": {
        "id": {
          "label": "ID"
        },
        "title": {
          "label": "Title",
          "type": "text"
        },
        "description": {
          "label": "Description",
          "type": "multiline"
        },
        "status": {
          "label": "Status",
          "type": "enum",
          "values": [
            {
              "name": "To Do",
              "value": "TODO"
            },
            {
              "name": "In Progress",
              "value": "IN_PROGRESS"
            },
            {
              "name": "Completed",
              "value": "COMPLETED"
            }
          ]
        },
        "priority": {
          "label": "Priority",
          "type": "enum",
          "values": [
            {
              "name": "Low",
              "value": "LOW"
            },
            {
              "name": "Medium",
              "value": "MEDIUM"
            },
            {
              "name": "High",
              "value": "HIGH"
            }
          ]
        },
        "due_date": {
          "label": "Due Date",
          "type": "text"
        },
        "assignee": {
          "label": "Assignee",
          "type": "text"
        }
      }
    }
  ]
}
```

Click the “Submit” button to create your **Canopy application**.

Your application should now be visible in the list view of PolyUI’s applications.

[![PolyAPI Canopy Applications List](../_images/canopy-apps-list.png)](../_images/canopy-apps-list.png)

## Conclusion

You’ve just created your first **Canopy application** on PolyAPI. 👏

However, at this point your application is not going to do anything until we wire up some functionality. Hop on over to [Implementing CRUD Operations in Canopy Applications](implement_crud.html) to really bring your application to life! ✨

---

## canopy/implement_api

Source: https://docs.polyapi.io/canopy/implement_api.html

# Enhancing Canopy Applications with APIs

**Canopy applications** can leverage API functions to interact with external services, fetch dynamic data, and extend application functionality. This guide will build upon the previous page where we covered [Implementing CRUD Operations in Canopy Applications](implement_crud.html), and show you how to configure your **Canopy application** to call API functions.

## Expanding the Configuration to Include API Functions

To enhance our existing example application **Quantum Quirk**, we will update the JSON configuration to display all the server functions we created earlier via **Out of the Box (OOB)** publicly available APIs. This will allow users to browse and interact with server functions they have access to.

To do this, we will add a new collection called **Poly Server Functions** to the JSON configuration. We’ll add it to the same group **Dashboard**. The collection will be displayed in the sidebar of the application under tasks.

### Updating the JSON Configuration

Below is the updated JSON configuration with a new **Poly Server Functions** collection:

```
{
  "name": "Quantum Quirk",
  "subpath": "quantum-quirk-dashboard",
  "icon": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "login": {
    "title": "Login To Quantum Quirk Dashboard",
    "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.png"
  },
  "collections": [
    {
      "id": "tasks",
      "name": "Tasks",
      "group": "Dashboard",
      "nameProperty": "title",
      "properties": {
        "id": {
          "label": "ID",
          "readOnly": true,
          "excludeFromCreate": true,
          "excludeFromUpdate": true
        },
        "title": {
          "label": "Title",
          "type": "text"
        },
        "description": {
          "label": "Description",
          "type": "multiline",
          "autoSize": true
        },
        "status": {
          "label": "Status",
          "type": "enum",
          "values": [
            {
              "name": "To Do",
              "value": "TODO"
            },
            {
              "name": "In Progress",
              "value": "IN_PROGRESS"
            },
            {
              "name": "Completed",
              "value": "COMPLETED"
            }
          ]
        },
        "priority": {
          "label": "Priority",
          "type": "enum",
          "values": [
            {
              "name": "Low",
              "value": "LOW"
            },
            {
              "name": "Medium",
              "value": "MEDIUM"
            },
            {
              "name": "High",
              "value": "HIGH"
            }
          ]
        },
        "due_date": {
          "label": "Due Date",
          "type": "text"
        },
        "assignee": {
          "label": "Assignee",
          "type": "text"
        }
      },
      "itemActions": [
        "get",
        "update",
        "create"
      ],
      "create": {
        "actionLabel": "Add",
        "submitLabel": "Save",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.createTask",
          "type": "server",
          "arguments": {
            "body": {
              "data": true
            }
          }
        }
      },
      "list": {
        "function": {
          "path": "dashboard.listTasks",
          "type": "server"
        }
      },
      "get": {
        "function": {
          "path": "dashboard.getTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            }
          }
        }
      },
      "update": {
        "actionLabel": "Edit",
        "submitLabel": "Save",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.updateTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            },
            "body": {
              "data": true
            }
          }
        }
      },
      "delete": {
        "actionLabel": "Delete",
        "submitLabel": "Confirm",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.deleteTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            }
          }
        }
      }
    },
    {
      "id": "server-functions",
      "name": "Poly Server functions",
      "group": "Dashboard",
      "nameProperty": "contextName",
      "properties": {
        "id": {
          "label": "ID",
          "excludeFromCreate": true,
          "readOnly": true
        },
        "name": {
          "label": "Name"
        },
        "context": {
          "label": "Context"
        },
        "contextName": {
          "label": "Context Name (computed)",
          "readOnly": true,
          "excludeFromCreate": true,
          "excludeFromUpdate": true
        },
        "description": {
          "label": "Description",
          "type": "multiline",
          "autoSize": true
        },
        "visibility": {
          "type": "enum",
          "label": "Visibility",
          "values": [
            {
              "name": "Public",
              "value": "PUBLIC"
            },
            {
              "name": "Environment",
              "value": "ENVIRONMENT"
            },
            {
              "name": "Tenant",
              "value": "TENANT"
            }
          ]
        }
      },
      "list": {
        "function": {
          "path": "OOB.polyapi.serverFunctions.list",
          "type": "api",
          "arguments": {
            "instanceUrl": {
              "variablePath": "OOB.polyapi.configurations.instanceUrl"
            },
            "polyAPIKey": {
              "apiKey": true
            }
          }
        }
      },
      "get": {
        "function": {
          "path": "OOB.polyapi.serverFunctions.get",
          "type": "api",
          "arguments": {
            "instanceUrl": {
              "variablePath": "OOB.polyapi.configurations.instanceUrl"
            },
            "polyAPIKey": {
              "apiKey": true
            },
            "id": {
              "id": true
            }
          }
        }
      }
    }
  ]
}
```

### Explanation of the Changes

- New Collection: **Poly Server Functions** displays all the server functions available to this environment.
- **list** Function: Calls the public API OOB.polyapi.serverFunctions.list to fetch the environment’s server functions.
- **get** Function: Retrieves the property details for a specific server function using OOB.polyapi.serverFunctions.get.
- Properties: Key details that we included in our config from server function attributes such as `name`, `context`, `description`, and `visibility`.

### Updating Your Canopy Application

1. Navigate to **Applications** in PolyUI.
2. Select your application (Quantum Quirk).
3. Click the “Update” button to modify the configuration.
4. Replace the existing JSON configuration with the updated version above.
5. Click “Submit” to apply the changes.

Pro Tip

You can iterate even faster by using Poly’s API endpoint `PUT /applications/{id}/config` to push your config changes to PolyAPI.

Once submitted, the application will now include a section displaying all server functions accessible to the user.

Login to the application at `/canopy/<your-subpath>/login` and you should see the following list view of this latest collection in your application:

[![Canopy Application Server Functions List](../_images/canopy-app-funcs-list.png)](../_images/canopy-app-funcs-list.png)

### Conclusion

By following this guide, you have successfully:

- Integrated public API functions into your **Canopy application** ✅
- Enabled users to browse and inspect server functions in the UI ✅
- Extended your **Canopy application** beyond CRUD operations ✅

With API functions now available, you can further enhance functionality by adding custom execution actions or integrating third-party APIs. 🚀

---

## canopy/implement_crud

Source: https://docs.polyapi.io/canopy/implement_crud.html

# Implementing CRUD Operations in Canopy Applications

**Canopy** enables you to build fully functional applications with an auto-generated UI backed by API-driven configurations. A key part of these applications is implementing CRUD (Create, Read, Update, Delete) operations to allow users to manage their data seamlessly.

If you haven’t yet set up a **Canopy application**, we recommend first visiting the previous page to [Create a Canopy UI Application](create_application.html) to learn how to define an application structure. This guide will build upon that foundation and will use the example JSON configuration provided.

Important

The minimum requirements for a functional Canopy application are **list** and **get** operations.

## Adding CRUD to a Canopy Application Collection

To implement CRUD in the example “Tasks” collection for the “Quantum Quirk” application, you’ll need to map each operation to a server function in PolyAPI. Let’s start by creating some very basic server functions in a namespace called “dashboard” that will handle the operations.

### Create CRUD Server Functions

For the sake of simplicity, let’s use `Vari` to hold a sample dataset of our tasks. Head over to [Vari Management UI](../vari_variables/ui.html) and create the following variable:

- Name: tasks
- Context: dashboard
- Description: (Optional)
- Visibility: Environment
- Secret: False

Select “Object” and submit with the following:

```
[
    {
        "id": "1001",
        "title": "Schrödinger’s Task",
        "description": "Both complete and incomplete until observed.",
        "status": "TODO",
        "priority": "HIGH",
        "due_date": "2023-10-01",
        "assignee": "User A"
    },
    {
        "id": "1002",
        "title": "Entanglement Experiment",
        "description": "Progress is mysteriously linked to another task.",
        "status": "IN_PROGRESS",
        "priority": "MEDIUM",
        "due_date": "2023-10-05",
        "assignee": "User B"
    },
    {
        "id": "1003",
        "title": "Warp Drive Calibration",
        "description": "Successfully bent space-time (or at least completed the task).",
        "status": "COMPLETED",
        "priority": "LOW",
        "due_date": "2023-10-10",
        "assignee": "User C"
    }
]
```

Using your language of choice, create the server functions below for mapping the CRUD operations.
If you need a refresher on how to create and deploy server functions head back to [Generated SDKs](../generated_sdks/index.html) and select your language.

TypeScript

Function for **create** operation:

```
// create-task.ts
import { vari } from 'polyapi';

async function createTask(body: any): Promise<boolean> {
  const tasks = await vari.dashboard.tasks.get();

  let newId = "1";
  if (tasks.length > 0) {
    const maxId = Math.max(...tasks.map(task => parseInt(task.id, 10)));
    newId = (maxId + 1).toString();
  }

  body.id = newId;
  tasks.push(body);

  await vari.dashboard.tasks.update(tasks);

  return true;
}
```

Function for **list** operation:

```
// list-tasks.ts
import { vari } from 'polyapi';

async function listTasks(): Promise<any[]> {
  return await vari.dashboard.tasks.get();
}
```

Function for **get** operation:

```
// get-task.ts
import { vari } from 'polyapi';

async function getTask(id: string): Promise<any | null> {
  const tasks = await vari.dashboard.tasks.get();
  const task = tasks.find(task => task.id === id);

  return task || null;
}
```

Function for **update** operation:

```
// update-task.ts
import { vari } from 'polyapi';

async function updateTask(id: string, body: any): Promise<boolean> {
  const tasks = await vari.dashboard.tasks.get();
  const existingTaskIndex = tasks.findIndex(task => task.id === id);

  if (existingTaskIndex !== -1) {
    tasks[existingTaskIndex] = { ...tasks[existingTaskIndex], ...body };
    await vari.dashboard.tasks.update(tasks);
  } else {
    throw new Error(`Task with ID ${id} not found.`);
  }

  return true;
}
```

Function for **delete** operation:

```
// delete-task.ts
import { vari } from 'polyapi';

async function deleteTask(id: string): Promise<boolean> {
  const tasks = await vari.dashboard.tasks.get();
  const existingTaskIndex = tasks.findIndex(task => task.id === id);

  if (existingTaskIndex !== -1) {
    tasks.splice(existingTaskIndex, 1);
    await vari.dashboard.tasks.update(tasks);
  } else {
    throw new Error(`Task with ID ${id} not found.`);
  }

  return true;
}
```

Deploy the functions:

```
$ npx poly function add createTask create-task.ts --context dashboard --server
$ npx poly function add listTasks list-tasks.ts --context dashboard --server
$ npx poly function add getTask get-task.ts --context dashboard --server
$ npx poly function add updateTask update-task.ts --context dashboard --server
$ npx poly function add deleteTask delete-task.ts --context dashboard --server
```

Python

Function for **create** operation:

```
# create_task.py
import json
from polyapi import vari

def create_task(body: dict) -> bool:
    tasks = json.loads(vari.dashboard.tasks.get())

    if tasks:
        max_id = max(int(task["id"]) for task in tasks)
        new_id = str(max_id + 1)
    else:
        new_id = "1"

    body["id"] = new_id
    tasks.append(body)
    vari.dashboard.tasks.update(json.dumps(tasks))

    return True
```

Function for **list** operation:

```
# list_tasks.py
import json
from typing import Any
from polyapi import vari

def list_tasks() -> Any:
    return json.loads(vari.dashboard.tasks.get())
```

Function for **get** operation:

```
# get_task.py
import json
from typing import Any, Optional
from polyapi import vari

def get_task(id: str) -> Optional[Any]:
    tasks = json.loads(vari.dashboard.tasks.get())
    task = next((task for task in tasks if task.get("id") == id), None)

    return task
```

Function for **update** operation:

```
# update_task.py
import json
from polyapi import vari

def update_task(id: str, body: dict) -> bool:
    tasks = json.loads(vari.dashboard.tasks.get())
    existing_task_index = next((index for (index, task) in enumerate(tasks) if task['id'] == id), None)

    if existing_task_index is not None:
        tasks[existing_task_index].update(body)
        vari.dashboard.tasks.update(json.dumps(tasks))
    else:
        raise ValueError(f"Task with ID {id} not found.")

    return True
```

Function for **delete** operation:

```
# delete_task.py
import json
from polyapi import vari

def delete_task(id: str) -> bool:
    tasks = json.loads(vari.dashboard.tasks.get())
    existing_task_index = next(
        (index for index, task in enumerate(tasks) if task["id"] == id), None
    )

    if existing_task_index is not None:
        del tasks[existing_task_index]
        vari.dashboard.tasks.update(json.dumps(tasks))
    else:
        raise ValueError(f"Task with ID {id} not found.")

    return True
```

Deploy the functions:

```
$ python -m polyapi function add create_task create_task.py --server --context dashboard
$ python -m polyapi function add list_tasks list_tasks.py --server --context dashboard
$ python -m polyapi function add get_task get_task.py --server --context dashboard
$ python -m polyapi function add update_task update_task.py --server --context dashboard
$ python -m polyapi function add delete_task delete_task.py --server --context dashboard
```

### Updating the Application Configuration

Now that your server functions are in place, it’s time to integrate them into your **Canopy application**.

1. Navigate to Applications in PolyUI.
2. Locate and select your new application (Quantum Quirk).
3. Click the “Update” button to modify the configuration.
4. Replace the existing JSON configuration with the updated version provided below.
5. Click “Submit” to apply the changes.

Pro Tip

You can iterate even faster by using Poly’s API endpoint `PUT /applications/{id}/config` to push your config changes to PolyAPI.

Here is the updated JSON configuration for the “Tasks” collection that we started from [Create a Canopy UI Application](create_application.html). Notice the new keys: `itemActions`, `create`, `list`, `get`, `update`, and `delete`:

Warning

This config is mapping to TypeScript functions. If you are using Python, make sure to update the `path` values accordingly to account for subtle function naming differences between the languages.

```
{
  "name": "Quantum Quirk",
  "subpath": "quantum-quirk-dashboard",
  "icon": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "login": {
    "title": "Login To Quantum Quirk Dashboard",
    "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.png"
  },
  "collections": [
    {
      "id": "tasks",
      "name": "Tasks",
      "group": "Dashboard",
      "nameProperty": "title",
      "properties": {
        "id": {
          "label": "ID",
          "readOnly": true,
          "excludeFromCreate": true,
          "excludeFromUpdate": true
        },
        "title": {
          "label": "Title",
          "type": "text"
        },
        "description": {
          "label": "Description",
          "type": "multiline",
          "autoSize": true
        },
        "status": {
          "label": "Status",
          "type": "enum",
          "values": [
            {
              "name": "To Do",
              "value": "TODO"
            },
            {
              "name": "In Progress",
              "value": "IN_PROGRESS"
            },
            {
              "name": "Completed",
              "value": "COMPLETED"
            }
          ]
        },
        "priority": {
          "label": "Priority",
          "type": "enum",
          "values": [
            {
              "name": "Low",
              "value": "LOW"
            },
            {
              "name": "Medium",
              "value": "MEDIUM"
            },
            {
              "name": "High",
              "value": "HIGH"
            }
          ]
        },
        "due_date": {
          "label": "Due Date",
          "type": "text"
        },
        "assignee": {
          "label": "Assignee",
          "type": "text"
        }
      },
      "itemActions": [
        "get",
        "update",
        "create"
      ],
      "create": {
        "actionLabel": "Add",
        "submitLabel": "Save",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.createTask",
          "type": "server",
          "arguments": {
            "body": {
              "data": true
            }
          }
        }
      },
      "list": {
        "function": {
          "path": "dashboard.listTasks",
          "type": "server"
        }
      },
      "get": {
        "function": {
          "path": "dashboard.getTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            }
          }
        }
      },
      "update": {
        "actionLabel": "Edit",
        "submitLabel": "Save",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.updateTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            },
            "body": {
              "data": true
            }
          }
        }
      },
      "delete": {
        "actionLabel": "Delete",
        "submitLabel": "Confirm",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.deleteTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            }
          }
        }
      }
    }
  ]
}
```

Once submitted, the application will automatically reflect the newly added CRUD operations, allowing users to manage tasks within the UI. 🔥

To visit your new application, go to `/canopy/<your-subpath>/login`.

For example, on `na1`, the path to the app above would be:

<https://na1.polyapi.io/canopy/quantum-quirk-dashboard/login>

[![Canopy New Application Login Page](../_images/canopy-new-app-login.png)](../_images/canopy-new-app-login.png)

Login using the same Poly API key that you used earlier to create the application.

Once logged in, you should see the following list view of the tasks we created above:

[![Canopy Application Task List](../_images/canopy-task-list.png)](../_images/canopy-task-list.png)

From the list view, you can create a new task by clicking the “Add” button. You can also select a task to open a detailed view, where you can edit or delete the task:

[![Canopy Application Task Detail](../_images/canopy-task-detail.png)](../_images/canopy-task-detail.png)

## Conclusion

By following this guide, you have successfully:

- Defined CRUD operations for a **Canopy application** collection ✅
- Linked each operation to a corresponding server function ✅
- Implemented full task management within the Quantum Quirk dashboard ✅

With CRUD now in place, you can further customize your application by refining validation rules, enhancing UI interactions, or extending functionality with additional collections, groups and resources. 🚀

Let’s keep building upon this foundation! 💪 Next up [Enhancing Canopy Applications with APIs](implement_api.html).

---

## canopy/index

Source: https://docs.polyapi.io/canopy/index.html

# Canopy

**Canopy** is a UI framework within PolyAPI that dynamically generates user interfaces based on API configurations. Built on Next.js and React, it enables developers to create interactive applications such as management dashboards, support tools, and partner portals without extensive front-end development.

If you’ve used the **PolyAPI UI** for managing and accessing things like [Vari Variables](../vari_variables/index.html), [Jobs](../jobs/index.html), [Webhooks](../webhooks/index.html), [Snippets](../snippets/index.html), etc., then you’ve already experienced a **Canopy application** in action. **Canopy** is the framework that powers the **PolyAPI UI**, and now you can use it to build your own applications!

Key features:

- **Auto-generated UI components** that adapt to API configurations.
- **Support for CRUD operations** and nested data collections.
- **Seamless integration** with PolyAPI for real-time data interactions.
- **Customization options** for theming, branding, and extended functionality.

Let’s first start off with [Canopy Architecture and Configurations](architecture.html). Then we’ll jump into the basics of [Using a Canopy Application](using_canopy.html). From there, we’ll explore how to [Create a Canopy UI Application](create_application.html) from within PolyAPI’s **Canopy application**!

- [Canopy Architecture and Configurations](architecture.html)
- [Using a Canopy Application](using_canopy.html)
- [Create a Canopy UI Application](create_application.html)
- [Implementing CRUD Operations in Canopy Applications](implement_crud.html)
- [Enhancing Canopy Applications with APIs](implement_api.html)

---

## canopy/using_canopy

Source: https://docs.polyapi.io/canopy/using_canopy.html

# Using a Canopy Application

Let’s visit PolyAPI’s UI and get familiar with a **Canopy application**! Navigate to the following path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Log in using your API key.

Note

Ensure you have the necessary permissions “Use Applications”.

Contact your tenant admin or [support@polyapi.io](mailto:support%40polyapi.io) for permissions assistance.

Once logged in, you’ll see PolyAPI’s UI **Canopy application**, something like this:

[![PolyAPI Canopy Application](../_images/canopy-polyapi-app.png)](../_images/canopy-polyapi-app.png)

## Canopy Application Anatomy

**Canopy** is designed to generate structured UIs that enhance usability and efficiency. Below are the key elements that define the anatomy of a **Canopy application** along with a break down of collections within PolyAPI’s **Canopy application**:

### Sidebar Navigation

The left-hand sidebar serves as the primary navigation panel, providing structured access to different collections and the resources within each collection. Collections are also organized into groups providing a more intuitive experience.

Note

The sidebar is collapsible, allowing you to hide it for a more focused view of the main content area.

Additionally, each group within the sidebar can be expanded or collapsed.

PolyAPI’s collections are broken up into three primary groups: **Contents**, **Admin**, and **Support**.

**Contents**:

- **API Functions**: Calls to third-party services executed through PolyAPI’s gateway.
- **Server Functions**: Knative-powered serverless functions that run in PolyAPI’s cloud environment.
- **Client Functions**: Functions executed locally or within a shared execution environment.
- **Webhooks & Triggers**: Receiving events and enabling automation.
- **Applications**: Configure and manage **Canopy-powered** UI applications.
- **Schemas & Snippets**: Store reusable structures and prebuilt logic.
- **Variables**: Persist data and secure secrets.
- **Jobs**: Execute background tasks on a schedule.

**Admin:** Manage API keys, environments, users, permissions, etc.

**Support:** Quick access to documentation and assistance.

### Main Content Area

The right-hand panel is dynamic and updates based on the selected item in the sidebar. It follows a structured workflow:

1. Selecting an Item from the Left Navigation

- Selecting a collection (e.g., Server Functions) loads a list of available resources within that collection.
- Depending on the application’s configuration, there may be a “Create” or “Add” button available to add new resources.

2. Hovering for Quick Actions

- When hovering over an item in the list, quick action buttons may appear.
- Action buttons are determined based on the application’s config file for each collection.
- These actions may include things like Execute, Show Logs, Show Details, or other relevant options for a given resource.

[![PolyAPI Canopy Resource List](../_images/canopy-server-funcs-list-new.png)](../_images/canopy-server-funcs-list-new.png)

3. Opening a Detail Page

- Clicking on a list item opens a detailed view for that resource.
- The detail page provides more in-depth information and available actions.
- Actions may include CRUD operations like “Update” and “Delete” along with other collection specific options like “Show logs”, “Execute”, etc.

[![PolyAPI Canopy Detail Page](../_images/canopy-server-func-detail-new.png)](../_images/canopy-server-func-detail-new.png)

### Header Bar

The top bar provides session controls and workflow enhancements:

- **Breadcrumb Navigation**: Displays the current path within a **Canopy application**, allowing easy navigation back to previous sections.
- **Refresh & Sync Button**: Refreshes the current view to ensure the latest real-time data is displayed.
- **Display Mode Button**: Toggle between Light, Dark, or System modes.
- **User Profile & Permissions Button**: located on the far right, click to open your profile detail page.

[![PolyAPI Canopy Header Bar](../_images/canopy-header-bar-new.png)](../_images/canopy-header-bar-new.png)

### Conclusion

By leveraging these structured elements, the **Canopy application** streamlines the process of developing, configuring, and managing PolyAPI components efficiently.
Now that you’re familiar with a **Canopy application**, let’s explore how to [Create a Canopy UI Application](create_application.html) from within PolyAPI’s UI!

---

## copilot/copilot-vscode-install

Source: https://docs.polyapi.io/copilot/copilot-vscode-install.html

# Installing the Copilot Extension

The PolyAPI Copilot Extension is currently only available for VSCode and github.com, availability for other IDEs coming soon. Note that Copilot Extensions entered public beta on Sept. 9, 2024.

Learn more about [Copilot Extensions](https://github.blog/news-insights/product-news/introducing-github-copilot-extensions/)

## Getting the Extension

Let’s head over to GitHub Marketplace and install the [PolyAPI Copilot Extension](https://github.com/apps/polyapi).

1. Sign in to your GitHub account if you haven’t already.
2. Click “Install” which will bring up a page like this:

[![Install & Authorize PolyAPI](../_images/copilot-install-auth.png)](../_images/copilot-install-auth.png)

3. Click “Install & Authorize”.
4. After installing, you will be redirected to the PolyAPI platform login page. If you already have a valid PolyAPI key, then you can jump to step 6, otherwise click “Sign up here” below the login button to signup and get a new API key.
5. To sign up for a PolyAPI account, please refer to the first section of our [Quickstart](../quickstart.html) guide.
6. Grab one of your existing PolyAPI keys or copy your new API key and keep it handy. You will need it later to authenticate the extension to your tenant environment of choice.

## VSCode Setup

OK now let’s jump over to VSCode.

1. Open VSCode.
2. Go to Extensions (on mac Shift+cmd+X).
3. Search for `copilot`
4. Select `GitHub Copilot Chat`
5. Click `Install`

[![Install GitHub Copilot Chat](../_images/copilot-install.png)](../_images/copilot-install.png)

6. May require VSCode restart.

## Conclusion

That’s it! You’re all set up to use the PolyAPI Copilot Extension in VSCode!

Let’s take a look at [Using the Copilot Extension](copilot-vscode-usage.html).

---

## copilot/copilot-vscode-usage

Source: https://docs.polyapi.io/copilot/copilot-vscode-usage.html

# Using the Copilot Extension

Open up VSCode and click on the GitHub Copilot Chat icon (two square speech bubbles) in the sidebar.

You should see a chat interface like this:

[![Copilot Chat Prompt](../_images/copilot-chat-prompt.png)](../_images/copilot-chat-prompt.png)

Here you can use Copilot without any extensions.

## Enable PolyAPI Extension

To enable the PolyAPI Copilot Extension, simply @ mention `polyapi` in the chat.

[![Copilot Chat PolyAPI](../_images/copilot-chat-polyapi.png)](../_images/copilot-chat-polyapi.png)

Before you can interact with our PolyAPI servers, you will need to set your instance (NA1, EU1, etc.) and PolyAPI key using the following command in the chat.

```
@polyapi /setKey <instance> <your-api-key-here>
```

Your instance will be one of the following:

- `NA1`
- `NA2`
- `EU1`

[![Copilot Chat /setKey Confirmation](../_images/copilot-setkey-conf.png)](../_images/copilot-setkey-conf.png)

After clicking “Accept”, you should see a welcome message.

[![Copilot Chat /setKey Update Confirmation](../_images/copilot-welcome.png)](../_images/copilot-welcome.png)

You can also change keys and/or instances at any time by using the same command. Doing so will prompt you to confirm the change.

[![Copilot Chat /setKey Update Confirmation](../_images/copilot-setkey-update-conf.png)](../_images/copilot-setkey-update-conf.png)

Note

You may have different keys for different projects or environments.

Select the key that corresponds to the environment you are working in.

That’s it, you are now ready to chat with PolyAPI!

## Example

Here is an example conversation using the PolyAPI Copilot Extension:

[![PolyAPI Copilot Chat Example](../_images/copilot-usage-example.png)](../_images/copilot-usage-example.png)

## Conclusion

You’ve successfully setup and used the PolyAPI Copilot Extension in VSCode!

Now you can converse with PolyAPI directly in your IDE and get the integration code examples you need right when you need them.

---

## copilot/index

Source: https://docs.polyapi.io/copilot/index.html

# GitHub Copilot Extension

The PolyAPI GitHub Copilot Extension integrates PolyAPI into VSCode’s [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat).

Key Features:

- **Out-of-the-Box Catalog**: Make Copilot aware of Poly’s pre-built integrations with systems like Salesforce, Shopify, Asana, GitHub, HubSpot, Slack, Twilio, Stripe, Adyen, Oracle Opera Cloud, and more, with monthly updates.
- **Private Catalog Search**: Make Copilot aware of your enterprise’s API, event, and function catalog.
- **Real-time Code Generation**: Have Copilot generate accurate, real-time code examples with arguments and response types based on your private catalog.

Let’s begin by installing the PolyAPI Copilot Extension in VSCode!

- [Installing the Copilot Extension](copilot-vscode-install.html)
- [Using the Copilot Extension](copilot-vscode-usage.html)

---

## environments/index

Source: https://docs.polyapi.io/environments/index.html

# Environments

In PolyAPI if you want to separate your functions, variables, etc., you can use environments.

All API keys, functions, variables, etc are scoped to a specific environment.

Individual API Keys only allow access to their specific environment.

Functions and variables in one environment are not accessible from another environment (unless explicitly shared).

Environments can either represent different stages of your application (dev, prod, etc) or different teams or projects.

## Dev vs Prod

The most common separation is to have a development environment and a production environment.

You have one set of functions in development and another in production and hack on the development environment without affecting production.

Almost everything on PolyAPI is associated with a distinct environment, including:

- Functions
- Vari Variables
- API Keys
- Snippets
- Jobs
- Webhooks
- Auth Providers

First we’ll look at how to create and update envrionments in the UI.

Then we will look at how, in your codebase, you can push your functions, variables, etc to a new environment.

- [Managing Environments](ui.html)
- [Pushing to Another Environment](pushing.html)

---

## environments/pushing

Source: https://docs.polyapi.io/environments/pushing.html

# Pushing to Another Environment

Let’s say we have a bunch of functions in our environment named `dev` and want to push them to an environment named `prod`.

In these docs, we’ll go over how!

Note

You’ll need a `prod` api key to push your functions to the `prod` environment.

Head over to [Managing Users and API Keys](../authentication/managing-users-and-api-keys.html) for instructions on how to create a new api key for `prod`!

## Copy Your Vari Variables

The first task is to copy over your `vari` variables.

Right now, this is a fairly manual process.

- Open up one Vari Management tab and login with your `dev` environment credentials
- In a private window or another browser, open up another Vari Management tab and login using your `prod` api key.
- Iterate through your `dev` variables one-by-one and create a new `prod` variable, replacing the `value` of the variables as appropriate (e.g., using `prod` secrets instead of `dev`).

When creating the new `prod` variable, make sure to use the same `context` and `name` as the `dev` variable.

Also be sure to set the visibility of your environment variables as “Environment” so your `prod` variables are not visible in `dev` and vice-versa.

See [Vari Variables](../vari_variables/index.html) for more information on how to manage your variables.

## Replicate Your Api Functions

Next up we will replicate over your API functions from your `dev` environment to your `prod` environment.

To do this you will need to use the `/functions/api/replicate` endpoint. If you are on `na1`, this will be at <https://na1.polyapi.io/functions/api/replicate>

[![Replicate API Functiosn](../_images/replicate.png)](../_images/replicate.png)

Here’s an example payload:

```
{
    "destinationInstanceUrl": "https://na1.polyapi.io",
    "destinationEnvironmentId": "YOUR_PROD_ENVIRONMENT_ID",
    "destinationApiKey": "YOUR_PROD_API_KEY",
    "ids": ["12345", "67890"] // LIST OF FUNCTION IDS TO REPLICATE
}
```

The POST should successfully complete with a 201. You will see a list of the functions that were replicated over.

- Added: means the function did not previously exist in the destination and was added.
- Updated: means the function already existed in the destination and was updated
- Error: means there was an error replicating the function. Please contact [support@polyapi.io](mailto:support%40polyapi.io) for help.

That’s it! You’ve now ported over your API functions from your `dev` environment to your `prod` environment!

## Redeploy Your Server/Client Functions

Next up we will redeploy your server functions you have tested in your `dev` environment to your `prod` environment.

First, let’s go to your folder where you’ve been hacking on your server/client functions.

Now open up each individual file and run the associated `npx poly function add` command.

For example, let’s say you have a file named `echo.ts` containing the following:

```
// npx poly function add echo echo.ts --context test --server
function echo(firstName: string) {
    return `Hello ${firstName}!`;
}
```

To redeploy this function to your `prod` environment, you would:

- Run `npx poly setup`
- Enter your instance url (e.g. <https://na1.polyapi.io>)
- Enter your `prod` api key
- Run `npx poly generate`

Now your Poly CLI is pointing toward your `prod` instance, not your `dev` instance.

Now just iterate over your `npx poly function add` commands and run them:

```
npx poly function add echo echo.ts --context test --server
```

This will deploy your function to your `prod` environment!

When you want to switch back to your `dev` environment, just run `npx poly setup` again and enter your `dev` credentials.

Note

PolyAPI has a new project called Git Glide that will allow you to more easily sync your functions to different environments.

Please contact [support@polyapi.io](mailto:support%40polyapi.io) to get access to Git Glide!

## Conclusion

That’s it! You’ve now pushed your integration from your `dev` environment to your `prod` environment:

- Vari Variables
- API Functions
- Server Functions

Now you are free to unleash your `prod` integrations on your production data.

And continuing hacking on your `dev` environment without fear of breaking anything in production!

---

## environments/ui

Source: https://docs.polyapi.io/environments/ui.html

# Managing Environments

To manage variables on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must be an admin to manage environments.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Environment List

You should see your environments listed like this:

[![Environment List](../_images/environments-list.png)](../_images/environments-list.png)

Your default environment is the one created when you first sign up for Poly.

## Update an Environment

Let’s rename our “default” environment to “dev”.

First click “Show Details” in the Environment List view.

You should see the Environment Detail page:

[![Environment Detail](../_images/environments-list.png)](../_images/environments-list.png)

Then click “Update” and edit the name to “dev”.

Finally, hit “Save” to save your changes.

## Creating an Environment

Now that we have a `dev` environment, let’s also make a `prod` environment!

To go back to the Environment List view, click “Environments” in the left sidebar.

Now click “Create”, enter your new name “prod”, and click “Save”.

You should see the detail page of your new environment:

[![Environment Post Create](../_images/environments-post-create.png)](../_images/environments-post-create.png)

## Conclusion

Congratulations! You’ve created a new `prod` environment!

Next up we’ll look at how to push your functions, variables, etc from your `dev` environment up to your `prod` environment:

- [Pushing to Another Environment](pushing.html)

---

## error_handlers/error-handler-module

Source: https://docs.polyapi.io/error_handlers/error-handler-module.html

# errorHandler Module

The `errorHandler` module allows you to define custom error handling logic for your poly functions within your codebase.

This allows you to watch for errors from functions within your entire PolyAPI instance, and respond to them dynamically.

To register an error handler for a function path:

TypeScript

```
import { errorHandler } from "polyapi";

myErrorHandler = errorHandler.on('myContext.myFunction', (error) => {
  // handle error
});
```

You can also register an error handler for an entire context:

```
import { errorHandler } from "polyapi";

myErrorHandler = errorHandler.on('myContext', (error) => {
  // handle error
});
```

Because the errorHandler.on function returns an unregister function, you can easily remove the error handler by calling it:

```
myErrorHandler();
```

Python

```
from polyapi import error_handler

await error_handler.get_client_and_connect()
await error_handler.on('myContext.myFunction', handler_function)
```

You can also register an error handler for an entire context:

```
from polyapi import error_handler

await error_handler.get_client_and_connect()
await error_handler.on('myContext', handler_function)
```

When you no longer need it, you can unregister all error handlers with the `unregister_all` function:

```
await error_handler.unregister_all()
```

Happy error handling!

---

## error_handlers/error-handler-trigger

Source: https://docs.polyapi.io/error_handlers/error-handler-trigger.html

# Error Handler Triggers

Triggers link Events in one part of PolyAPI from some source to some destination.

This can be used to trigger the execution of a Server Function in response to an error occurring in some other function.

## Getting Started

To manage triggers on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must have the “Manage Triggers” permission to manage triggers.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create an Error Handler Trigger

Click “Triggers” in the sidebar. Then click “+ Create”.

Now, select the “Error Handler” bubble under the Name field, you should see a screen like this:

[![Error Handler creation screen](../_images/error-handler-create.png)](../_images/error-handler-create.png)

You can now select the source you want to watch for errors.

The source can be a one or a combination of four different things: Path, Application ID, User ID, and Function ID.

The trigger will only fire when **all** fields match the source of an error. Thus, the more fields you fill out, the more specific the error source will be.

The only exception to this is that Application IDs and User IDs are only checked when the failed execution has an Application ID or User ID.
Therefore, if a trigger has one of those filters but the execution does not contain the corresponding field, the trigger will still fire.

To finish creating your Error Handler, select a server function to trigger in response to the error and give your Error Handler a name!

Then click “Create” and you’re all set!

---

## error_handlers/index

Source: https://docs.polyapi.io/error_handlers/index.html

# Error Handlers

Error handlers allow you to respond to errors that occur within poly functions with custom logic.
They can either be set up within your code via the `errorHandler` module, or in Canopy with a Trigger.

- [errorHandler Module](error-handler-module.html)
- [Error Handler Triggers](error-handler-trigger.html)

---

## generated_sdks/client_functions

Source: https://docs.polyapi.io/generated_sdks/client_functions.html

# Client Functions

In the Generated SDK language-specific tutorials, we focused on creating and deploying server functions.
When you are just getting started with PolyAPI, it is recommended to focus on server functions as they
are the more common type of function used in applications.

However, PolyAPI also supports client functions, which are useful for organizing code and sharing functionality between different server functions.

## Client Function vs Server Function

To create a “server function”, you use the `--server` option.

This means the function will be deployed to and run on Poly’s FaaS (Functions as a Service) platform.

If you invoke the server function from your local machine:

- an http request will be made to the Poly platform
- the function will run on the Poly platform
- the result will be sent back to your local machine via the http response

You can also use `--client` option to create a client function.

Client functions are run directly in whatever client they are called in.

So if you call them on your local machine, the code will run on your local machine.

But if you call them inside a server function, the code will run on the FaaS platform in the context of that server function.

Generally speaking, client functions are used for things like small utility functions. They are just a way for you to better organize your code
and share functionality between different server functions.

Server functions meanwhile are standalone units of functionality that can be called from anywhere or scheduled to run at certain times or triggered by webhooks.
They will generally call one or more api functions, perform some logic, and return a result.

## Client Function Benefits

In theory, you could just use server functions for everything!

But the primary benefit of client functions is speed and cost.

Because the code executes locally in your server function (or wherever you call it from), there is no overhead from a network request.

Also, PolyAPI usage is generally billed by the number of server function executions (among other things).

Client functions are effectively “free” to run, whereas another server function execution would count against your usage.

But there are three big caveats to using client functions:

## Caveat 1: Client Functions are Same-Language Only

You can ONLY use client functions from the same language as your server function. Or if you are executing outside of a server function, the same language as your SDK.

In other words, Typescript client functions can only be used in Typescript server functions, and Python client functions can only be used in Python server functions.

Tip

If you want to use a client function in a different language, the Poly AI Assistant is pretty great at converting simple client functions from language A to language B!

Then you can just have myClientFunctionTs.ts and myClientFunctionPy.py in your project, and call the appropriate one depending on your server function’s language!

## Caveat 2: Client Functions Cannot Resolve Vari Inject

Client functions cannot resolve Vari `.inject()` parameters, because they do not go through the Gateway.

For example, if you have a server function that uses a Vari variable like this:

```
import { vari } from "polyapi";

export async function myServerFunction() {
    const myVariable = vari.myVariable.inject();
    return await myClientFunction(myVariable);
}
```

The value of the vari variable myVariable will not be directly available in the client function myClientFunction.

This means to access the variable value, you need to inject the variable into the server function arguments, then pass it to the client function.

```
import { vari } from "polyapi";

export async function myServerFunction(myVariable: string) {
    return await myClientFunction(myVariable);
}
```

Often however, the client function ONLY needs an injected variable to pass it on to another API function.

```
import poly, { vari } from "polyapi";

export async function myClientFunction(myVariableInjected) {
    return await poly.myApiFunction(myVariableInjected);
}
```

In this case, it is fine to pass the variable to the client function using `vari.myVariable.inject()` because the variable will be
resolved at the Gateway by the API function.

The actual client function itself doesn’t need to know the value of the variable, it just needs to pass it on to the API function!

## Caveat 3: Client Function Dependencies Must be Imported in the Server Function

Client functions are not automatically added into the server function image itself yet.

So if you want to use a statement like `import pg from "pg"` in your client function, you need to also import it in your server function.

In the future, this will be automated, but for now, the developer is responsible for ensuring that all dependencies used in client functions
are also imported in the server function.

## Conclusion

As long as you keep in mind the caveats, client functions are a great way to
organize your code and share functionality between different server functions,
without incurring any extra cost or runtime speed penalty!

---

## generated_sdks/dotnet

Source: https://docs.polyapi.io/generated_sdks/dotnet.html

# .NET (Beta)

## Install

Important

PolyAPI requires .NET SDK and several other dependencies.

Head over to [Versions](../versions.html) to see all the dependencies and install them!

First things first, let’s install the PolyAPI .NET Tool!

Create a new poly project:

```
$ mkdir my-poly-project
$ cd my-poly-project
```

Run this command to install the PolyAPI .NET Tool into your project:

```
$ dotnet new tool-manifest
$ dotnet tool install --local PolyApi.Tools
```

## Setup and Generate

First configure your client:

```
$ dotnet tool run polyapi setup
```

Enter your server URL and API Key when prompted.

Now bootstrap your console application:

```
$ dotnet new console
```

Next, let’s go ahead and retrieve all the trained Poly functions and generate the .NET SDK for them:

```
$ dotnet tool run polyapi generate
```

Warning

Be sure to add the folder `PolyApiGenerated` (your generated Poly library) to your `.gitignore` file.

You build pipeline should regenerate this code in each environment. It should not be added directly to your git repo.

Your API key is also stored under `PolyApiGenerated/Config.g.cs`. Do not commit this file to your git repo.

## Run First Function

Open the file called `Program.cs` and add the following code:

```
using PolyApi.PolyContext;

var todos = await Poly.jsonPlaceholder.todos.getList();

Console.WriteLine(todos.Data.Aggregate("", (acc, todo) => acc + $"{todo.Id}: {todo.Title}\n"));
```

Now run your project:

```
$ dotnet run
```

This will run your first PolyAPI function and print the results to the console.

Note

If you get an error that the function does not exist, you probably just don’t have it in your Poly instance yet.
Head over to [Using Postman](../api_functions/postman.html) to see how to add this function!

## Onward

That’s it! You have now:

- Setup your .NET SDK
- Ran your first API function

This is the last step on the guided tour of Poly.

To further explore aspects of Poly and what it can do, head over to [Next Steps](../next_steps.html).

---

## generated_sdks/index

Source: https://docs.polyapi.io/generated_sdks/index.html

# Generated SDKs

Poly uses your trained functions, webhooks, and variables
(as well as public functions, webhooks, and varibles)
and generates an easy-to-use SDK in your language of choice!

Select your preferred language to continue:

- [Python](python.html)
- [TypeScript (Node)](typescript.html)
- [Java](java.html)
- [.NET (Beta)](dotnet.html)
- [Client Functions](client_functions.html)

Note

We plan to add many more languages!

Please [reach out](mailto:support%40polyapi.io) if you would like us to prioritize support for your language!

---

## generated_sdks/java

Source: https://docs.polyapi.io/generated_sdks/java.html

# Java

## Install

First things first, let’s make sure the correct versions of Java and Maven are installed.

Head over here and install the Java and Maven versions listed:

[Versions](../versions.html)

Next, let’s create a totally new Maven project for testing.

```
mvn archetype:generate -DgroupId=com.mycompany.app -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DarchetypeVersion=1.4 -DinteractiveMode=false
```

Now, open the `pom.xml` file, delete its contents, and replace it with the following:

```
<?xml version="1.0" encoding="UTF-8"?>

<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.mycompany.app</groupId>
  <artifactId>my-app</artifactId>
  <version>1.0-SNAPSHOT</version>

  <name>my-app</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
    <poly.version>0.15.1</poly.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>io.polyapi</groupId>
      <artifactId>library</artifactId>
      <version>${poly.version}</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
  <build>
    <resources>
      <resource>
        <directory>target/generated-resources</directory>
      </resource>
    </resources>
    <plugins>
      <plugin>
        <groupId>io.polyapi</groupId>
        <artifactId>polyapi-maven-plugin</artifactId>
        <version>${poly.version}</version>
        <configuration>
          <host>{HOST}</host>
          <port>443</port>
          <apiKey>${env.POLY_API_KEY}</apiKey>
        </configuration>
        <executions>
          <execution>
            <phase>generate-sources</phase>
            <goals>
              <goal>generate-sources</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.12.1</version>
        <configuration>
          <parameters>true</parameters>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>build-helper-maven-plugin</artifactId>
        <version>3.2.0</version>
        <executions>
          <execution>
            <id>add-source</id>
            <phase>generate-sources</phase>
            <goals>
              <goal>add-source</goal>
            </goals>
            <configuration>
              <sources>
                <source>target/generated-sources</source>
              </sources>
            </configuration>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
</project>
```

Next:

- Replace `{HOST}` with the server you’re connecting to (e.g. <https://na1.polyapi.io>)
- Create a new environment variable named `POLY_API_KEY` with its value as your api key.
  The code `{$env.POLY_API_KEY}` in the above example will pull from your api key from the environment.

Warning

The `pom.xml` file is generally checked into git. Be sure to not check in your api key. Instead, use an environment variable as shown above.

Then run this command to ensure the library is installed:

```
mvn clean compile
```

## Develop First Function

Next, let’s develop our first custom function!

In your project, create a new Java file named `Greetings.java` next to `App.java` in `./my-app/main/java/com/mycompany/app` with the following contents:

```
package com.mycompany.app;

import io.polyapi.commons.api.model.PolyServerFunction;

public class Greetings {

  @PolyServerFunction(context="greetings")
  public String hello(String name) {
    return String.format("Hello %s", name);
  }
}
```

Next use the PolyAPI Maven plugin to deploy this function:

```
mvn clean compile polyapi:deploy-functions
```

This will deploy a new server function to Poly. You can also instead use the `@PolyClientFunction` annotation instead of `@PolyServerFunction` to create functions which are packaged into the generated SDK.

## Run First Function

To generate the code invocation of an uploaded server function you need to compile the project once again:

```
$ mvn clean compile
```

Now let’s execute the function. Go back to your `App.java` file that was generated and replace its contents with the following:

```
package com.mycompany.app;

import io.polyapi.Poly;

public class App {

  public static void main(String[] args) {
    System.out.println(Poly.greetings.hello("Alice"));
  }
}
```

Note

Keep in mind that the Poly invocation follows the structure:

`Poly.[function context].[function name](...)`

To customize those values, the `@PolyServerFunction` or `@PolyClientFunction` annotations provide the `name` and `context` arguments.

We used the `context` argument `"greetings"` in the example above.

We did not specify a `name` argument, so by default the function name became the method name `hello`.

Finally run the java app with the following command:

```
mvn exec:java -Dexec.mainClass="com.mycompany.app.App" -Dexec.cleanupDaemonThreads=false
```

You should see the following output:

```
Hello Alice
```

Congratulations! You have successfully created and executed your first server function.

## Add Custom dependencies

To add custom dependencies to your project, modify the pom.xml file in the root of your project. You can add dependencies under the <dependencies> section.
For example let’s add Apache Commons Lang (a popular utility library) and implement StringUtils.capitalize() in our custom function:

First update pom.xml with the following:

```
<dependencies>
  <dependency>
    <groupId>org.example</groupId>
    <artifactId>my-custom-library</artifactId>
    <version>1.0.0</version>
  </dependency>
</dependencies>
```

Next, update the hello function to use the StringUtils.capitalize() method.

```
package com.mycompany.app;

import org.apache.commons.lang3.StringUtils;

import io.polyapi.commons.api.model.PolyServerFunction;

public class Greetings {

  @PolyServerFunction(context="greetings")
  public String hello(String name) {
    return String.format("Hello %s", StringUtils.capitalize(name));
  }
}
```

Install the new dependency and redeploy the function:

```
mvn clean compile polyapi:deploy-functions
```

Let’s try it out with a different lowercase name in App.java:

```
package com.mycompany.app;

import io.polyapi.Poly;

public class App {

  public static void main(String[] args) {
    System.out.println(Poly.greetings.hello("bob"));
  }
}
```

Execute the function again:

```
mvn exec:java -Dexec.mainClass="com.mycompany.app.App" -Dexec.cleanupDaemonThreads=false
```

You should see the following output:

```
Hello Bob
```

Notice the capitalization of the name.
That’s it! You’ve successfully added a custom dependency and used it in your custom function.

## Onward

That’s it! You have now:

- Setup your Java SDK
- Trained your first server function
- Ran your first server function

This is the last step on the guided tour of Poly.

To further explore aspects of Poly and what it can do, head over to [Next Steps](../next_steps.html).

---

## generated_sdks/python

Source: https://docs.polyapi.io/generated_sdks/python.html

# Python

## Venvs

Virtual environments (or venvs) allow Python projects to have isolated dependencies and packages, which can help prevent conflicts between projects and package versions.

There are two ways to set up a virtual environment in VSCode.

## Creating a Virtual Environment via VSCode - Recommended

If you use VSCode, the first and best way to create a venv is through VSCode. The steps are:

- press Ctrl-Shift-P (or Cmd-Shift-P on Mac) to open the command palette
- search for ‘Python: Create Environment’
- select Venv
- either select a Python interpreter or enter the path to one.

[![Example view of how to create a venv in VSCode](../_images/vscode-python-create-venv.png)](../_images/vscode-python-create-venv.png)

We recommend selecting Python 3.12 as that is the version with the best support for PolyAPI as of 2025-09-01.

## Creating a Virtual Environment via CLI

The other way to create a venv is via the terminal by creating a folder for your environment and running:

```
$ python -m venv /path/to/new/virtual/environment
```

This method is NOT recommended if you are using VSCode, as VSCode Intellisense will not play nicely with venvs created this way
unless you do additional setup.

## Using a Virtual Environment

If you are using a venv created via VSCode, you can skip this section as VSCode will automatically activate the venv for you when you open a new terminal inside VSCode.

If you see the pink text matching your project name in the VSCode terminal prompt, you are good to go!

Otherwise, if you created your venv via the terminal, you will need to activate it manually with one of the following commands:

(Replace ‘venv’ with the name of your virtual environment):

Linux/MacOS:

```
$ source venv/bin/activate
```

Windows Powershell:

```
$ ./venv/Scripts/Activate.ps1
```

Windows Command Prompt:

```
$ call venv/Scripts/activate
```

Windows Git Bash:

```
$ source venv/Scripts/activate
```

After activating your virtual environment, you may see the name of the active environment in your terminal like so:

[![Example view of a terminal with an active virtual environment](../_images/venv-terminal-example.png)](../_images/venv-terminal-example.png)

To ensure that your virtual environment is working properly, you can run this command while your environment is active:

```
$ which python
```

If the returned path points to your virtual environment, you are good to go!

To leave your venv, use this command:

```
$ deactivate
```

For more information about virtual environments, see the official [Python documentation.](https://docs.python.org/3/library/venv.html)

## Install

Now, let’s install the Python library!

(If you already installed the VSCode extension, the extension setup may have already installed the library.)

Run this command to ensure the python library is installed:

```
$ pip install polyapi-python
```

Caution

Please be sure to install the correct polyapi pypi package `polyapi-python`, as there are other registered packages with similar names.

Note

If you see an error like this:

```
ERROR: Could not find a version that satisfies the requirement polyapi-python (from versions: none)
ERROR: No matching distribution found for polyapi-python
```

Or like this:

```
ERROR: Ignored the following versions that require a different python version
```

It’s probably because you are using an older version of Python!

Use `python --version` to check your Python version. `polyapi-python` requires Python 3.10 or higher.

Warning

On MacOS, as of 2024-10-28, Python 3.13 (released on 2024-10-07) does not work very well yet.

We recommend using Python 3.12 for now.

## Setup and Generate

Next, we need to make sure the PolyAPI Python client is properly configured:

```
$ python -m polyapi setup
```

Enter your server and API Key when prompted.

Next, let’s go ahead and retrieve all the trained Poly functions and generate the Python SDK for them:

```
$ python -m polyapi generate
```

You can also generate an SDK with specific contexts using the `--contexts` parameter:

```
$ python -m polyapi generate --contexts "context1,context2,context3"
```

The generation process will:

- Only fetch specifications for the specified contexts
- Generate Python files for the resources in those contexts
- Create a context-aware directory structure where resources are organized by their contexts
- Generate appropriate index files that expose the resources in a hierarchical structure

This is particularly useful when you want to:

- Generate a smaller, more focused SDK
- Only include specific parts of your API
- Reduce the size of the generated code
- Improve build times by excluding unused contexts

Warning

Your api key is stored inside your PolyAPI library wherever it is installed (usually `site_packages`) in a file name `.config.env`

Do not commit this file to your git repo.

## Develop First Function

Next, let’s develop our first custom function!

Open a new file called `hello.py` and add the following code:

```
def hello():
    return "Hello Poly World!"
```

Next use the PolyAPI Python SDK to deploy this function:

```
$ python -m polyapi function add hello hello.py --context mycontext --server
```

You should get back output like this:

```
Adding custom server side function... DEPLOYED
Function ID: 1111111-73ae-4463-aaa4-fdbdc9accd62
Generating TypeScript SDK...DONE
```

That’s it! You’ve now deployed your first server function!

Note

**Setting Runtime API Key**

You can specify a runtime API key for your function using the `--execution-api-key` parameter:

```
$ python -m polyapi function add hello hello.py --context mycontext --server --execution-api-key my-api-key
```

This is particularly useful when you want to specify an API key with specific permissions that the developer deploying the function might not necessarily possess. The runtime API key will be used when the function executes, allowing for more granular permission control.

[Client Functions](client_functions.html) are another type of PolyAPI function that can be deployed in a similar way with the `--client` option.

## Run First Function

Finally, let’s open a new file called “run.py” and add the following code:

```
from polyapi import poly
print(poly.mycontext.hello())
```

Now run the python file:

```
$ python run.py
```

You should see “Hello Poly World!” printed in the console!

## Using Logs

When testing or debugging server functions, it can be helpful to log information. However, print statements will not show up in the console, as the function is being executed on the server instead of in your console. Lets create a function with a print to demonstrate!

```
def hello():
   print("Hello Poly World!")
   return "Hello Poly World!"
```

After deploying and running this function, you can find this log by clicking on the ‘Show logs’ button on your function in canopy.

## Onward

That’s it! You have now:

- Setup a virtual environment
- Setup your Python SDK
- Trained your first server function
- Ran your first server function
- Learned how to log information

This is the last step on the guided tour of Poly.

To further explore aspects of Poly and what it can do, head over to [Next Steps](../next_steps.html).

---

## generated_sdks/typescript

Source: https://docs.polyapi.io/generated_sdks/typescript.html

# TypeScript (Node)

## Install

First things first, let’s install the TypeScript library!

(If you already installed the VSCode extension, the extension setup may have already installed the Tyepscript library.)

Run this command to ensure the TypeScript library is installed:

```
$ npm install polyapi@na1
```

If you are not using `na1`, replace `na1` with whatever instance you are using. For example, if you are using the `eu1` instance, run `npm install polyapi@eu1`.

Important

PolyAPI requires a recent version of NodeJS. Head over to the [Versions](../versions.html) page to see the current supported versions.

Note

You may encounter an EACCESS error trying to `npm install polyapi`.

```
npm error [Error: EACCES: permission denied, open '/home/username/foo/package.json']
npm error The operation was rejected by your operating system.
npm error It is likely you do not have the permissions to access this file as the current user
```

These errors usually come from mixing `sudo npm install` and `npm install` commands.

If you are experiencing permission issues, PolyAPI recommends the following:

- open a new terminal
- create a new folder and cd into it
- run `npm init`
- run `npm install polyapi` WITHOUT sudo

In most cases, that should resolve the issues.

If you still see EACCESS issues, please read the npm error message carefully. Oftentimes the problem is
with your npm cache and npm recommends the command you need to fix the cache permissions issues.

If you continue to experience issues, please email us at [support@polyapi.io](mailto:support%40polyapi.io).

## Setup and Generate

First configure your client:

```
$ npx poly setup
```

Enter your server and API Key when prompted.

Note

This command will also request for you to install/update some dependencies like ts-node and TypeScript.

Next, let’s go ahead and retrieve all the trained Poly functions and generate the TypeScript SDK for them:

```
$ npx poly generate
```

You can also generate an SDK with specific contexts and resources using additional parameters:

- `--contexts`: Filter by specific contexts (comma-separated list)
- `--names`: Filter by specific resource names
- `--functionIds`: Filter by specific function IDs

For example:

```
$ npx poly generate --contexts "myContext,otherContext" --names "function1,function2"
```

The generation process will:

- Only fetch specifications for the specified contexts
- Generate JavaScript files for the resources in those contexts
- Generate TypeScript type definitions
- Create a context-aware directory structure where resources are organized by their contexts
- Generate appropriate index files that expose the resources in a hierarchical structure

This is particularly useful when you want to:

- Generate a smaller, more focused SDK
- Only include specific parts of your API
- Reduce the size of the generated code
- Improve build times by excluding unused contexts

Warning

Please be sure to add `node_modules` to your `.gitignore` file.

Not only is it good practice in general, with PolyAPI your api key is stored in `node_modules/.poly/.config.env` so you can quickly
run `npx poly generate` (and other commands) without having to re-enter your api key each time.

So be sure to add `node_modules` to your `.gitignore` file to avoid accidentally committing your api key to your git repo.

## Deploy Your First Function

Next, let’s deploy our first custom function!

Helpful Resources

[First 200 with Poly Video](https://www.youtube.com/watch?v=tSjOBVGOiE8&list=PLrMPJ9Jjy1LTtT4rAGAOHhPgcZK63ts3-&index=3)

[Deploying an Integration to run on Poly Server Video](https://www.youtube.com/watch?v=mn__7Lr-IbE&list=PLrMPJ9Jjy1LTtT4rAGAOHhPgcZK63ts3-&index=5)

Open a new file called `hello-world.ts` and add the following code:

```
async function helloWorld(): string {
    return 'Hello Poly World!';
}
```

Next use the PolyAPI TypeScript SDK to deploy this function:

```
$ npx poly function add helloWorld ./hello-world.ts --context "myContext" --server
```

You should get back output like this:

```
Adding custom server side function... DEPLOYED
Function ID: 1111111-73ae-4463-aaa4-fdbdc9accd62
Generating TypeScript SDK...DONE
```

That’s it! You’ve now deployed your first server function!

Note

**Setting Runtime API Key**

You can specify a runtime API key for your function using the `--execution-api-key` parameter:

```
$ npx poly function add helloWorld ./hello-world.ts --context "myContext" --server --execution-api-key my-api-key
```

This is particularly useful when you want to specify an API key with specific permissions that the developer deploying the function might not necessarily possess. The runtime API key will be used when the function executes, allowing for more granular permission control.

## Advanced Deployment Options

The `npx poly function add` command supports several additional options to customize your function deployment:

**PolyAPI Library Caching**

By default, server functions load the PolyAPI library on each invocation. For improved performance, you can enable caching of the PolyAPI library:

```
$ npx poly function add helloWorld ./hello-world.ts --context "myContext" --server --cache-poly-library=true
```

When `--cache-poly-library=true` is specified:

- The PolyAPI library is cached in the function’s runtime environment
- Subsequent function invocations can reuse the cached library, improving cold start performance
- The cached library is regenerated when the function is redeployed (either via CLI or the UI)
- The default value is `false` to maintain backward compatibility

Note

Library caching is particularly beneficial for functions that are called frequently or need faster cold start times.

[Client Functions](client_functions.html) are another type of PolyAPI function that can be deployed in a similar way with the `--client` option.

Note

In Typescript, for [Client Functions](client_functions.html), you can choose to make your function `async` or not depending on what is appropriate.

For server functions, you can do the same, but in general, it is appropriate to make your server functions `async`
so that you can use `await` to call other async functions. All API functions in the TypeScript Poly SDK are async and generally
a server function will call at least one API function.

## Run First Function

Finally, let’s open a new file called `index.ts` and add the following code:

```
import poly from 'polyapi';

(async () => {
    console.log(await poly.myContext.helloWorld());
})();
```

Now run your file:

```
$ npx ts-node ./index.ts
```

The function will run and you should see “Hello Poly World!” printed in the console.

## Glide Farther

Deploying one-off functions with `npx poly function add` is a good approach for smaller integration projects
that run in a single environment (i.e. production) and won’t be updated frequently.

But it won’t scale well as you add more functions, multiple environments, and a team of people writing and deploying these functions.

To make building and deploying at scale easier, we’ve put together Project Glide, which lets you integrate PolyAPI more deeply
into your git-based workflow backed by Github or Gitlab.

With a pre-commit hook in git, we can write functions and Poly will detect them automatically, validate them, and document them before we commit them.

And then once committed, the PolyAPI deployment action on Github or Gitlab picks up all our functions and deploys them to Poly.

See documentation in [Project Glide](../project_glide/index.html) to learn more and to setup this workflow.

## Onward

That’s it! You have now:

- Setup your Typescript SDK
- Trained your first server function
- Ran your first server function

This is the last step on the guided tour of Poly.

To further explore aspects of Poly and what it can do, head over to [Next Steps](../next_steps.html).

---

## graphql_subscriptions/index

Source: https://docs.polyapi.io/graphql_subscriptions/index.html

# GraphQL Subscriptions

GraphQL subscriptions let Poly keep a long-lived connection open to an upstream provider and invoke one of your Poly server functions whenever the provider pushes a new event.

Use GraphQL subscriptions when a provider exposes an event stream over GraphQL and you want Poly to manage the connection lifecycle, authentication handoff, and delivery into your own processing function.

PolyAPI currently exposes two GraphQL subscription types:

- `CUSTOM` for general provider-managed GraphQL streams.
- `OHIP` for Oracle Hospitality Integration Platform streams, which have additional replay, offset, and keep-alive rules.

Start with the general guide if you are creating or managing subscriptions for the first time. Use the OHIP guide when you need Oracle-specific subscription behavior.

- [Managing GraphQL Subscriptions](managing-subscriptions.html)
- [OHIP GraphQL Subscriptions](ohip-subscriptions.html)

---

## graphql_subscriptions/managing-subscriptions

Source: https://docs.polyapi.io/graphql_subscriptions/managing-subscriptions.html

# Managing GraphQL Subscriptions

GraphQL subscriptions are managed through Poly’s REST API and documented in Swagger on your instance.

Head to Swagger for your instance:

`/swagger`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/swagger>

Authorize with your API key before trying the endpoints.

Note

You must have the “Manage GraphQL Subscriptions” permission to create, update, or delete GraphQL subscriptions.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need this permission added.

## What a GraphQL Subscription Includes

Each GraphQL subscription tells PolyAPI:

- which upstream GraphQL endpoint to connect to
- which subscription query to run
- which Poly server function should receive the events
- whether the subscription should currently be enabled
- which provider-specific options should be used for connection parameters or replay behavior

Core subscription fields include:

- `name` and `context`
- `type`
- `transportProtocol`
- `websocketUrl`
- `query`
- `functionId`
- `enabled`

Optional fields such as `description`, `visibility`, `paramsVariableId`, `paramsSfxId`, `paramsObject`, and `functionParams` let you adapt the subscription to your provider and event handler.

## Subscription Types

PolyAPI currently supports these GraphQL subscription types:

- `CUSTOM` for general-purpose provider streams.
- `OHIP` for Oracle Hospitality Integration Platform event streams.

OHIP subscriptions expose additional fields for replay control and persisted checkpoint handling. See [OHIP GraphQL Subscriptions](ohip-subscriptions.html) for the OHIP-specific behavior and delivery guarantees.

## REST API

GraphQL subscriptions are managed through the following endpoints:

```
GET    /subscriptions/graphql
GET    /subscriptions/graphql/{id}
POST   /subscriptions/graphql
PATCH  /subscriptions/graphql/{id}
DELETE /subscriptions/graphql/{id}
```

Use Swagger on your instance for the current request and response schema details.

## Creating a Custom GraphQL Subscription

The following example creates a `CUSTOM` GraphQL subscription that forwards provider events into an existing Poly server function:

```
curl --request POST 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "ShopifyOrdersStream",
    "context": "shopify.orders.stream",
    "type": "CUSTOM",
    "visibility": "ENVIRONMENT",
    "transportProtocol": "WS",
    "websocketUrl": "wss://example-provider.com/graphql",
    "query": "subscription OrderUpdates { orderUpdated { id status updatedAt } }",
    "functionId": "YOUR_SERVER_FUNCTION_ID",
    "enabled": true
  }'
```

This payload focuses on the minimum fields you will usually need. Add the optional parameter fields only when your provider requires them.

Tip

Keep the target server function small, observable, and safe to retry. An upstream provider, a transport reconnect, or your own recovery logic may cause a subscription event to be delivered more than once.

## Listing and Inspecting Subscriptions

Use the list endpoint to retrieve all GraphQL subscriptions in the current environment:

```
curl --request GET 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

Use the detail endpoint when you want the full resource, including OHIP checkpoint fields when applicable:

```
curl --request GET 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

## Updating a Subscription

Use `PATCH /subscriptions/graphql/{id}` to change the target function, rename the subscription, update the query, or enable and disable the stream.

For example, this request disables a subscription without deleting it:

```
curl --request PATCH 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "enabled": false
  }'
```

For OHIP subscriptions, the update endpoint is also where you choose whether the next start should use the provider’s latest event or the last persisted Poly checkpoint. That behavior is covered in [OHIP GraphQL Subscriptions](ohip-subscriptions.html).

## Deleting a Subscription

Delete a subscription when you no longer want PolyAPI to maintain the upstream connection:

```
curl --request DELETE 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED'
```

Deleting removes the managed subscription resource. If you only want to pause delivery temporarily, prefer `PATCH` with `"enabled": false`.

## Conclusion

GraphQL subscriptions give PolyAPI a managed way to receive provider-pushed events and hand them to your own server function.

Start with the general REST management flow on this page, then move to [OHIP GraphQL Subscriptions](ohip-subscriptions.html) if you are integrating with Oracle OHIP.

---

## graphql_subscriptions/ohip-subscriptions

Source: https://docs.polyapi.io/graphql_subscriptions/ohip-subscriptions.html

# OHIP GraphQL Subscriptions

OHIP subscriptions are a specialized GraphQL subscription type in PolyAPI for Oracle Hospitality Integration Platform streaming events.

Compared to a general `CUSTOM` subscription, OHIP streams have stricter rules around keep-alives, disconnection, replay, and offsets. PolyAPI exposes OHIP-specific fields so you can control how the stream starts and whether Poly should persist an exact replay checkpoint after successful event handling.

Warning

OHIP delivery in PolyAPI is **at-least-once**.

It is **not exactly-once** and **not “only-once.”**

A replay, reconnect, recovery restart, or uncertainty around the last successfully processed checkpoint can cause the same event to be delivered more than once.

## Delivery Guarantees

When `ohipMaintainOffset` is enabled, PolyAPI persists the last successfully handled OHIP offset after your server function finishes processing the event.

That persisted checkpoint is the practical acknowledgment boundary, but it does **not** turn the stream into exactly-once delivery. If the connection drops, if a restart happens mid-recovery, or if an event is replayed from the last known checkpoint, your handler may observe the same event more than once.

Treat OHIP consumers as idempotent:

- use `metadata.uniqueEventId` to deduplicate work where possible
- make downstream writes safe to retry
- maintain your own poison-message / DLQ path for events that cannot be processed safely

Note

PolyAPI does not provide an exactly-once acknowledgment protocol or a server-managed DLQ for OHIP streams.

## Build the Query for Checkpointing

If you set `ohipMaintainOffset=true`, your subscription query must select `metadata.offset`.

PolyAPI strongly recommends also selecting `metadata.uniqueEventId` so your handler can implement idempotency and better troubleshooting.

Example OHIP query:

```
"query": "subscription StreamUpdates { newEvent(input: { chainCode: \"CHA\" }) { moduleName eventName primaryKey timestamp metadata { offset uniqueEventId } detail { elementName oldValue newValue } } }"
```

## Create-Time Offset Options

OHIP create requests support two starting modes:

- `ohipOffsetSelection = "PROVIDER_HIGHEST"`
- `ohipOffsetSelection = "SPECIFIC"`

Use `PROVIDER_HIGHEST` when you want the provider to start from its current highest event and you do not want to replay older retained events.

Use `SPECIFIC` when you want to replay from an exact previously observed OHIP offset. In that case, `ohipOffset` is required.

## Start from Provider Highest

This example starts from the provider’s current highest event and tells PolyAPI to persist future checkpoints after successful handling:

```
curl --request POST 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "name": "OperaEventsLatest",
    "context": "opera.events.latest",
    "type": "OHIP",
    "visibility": "ENVIRONMENT",
    "transportProtocol": "WS",
    "websocketUrl": "wss://YOUR_OHIP_STREAM/graphql",
    "query": "subscription StreamUpdates { newEvent(input: { chainCode: \"CHA\" }) { moduleName eventName metadata { offset uniqueEventId } detail { elementName oldValue newValue } } }",
    "functionId": "YOUR_SERVER_FUNCTION_ID",
    "ohipOffsetSelection": "PROVIDER_HIGHEST",
    "ohipMaintainOffset": true,
    "enabled": true
  }'
```

## Start from a Specific Offset

This example replays from a previously observed OHIP checkpoint:

```
curl --request POST 'https://na1.polyapi.io/subscriptions/graphql' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "name": "OperaEventsReplay",
    "context": "opera.events.replay",
    "type": "OHIP",
    "visibility": "ENVIRONMENT",
    "transportProtocol": "WS",
    "websocketUrl": "wss://YOUR_OHIP_STREAM/graphql",
    "query": "subscription StreamUpdates { newEvent(input: { chainCode: \"CHA\" }) { moduleName eventName metadata { offset uniqueEventId } } }",
    "functionId": "YOUR_SERVER_FUNCTION_ID",
    "ohipOffsetSelection": "SPECIFIC",
    "ohipOffset": "4815",
    "ohipMaintainOffset": true,
    "enabled": true
  }'
```

## Update-Time Offset Options

OHIP update requests support these restart choices:

- `ohipOffsetSelection = "PROVIDER_HIGHEST"`
- `ohipOffsetSelection = "PERSISTED"`

Use `PERSISTED` when you want the next start to resume from the last successfully persisted Poly checkpoint.

If no checkpoint has been stored yet, `PERSISTED` is invalid and the request fails.

## Resume from the Persisted Checkpoint

The following request tells PolyAPI to resume an OHIP subscription from the last persisted checkpoint and continue maintaining checkpoints afterward:

```
curl --request PATCH 'https://na1.polyapi.io/subscriptions/graphql/YOUR_SUBSCRIPTION_ID' \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --header 'x-otp: YOUR_OTP_IF_REQUIRED' \
  --data '{
    "ohipOffsetSelection": "PERSISTED",
    "ohipMaintainOffset": true
  }'
```

If you instead want to discard backlog and jump to the provider’s current latest event, use `"ohipOffsetSelection": "PROVIDER_HIGHEST"`.

## Offsets Are Opaque

Warning

Oracle states that OHIP offsets are non-linear. Treat them as opaque checkpoints, not arithmetic counters.

Do **not**:

- increment an offset by one
- subtract one offset from another
- infer exact event distance from the numeric-looking value
- assume a manually derived offset will reconnect safely

Use only offsets that you actually received from OHIP or that PolyAPI previously persisted for the subscription.

## Replay and Retention

OHIP retains replayable events for a bounded period. If you reconnect with an offset older than the retained history, OHIP may resume from the oldest event it still retains instead of the exact offset you requested.

OHIP also supports a provider-side “highest” start mode that skips older retained events and starts from the newest available event.

Choose the starting mode based on your business requirement:

- use `PROVIDER_HIGHEST` when you only care about the latest state going forward
- use a specific or persisted offset when historical continuity matters

## Replay Overload Guard

PolyAPI includes a runtime guardrail to reduce the chance that a very old offset or a very large replay burst overwhelms the subscription consumer.

Note

This runtime guard is a protective safety measure. It is **not** a general backpressure solution and it does **not** upgrade OHIP from at-least-once delivery to exactly-once delivery.

Warning

Reconnecting from a very old offset can trigger a large replay burst. If that burst exceeds PolyAPI’s replay-overload threshold while the subscription is running without persisted checkpoint recovery, PolyAPI may disable the subscription to protect the consumer.

If `ohipMaintainOffset=true`, PolyAPI first tries to restart from the last persisted checkpoint instead of disabling immediately. If no persisted checkpoint exists, or if overload recovery keeps repeating without forward progress, the subscription can still be disabled.

You should still design your consumer to:

- buffer before writing to downstream systems
- tolerate replayed events
- keep processing idempotent
- move poison events into your own DLQ or operator workflow

## Operational Best Practices

PolyAPI’s OHIP runtime is designed to align with Oracle’s published streaming best practices. In practice, this means Poly:

- keeps the stream connected instead of treating OHIP as a polling-style integration
- sends the client keep-alives needed to keep the stream open
- follows the `complete` shutdown flow during graceful disconnects
- waits before resubscribing after a graceful disconnect
- coordinates ownership so only one active Poly consumer reads a given OHIP stream identity at a time
- detects replay overload and uses restart or disable paths to avoid unbounded burst pressure on the consumer

The main things you still need to design for in your own handlers are:

- model the consumer as at-least-once
- make the handler idempotent
- buffer or otherwise absorb bursts before writing to downstream systems
- keep track of `uniqueEventId`
- treat the offset as an opaque checkpoint

## Conclusion

OHIP subscriptions give PolyAPI a managed way to consume Oracle streaming events, but the stream still carries Oracle’s operational constraints and replay semantics.

If you need durable recovery, enable `ohipMaintainOffset`, include `metadata.offset` and `metadata.uniqueEventId` in the query, and design the target function for at-least-once delivery rather than exactly-once processing.

---

## index

Source: https://docs.polyapi.io/index.html

# The PolyAPI Documentation

**PolyAPI** is an Integration Platform as a Service (IPaaS) that simplifies the operation of integrations, orchestrations, and microservices in the language of your choice.

PolyAPI gives you:

- A Cloud-agnostic serverless platform for integrations and observability.
- A unified gateway for events, webhooks, APIs, and serverless functions.
- An AI assistant and custom SDKs to simplify API exploration, documentation, and integration.
- A web portal for managing resources and hosting custom apps.
- And much more!

Check out our [main website](https://polyapi.io) for case studies and more information about why you should use Poly!

Note

Currently released languages are Python, JavaScript, Java, and .NET.

We have plans to add many more! Please [reach out](mailto:support%40polyapi.io) if you need support for other languages.

## Contents

- [Quickstart](quickstart.html)
- [Platform Overview](platform_overview.html)
- [API Function Training](api_functions/index.html)
- [Generated SDKs](generated_sdks/index.html)
- [Authentication](authentication/index.html)
- [Canopy](canopy/index.html)
- [Vari Variables](vari_variables/index.html)
- [Tabi Tables](tabi_tables/index.html)
- [Jobs](jobs/index.html)
- [Webhooks](webhooks/index.html)
- [GraphQL Subscriptions](graphql_subscriptions/index.html)
- [Schemas](schemas/index.html)
- [Snippets](snippets/index.html)
- [Environments](environments/index.html)
- [GitHub Copilot Extension](copilot/index.html)
- [Project Glide](project_glide/index.html)
- [Logging](logging/index.html)
- [Error Handlers](error_handlers/index.html)
- [Versions](versions.html)
- [Next Steps](next_steps.html)

---

## jobs/executions

Source: https://docs.polyapi.io/jobs/executions.html

# Checking Job Executions

Each Job Execution represents a specific run of a specific job.

For example, if you have a job that runs every hour, you will have
a specific Execution summarizing the results of each hourly run.

## Execution List

Go to a specific Job, and on the Job Detail page, click the “Show Executions” button.

[![Job Detail](../_images/detail-job.png)](../_images/detail-job.png)

You should see a list of all executions for that job, including what time the execution happened and the status of the execution.

[![Execution List](../_images/execution-list.png)](../_images/execution-list.png)

If the status is “finished”, that means all functions executed and returned normally.

If the status is “error”, that means one or more functions in the job threw an error.

## Execution Detail

Now click “Show Details” to see more information about a specific execution.

You will see all the details about a specific execution, including what arguments each function was called with
and the status code response of each function:

[![Execution Detail](../_images/execution-detail.png)](../_images/execution-detail.png)

## Conclusion

Job Executions provide a great way to:

- monitor your jobs
- ensure they executed successfully
- debug any errors
- review performance

That’s it! You now know how to use Jobs in your codebase.

If you have any questions or need help, please don’t hesitate to reach out to us at [support@polyapi.io](mailto:support%40polyapi.io)

---

## jobs/index

Source: https://docs.polyapi.io/jobs/index.html

# Jobs

PolyAPI has a built-in jobs service similar to the classic Cron Job.

The jobs service allows you to schedule functions to run at specific times or at regular intervals.

Jobs are an important part of many integrations. You can schedule ETL jobs, notifications, and more.

There are two sides of the jobs service:

- [Managing Jobs](managing.html)
- [Checking Job Executions](executions.html)

---

## jobs/managing

Source: https://docs.polyapi.io/jobs/managing.html

# Managing Jobs

To manage jobs on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must have the “Manage Jobs” permission to manage jobs.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create a Job - Name and Schedule

First click “Jobs” in the sidebar, then click “+ Create”.

You should see an interface like this:

[![Create Job](../_images/create-job.png)](../_images/create-job.png)

For “Name”, let’s enter a name like “Weekly Report”.

For “Schedule Type”, let’s choose “Interval” and for “Schedule Value” let’s enter “5” and select “Number”. This will run the “Weekly Report” job every 5 minutes.

Later on, we can change this to “Periodical” and set the “Schedule Value” to “5 4 * * 1” to run this every Monday at 4:05 AM. (See [Crontab Guru](https://crontab.guru) for more info on crontab schedule expressions.)

Note

All time values should be provided in Zulu time.

Note

For the complete list of schedule types, check out our [Swagger Docs for Create Job](https://na1.polyapi.io/swagger#/default/JobsController_createJob)

For now, for testing, let’s set the “Schedule Type” to “Interval” and the “Schedule Value” to “5” so that our job
runs every 5 minutes!

## Create a Job - Functions List

For the “Functions list”, for this example we will create a new server function.

This function should follow our `Event` argument format (also used by webhooks and triggers) and receive three arguments:

- `eventPayload` - The event object
- `headersPayload` - any relevant HTTP headers
- `paramsPayload` - any relevant URL parameters

Here’s some example code for creating a new server function in Typescript:

```
// npx poly function add --server --context test weeklyReport weeklyReport.ts
function weeklyReport(eventPayload, headersPayload, paramsPayload) {
  console.log("Running weekly report job!");
  return "Hello Weekly Report!";
}
```

Run the comment at the top of the function in your console to add this function:

```
$ npx poly function add --server --context test weeklyReport weeklyReport.ts
```

Note

For more details on how to create server functions, see [Generated SDKs](../generated_sdks/index.html) to create a server function in your language of choice!

Finally, let’s enter the ID of the newly created function in the “Functions list” field,
along with any parameters you want to pass to your function for this job:

```
[{
  "id": "yourFunctionId",
  "eventPayload": {},
  "headersPayload": {},
  "paramsPayload": {}
}]
```

## Create a Job - Execution Type / Enabled

For “Execution Type”, select “Sequential”.

For just a single function, it doesn’t matter which type you choose.
But when you have multiple functions in the list, this determines whether your functions will run sequentially
or in parallel.

Then, select “True” for “Enabled” to turn on your job.

Finally, click “Save”.

## Updating / Deleting a Job

After clicking save, you should see your job’s detail page like this:

[![Job Detail](../_images/detail-job.png)](../_images/detail-job.png)

Click “Update” to update your job or “Delete” to delete it.

## Conclusion

That’s it! You’ve now created your first Job on PolyAPI!

Now, to see:

- the last time your job ran
- how long it took
- what it’s return status was

Let’s head over to [Checking Job Executions](executions.html).

---

## logging/index

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

---

## logging/logs_api

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

---

## logging/logs_canopy

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

---

## next_steps

Source: https://docs.polyapi.io/next_steps.html

# Next Steps

## Watch the Videos

Right now, the best way to deep dive into the capabilities of PolyAPI is to watch our demo videos.

There are over 50 videos on the [PolyAPI YouTube Channel](https://www.youtube.com/@PolyAPI), and we are adding more all the time.

The videos are also organized by playlists on the [PolyAPI website](https://polyapi.io).

Here are the playlists:

- [Building Integrations](https://polyapi.io/building-integrations/)
- [Microservices and AI](https://polyapi.io/microservices-and-ai/)
- [Innovation Series](https://polyapi.io/innovation-series/)

## Reach Out

Please reach out to [support@polyapi.io](mailto:support%40polyapi.io).

We’d love to chat about how you are using PolyAPI and how we can help!

---

## platform_overview

Source: https://docs.polyapi.io/platform_overview.html

# Platform Overview

**The PolyAPI Platform consists of:**

- A cloud-agnostic managed serverless platform built on Knative providing full observability into your integrations and services.
- A central gateway for receiving external cloud events, webhooks, and executing third party APIs and functions.
- A unified catalogue of vendor and internal APIs, functions, and webhooks, accessible via a generated SDK or our RESTful API.
- A helpful AI assistant embedded in your IDE to help you explore your catalogue and write integrations.
- A web portal to see and manage all your resources, and to host your own custom CRUD applications with auto-generated UI.

There are currently 2 separate, managed instances of our serverless platform that you can sign up for:

- `NA1` hosted on AWS us-west-2 <https://na1.polyapi.io/canopy/polyui/signup>
- `EU1` hosted on AWS eu-west-1 <https://eu1.polyapi.io/canopy/polyui/signup>

PolyAPI can also be self-hosted, allowing you to deploy it anywhere Kubernetes is supported.

## PolyAPI Resources

Poly makes it easy to create, host, and manage all the resources needed for any cloud service:

- **Functions**

  - **Server Functions** - Knative, serverless functions run in our cloud
  - **Client Functions** - Shared functions run wherever executed
  - [API Functions](api_functions/index.html) - API calls to third-party services invoked via our gateway
- [Variables](vari_variables/index.html) - Variables and secrets which are stored securely and can be injected into your functions at runtime
- [Webhooks](webhooks/index.html) - Public facing webhooks to accept external events
- [GraphQL Subscriptions](graphql_subscriptions/index.html) - Long-lived provider event streams that invoke Poly server functions when new events arrive
- **Triggers** - Setup cloud events to trigger functions
- [Jobs](jobs/index.html) - Execute functions at a set time, interval, or CRON schedule
- **Cloud Events** - The back-bone of every scalable, serverless workflow
- [Schemas](schemas/index.html) - Shared JSONSchema definitions to type your events and application data
- **Snippets** - Shared snippets to encourage best practices and eliminate boilerplate
- **Permission Policies** - Configurable policies that govern what resources and permissions your users have in one or more environments
- **Identity Providers** - Used to enable single sign-on authentication in your applications.

All PolyAPI resources you create will be catalogued, documented, and made available to your team in a custom SDK generated in any supported language.

## Tenants, Environments & Visibility

Within a Poly Instance there can be many Tenants. Tenants typically have 1-to-1 relations with a company that uses Poly (except in the case of self-hosting), and billing for services on PolyAPI are billed on a per-tenant basis.

Each Tenant may create one or more Environments which can be used to contain and isolate sets of PolyAPI resources in whatever manner desired–representing different services, or different teams, or even different development environments.

Most resources in PolyAPI have a `visibility` property which controls if the resource should be visible at the `ENVIRONMENT` level, or `TENANT` level, or `PUBLIC` level.
Depending on the visibility set the resource will be made available for discovery and use to all API Keys of the same environment, of the same tenant, or even of the same PolyAPI instance respectively.
Though a resource may be visible on a Tenant or Public level, it will still only be modifiable by API keys with the necessary permissions in the same environment.

Note

Anything created with a PUBLIC visibility is easily discoverable by ANY user from any other Tenant in the PolyAPI Instance, so should be considered truly public to anyone who’s curious.

Learn more about environments here:
[Environments](environments/index.html)

## Users, API Keys & Permissions

Each Tenant may contain any number of Users which sit outside of Environments.

Creating a User does not immediately give them access to the resources in their Tenant. You will need to give a user an API Key in order for them to access to Poly.

API Keys are bound to a specific Environment, and has a set of granular permissions which can be used to control access to resources within the API Keys’ environment.

Learn more about authentication here:
[Authentication](authentication/index.html)

---

## project_glide/disable-ai

Source: https://docs.polyapi.io/project_glide/disable-ai.html

# Using Glide without AI

TypeScript

If for whatever reason you wish to disable the use of AI you have several avenues to do so:

- You can disable use of AI at a global level by setting `DISABLE_AI=true` within your `node_modules/.poly/config.env` file.
- You can disable use of AI at a function level when configuring your poly functions:
  :   ```
      const polyConfig: PolyServerFunction = {
          name: "helloPoly",
          context: "demo",
          disableAi: true,
      }
      ```
- Or you can disable use of AI when running the `prepare` command by adding the `--disable-ai` option, ex: `poly prepare --disable-ai`.

Python

If for whatever reason you wish to disable the use of AI you have several avenues to do so:

- You can disable use of AI at a global level by setting `DISABLE_AI=true` within your `polyapi/config.env` file.
- You can disable use of AI at a function level when configuring your poly functions:
  :   ```
      polyConfig: PolyServerFunction = {
          'name': "hello_poly",
          'context': "demo",
          'disableAi': True,
      }
      ```
- Or you can disable use of AI when running the `prepare` command by adding the `--disable-ai` option, ex: `polyapi prepare --disable-ai`.

---

## project_glide/git-integration

Source: https://docs.polyapi.io/project_glide/git-integration.html

# Setup Glide Workflow

## Starting from Scratch

We have a public template you can clone or use for reference if you’re starting a new project.

TypeScript

Please follow the steps in that repository’s readme file: <https://github.com/polyapi/poly-glide-template-js?tab=readme-ov-file#getting-started> to get setup.

Python

Please follow the steps in that repository’s readme file: <https://github.com/polyapi/poly-glide-template-py?tab=readme-ov-file#getting-started> to get setup.

## Starting from Existing Project

Note

These steps are written for users of Github. But we support Gitlab too! You can mostly follow the same steps for A and B. For step C, see the [Gitlab Workflow](gitlab-workflow.html) page.

If you’ve already started a poly project, or have an existing project you want to integrate Poly and the Glide workflow with, there’s just a few steps you need to take to integrate Poly with Git.

To enable the Glide workflow you need:

**A. Git-managed repository hosted on Github.**

1. Follow instructions from Github to setup a new github repository: <https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository>.
2. Follow instructions from Github to authenticate with Github via the command line: <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#authenticating-with-the-command-line>.

**B. Pre-commit and post-merge hooks setup to run Poly commands.**

TypeScript

1. Run the following in your terminal from within your project.

   ```
   $ npm install --save-dev husky
   ```
2. Copy the pre-commit and post-merge hooks from our template project `.husky` into your own `your_repo/.husky` directory: <https://github.com/polyapi/poly-glide-template-js/tree/main/.husky>.
3. Commit these changes to git.

Python

1. Add the following to your project `requirements.txt`

   ```
   pre-commit==4.0.1
   ```
2. And then run pip install to get `pre-commit`

   ```
   $ pip install -r requirements.txt
   ```
3. Copy the pre-commit config from our template project `.pre-commit-config.yaml` into your repo: <https://github.com/polyapi/poly-glide-template-py/tree/main/.pre-commit-config.yaml>.
4. Install the pre-commit hook to enable it: (note the intentional use of underscores in the command)

   ```
   $ python -m pre_commit install
   ```
5. Commit these changes to git.

**C. A simple Github action that will deploy to Poly.**

1. Add the following secret variables defined within your github organization or within your github repository:

   `POLY_API_KEY` - Your key to your instance of PolyAPI.

   `POLY_API_BASE_URL` - The base url to your instance of PolyAPI, ex. `https://na1.polyapi.io` for north american cloud users.
2. Copy the following and save it as `your_repo/.github/workflows/deploy.yml`:

   TypeScript

   ```
   name: Deploy to PolyAPI
   on:
   push:
       branches:
       - main

   concurrency:
   group: ${{ github.ref }}
   cancel-in-progress: true

   jobs:
   deploy:
       runs-on: ubuntu-latest

       steps:
       - name: Poly Deploy
           uses: polyapi/poly-deployment-action-js@v0.2.13-alpha
           with:
           poly_api_key: ${{ secrets.POLY_API_KEY }}
           poly_api_base_url: ${{ secrets.POLY_API_BASE_URL }}
   ```

   Python

   ```
   name: Deploy to PolyAPI
   on:
   push:
       branches:
       - main

   concurrency:
   group: ${{ github.ref }}
   cancel-in-progress: true

   jobs:
   deploy:
       runs-on: ubuntu-latest

       steps:
       - name: Poly Deploy
           uses: polyapi/poly-deployment-action-py@v0.0.8
           with:
           poly_api_key: ${{ secrets.POLY_API_KEY }}
           poly_api_base_url: ${{ secrets.POLY_API_BASE_URL }}
   ```
3. Commit these changes to git.
4. That’s it! Github should pick up this workflow and run it anytime you commit changes to your main branch. Take a moment to verify the actual output of the workflow in the Github UI to see that it’s running correctly, deploying your functions, and committing any deploy receipts.

---

## project_glide/gitlab-workflow

Source: https://docs.polyapi.io/project_glide/gitlab-workflow.html

# Gitlab Workflow

For users of Gitlab, there is no marketplace where we can publish the Project Glide deployment action for easy importing and use as exists with Github. But we’re happy to share the full contents of the Gitlab deploy workflow here.

## Adding to Existing Gitlab Project

1. Add the following secret variables defined within your gitlab instance, group or within your projects settings:
   :   `POLY_API_KEY` - Your key to your instance of PolyAPI. Be sure to make this variable “Masked” so that it’s not inadvertently logged. See <https://docs.gitlab.com/ee/ci/variables/index.html#mask-a-cicd-variable> for more details.

       `POLY_API_BASE_URL` - The base url to your instance of PolyAPI, ex. `https://na1.polyapi.io` for north american cloud users.
2. Ensure you have runners available to run the deployment workflow. If you’re using the hosted gitlab.com you can skip this step. If you’re self-hosting Gitlab however you should verify in your projects CI/CD settings that you have a linux runner installed and showing up as active. If you don’t have a runner, see Gitlab documentation to get one installed: <https://docs.gitlab.com/runner/install/>

2. Copy the following and save it as `your_repo/.gitlab-ci.yml`:

   > ```
   > stages:
   >     - deploy
   >
   > variables:
   >     NODE_VERSION: "20"
   >     POLY_API_KEY: $POLY_API_KEY
   >     POLY_API_BASE_URL: $POLY_API_BASE_URL
   >     ENVIRONMENT: development
   > deploy_polyapi:
   >     stage: deploy
   >     image: node:${NODE_VERSION}
   >     only:
   >         - main    # Execute this job only on the main branch
   >     before_script:
   >         - echo "Setting up environment"
   >         - export PACKAGE_MANAGER="npm"
   >
   >     script:
   >         # Step: Poly pre-check
   >         - echo "Running Poly pre-check"
   >         - |
   >             if ! grep -q '"polyapi":' package.json; then
   >                 echo "Please install the PolyAPI client using your package manager."
   >                 exit 1
   >             fi
   >
   >         # Step: Setup Node and determine package manager
   >         - echo "Setting up Node and determining package manager"
   >
   >         - |
   >             if [ -f "yarn.lock" ]; then
   >                 export PACKAGE_MANAGER="yarn"
   >             elif [ -f "package-lock.json" ]; then
   >                 export PACKAGE_MANAGER="npm"
   >             fi
   >
   >         - |
   >             echo "Using package manager: $PACKAGE_MANAGER"
   >
   >         # Step: Restore cached dependencies
   >         - echo "Restoring cached dependencies"
   >         - if [ "$PACKAGE_MANAGER" == "yarn" ]; then yarn install --cache-folder ~/.cache/yarn; else npm ci; fi
   >
   >         # Step: Setup Poly
   >         - echo "Setting up Poly"
   >         - mkdir -p node_modules/.poly
   >         - POLY_ENV_PATH="node_modules/.poly/.config.env"
   >         - if [ ! -f "$POLY_ENV_PATH" ]; then echo -e "DISABLE_AI=true\nENVIRONMENT_SETUP_COMPLETE=true" > "$POLY_ENV_PATH"; fi
   >
   >         # Step: Deploy
   >         - echo "Deploying with PolyAPI"
   >         - if [ "$PACKAGE_MANAGER" == "yarn" ]; then yarn poly sync --custom-path=./node_modules/.poly/; else npx poly sync --custom-path=./node_modules/.poly/; fi
   >
   >         - git config --global user.email "${GIT_USER_EMAIL:-$GITLAB_USER_EMAIL}"
   >         - git config --global user.name "${GIT_USER_NAME:-$GITLAB_USER_NAME}"
   >         - git checkout main
   >         - git branch -vv
   >         - git remote set-url origin "https://${GITLAB_USERNAME}:${GITLAB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"
   >
   >         # Step: Commit deployment receipts
   >         - echo "Committing deployment receipts"
   >         - git add .
   >         - if ! git diff-index --quiet HEAD; then git commit -m "PolyAPI Deployment" --no-verify; else echo "No changes to commit."; fi
   >
   >         # Step: Push changes
   >         - echo "Pushing changes"
   >         - git push origin "${CI_DEFAULT_BRANCH}" -o ci.skip
   >
   >     cache:
   >         - key: "$ENVIRONMENT-Node-deps"
   >         paths:
   >             - "node_modules/"
   >             - ".npm/"
   >             - ".cache/yarn"
   >
   >         - key: "$ENVIRONMENT-poly-deps"
   >         paths:
   >             - "node_modules/.poly/"
   > ```
3. Commit these changes to git.
4. That’s it! Gitlab should pick up this workflow and run it anytime you commit changes to your main branch. Take a moment to verify the actual output of the workflow in your Gitlab UI to see that it’s running correctly, deploying your functions, and committing any deploy receipts.

---

## project_glide/index

Source: https://docs.polyapi.io/project_glide/index.html

# Project Glide

Project Glide makes it easy to:

- Manage and deploy a project with many PolyAPI functions and other deployable [resources](resources.html).
- Integrate Poly with git-backed, multi-developer projects using CI/CD.

If you’re using Git to manage your source code–and especially if you use Github–we recommend you follow the git integration steps to get a seamless developer experience.

If you don’t use Git, or you’re using a different Git hosting provider, then you might want to check out the instructions on manually using the new `poly prepare` and `poly sync`

Warning

Project Glide only works for TypeScript and Python at this time, but support for other languages is coming soon!

## How It’s Used

TypeScript

Suppose you had your project all setup (following our instructions provided below), and you created a new Poly function `helloPoly.ts` somewhere within your project like so:

```
import { PolyServerFunction } from 'polyapi';

const polyConfig: PolyServerFunction = {
    name: 'hellowWorld',
    context: 'myContext',
    // you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    logsEnabled: true,
    visibility: 'TENANT', // make this function visible to all environments in your tenant
};

function helloWorld(): string {
    return 'Hello Poly World!';
}
```

By writing `polyConfig: PolyServerFunction` you’ve given Poly the clues it needs to find your function and deploy it (later).

As part of your normal development workflow you commit this code and our pre-commit hook runs the `poly prepare` command to generate any missing documentation and leverage AI (if not disabled) to generate any missing descriptions.

If Poly makes any changes then your commit will be halted for you to review. In this example you might see:

```
/**
* Hello world test function
*
* @returns {string} Returns a test string
*/
function helloWorld(): string {
```

Perhaps you tweak the descriptions a little or perhaps not, but then you commit and push your changes to your remote Github repository.

A github action picks up your changes, and runs the `poly sync` command to deploy your function to your Poly instance.

After a successful deploy, Poly generates a receipt at the top of your `helloWorld.ts` function file, which looks something like this:

```
// Poly deployed @ 2024-09-20T21:58:31.264Z - myContext.hellowWorld - https://na1.polyapi.io/canopy/polyui/collections/server-functions/f382e9df-d591-4080-93e0-9dc2d0297444 - 75a08d6
import { PolyServerFunction } from 'polyapi';
```

Python

Suppose you had your project all setup (following our instructions provided below), and you created a new Poly function `hello_poly.py` somewhere within your project like so:

```
from polyapi.typedefs import PolyServerFunction

polyConfig: PolyServerFunction = {
    'name': 'hello_world',
    'context': 'myContext',
    # you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    'logsEnabled': True,
    'visibility': 'TENANT', # make this function visible to all environments in your tenant
}

def hello_world(first_name: str) -> str:
    return f"Hello {first_name}! I'm Poly, your helpful AI Assistant."
```

By writing `polyConfig: PolyServerFunction` you’ve given Poly the clues it needs to find your function and deploy it (later).

As part of your normal development workflow you commit this code and our pre-commit hook runs the `poly prepare` command to generate any missing documentation and leverage AI (if not disabled) to generate any missing descriptions.

If Poly makes any changes then your commit will be halted for you to review. In this example you might see:

```
def hello_world() -> str:
    """Hello world test function

    Returns:
        str: Returns a test string
    """
```

Perhaps you tweak the descriptions a little or perhaps not, but then you commit and push your changes to your remote Github repository.

A github action picks up your changes, and runs the `poly sync` command to deploy your function to your Poly instance.

After a successful deploy, Poly generates a receipt at the top of your `hello_world.py` function file, which looks something like this:

```
# Poly deployed @ 2024-09-20T21:58:31.264Z - myContext.hello_world - https://na1.polyapi.io/canopy/polyui/collections/server-functions/f382e9df-d591-4080-93e0-9dc2d0297444 - 75a08d6
from polyapi.typedefs import PolyServerFunction
```

The added comment from Poly shows you:

- when the function was deployed
- the name and context under which it was deployed
- a link to the live function in the PolyUI web management UI (with the functions full unique id) where you can view runtime logs or execute the function manually
- a checksum id for the file (excluding any header deployment comments as these comments do not impact your function in any way) which helps us ensure that the function you see in code always matches the live instance of it.

And with that you’re Gliding! Your source code in your git repository becomes (or stays) your source of truth, and automated Github actions take all the pain and human error out of managing and deploying your growing catalog of functions.

Follow our instructions below to get moving.

- [Setup Glide Workflow](git-integration.html)
- [Gitlab Workflow](gitlab-workflow.html)
- [Supported Resources](resources.html)
- [Manually Preparing and Syncing](manual-prepare-and-sync.html)
- [Using Glide without AI](disable-ai.html)

---

## project_glide/manual-prepare-and-sync

Source: https://docs.polyapi.io/project_glide/manual-prepare-and-sync.html

# Manually Preparing and Syncing

If you don’t use Git, or you’re using a different Git hosting provider, you can still Glide using the new `polyapi` commands:

- `prepare` which will find all your poly functions and prepare them for deployment, engaging AI for help filling in any missing documentation.
- `sync` which will take our prepared functions and deploy them to your PolyAPI instance in the cloud.

Let’s see what these commands look like in practice:

## Poly Prepare

TypeScript

Create a file called `helloPoly.ts` and add the following code:

```
import { PolyServerFunction } from 'polyapi';

const polyConfig: PolyServerFunction = {
    name: 'helloPoly',
    context: 'myContext',
    // you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    logsEnabled: true,
    visibility: 'TENANT', // make this function visible to all environments in your tenant
};

function helloPoly(first_name: string): string {
    return `Hello ${first_name}! I'm Poly, your helpful AI Assistant.`;
}
```

Run the following command in your console:

```
$ npx poly prepare
```

You’ll see Poly searching your whole repository for functions, finding your new `myContext.helloPoly` server function, and preparing it for deployment.

And if you check `helloPoly.ts` you’ll see it’s been updated with some JSDocs that should look something like this:

```
import { PolyServerFunction } from 'polyapi';

const polyConfig: PolyServerFunction = {
    name: 'helloPoly',
    context: 'myContext',
    // you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    logsEnabled: true,
    visibility: 'TENANT', // make this function visible to all environments in your tenant
};

/**
* Function that has Poly greet a user by their name
*
* @param {string} first_name - The user's first name
* @returns {string} Returns a greeting from Poly
*/
function helloPoly(first_name: string): string {
    return `Hello ${first_name}! I'm Poly, your helpful AI Assistant.`;
}
```

Python

Create a file called `hello_poly.py` and add the following code:

```
from polyapi.typedefs import PolyServerFunction

polyConfig: PolyServerFunction = {
    'name': 'hello_poly',
    'context': 'myContext',
    # you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    'logsEnabled': True,
    'visibility': 'TENANT', # make this function visible to all environments in your tenant
}

def hello_poly(first_name: str) -> str:
    return f"Hello {first_name}! I'm Poly, your helpful AI Assistant."
```

Run the following command in your console:

```
$ python3 -m polyapi prepare
```

You’ll see Poly searching your whole repository for functions, finding your new `myContext.helloPoly` server function, and preparing it for deployment.

And if you check `hello_poly.py` you’ll see it’s been updated with some docstrings that should look something like this:

```
from polyapi.typedefs import PolyServerFunction

polyConfig: PolyServerFunction = {
    'name': 'hello_poly',
    'context': 'myContext',
    # you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    'logsEnabled': True,
    'visibility': 'TENANT', # make this function visible to all environments in your tenant
}

def hello_poly(first_name: str) -> str:
    """Function that has Poly greet a user by their name

    Args:
        first_name (str): The user's first name

    Returns:
        str: Returns a greeting from Poly
    """
    return f"Hello {first_name}! I'm Poly, your helpful AI Assistant."
```

You can add or update any descriptions to your satisfaction–these doc strings match what will be generated in your SDK.

At this point your functions should be prepared and ready to be synced to Poly.

## Poly Sync

TypeScript

Warning

The Sync command should generally only be run from a single location per project and target Poly instance being deployed to.

If you’re working alone this is generally not a concern, but if you’re working with others: we recommend you setup a CI/CD workflow that will handle this in a central place for your team, and will handle caching the contents of your `node_modules/.poly` directory to ensure the sync command can handle removing deployed functions after you delete them from your source code.

Run the following command in your console:

```
$ npx poly sync
```

If you didn’t already run the prepare step you might see the prepare step output as that must always happen before syncing (though it will be run without AI during a sync to avoid making any unintended changes).
Then you’ll see additional console output deploying your function to poly.

And if you look at your `helloPoly.ts` file one more time you’ll see an auto-generated comment at the top containing the Poly deployment receipt:

```
// Poly deployed @ 2024-09-20T21:58:31.264Z - myContext.helloPoly - https://na1.polyapi.io/canopy/polyui/collections/server-functions/f382e9df-d591-4080-93e0-9dc2d0297444 - 75a08d6
import { PolyServerFunction } from 'polyapi';

const polyConfig: PolyServerFunction = {
    name: 'helloPoly',
    context: 'myContext',
    // you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    logsEnabled: true,
    visibility: 'TENANT', // make this function visible to all environments in your tenant
};

/**
* Function that has Poly greet a user by their name
*
* @param {string} first_name - The user's first name
* @returns {string} Returns a greeting from Poly
*/
function helloPoly(first_name: string): string {
    return `Hello ${first_name}! I'm Poly, your helpful AI Assistant.`;
}
```

Python

Warning

The Sync command should generally only be run from a single location per project and target Poly instance being deployed to.

If you’re working alone this is generally not a concern, but if you’re working with others: we recommend you setup a CI/CD workflow that will handle this in a central place for your team, and will handle caching the contents of your `polyapi/.poly` directory to ensure the sync command can handle removing deployed functions after you delete them from your source code.

Run the following command in your console:

```
$ python3 -m polyapi sync
```

If you didn’t already run the prepare step you might see the prepare step output as that must always happen before syncing (though it will be run without AI during a sync to avoid making any unintended changes).
Then you’ll see additional console output deploying your function to poly.

And if you look at your `hello_poly.py` file one more time you’ll see an auto-generated comment at the top containing the Poly deployment receipt:

```
# Poly deployed @ 2024-09-20T21:58:31.264Z - myContext.hello_poly - https://na1.polyapi.io/canopy/polyui/collections/server-functions/f382e9df-d591-4080-93e0-9dc2d0297444 - 75a08d6
from polyapi.typedefs import PolyServerFunction

polyConfig: PolyServerFunction = {
    'name': 'hello_poly',
    'context': 'myContext',
    # you can also add in optional, additional configuration for your server function here using the helpful type hints provided by the imported PolyServerFunction type. For example:
    'logsEnabled': True,
    'visibility': 'TENANT', # make this function visible to all environments in your tenant
}

def hello_poly(first_name: str) -> str:
    """Function that has Poly greet a user by their name

    Args:
        first_name (str): The user's first name

    Returns:
        str: Returns a greeting from Poly
    """
    return f"Hello {first_name}! I'm Poly, your helpful AI Assistant."
```

This comment shows you:

- when the function was deployed
- the name and context under which it was deployed
- a link to the live function in the PolyUI web management UI (with the functions full unique id) where you can view runtime logs or execute the function manually
- a checksum id for the file (excluding any header deployment comments as these comments do not impact your function in any way) which helps us ensure that the function you see in code always matches the live instance of it.

And that’s really all there is to it. You can continue to create new functions in a similar manner as you’ve just done, and run the same commands to prepare and sync them all.

---

## project_glide/resources

Source: https://docs.polyapi.io/project_glide/resources.html

# Supported Resources

Many PolyAPI resources are supported in a Project Glide workflow, though many are missing and still in progress. This page documents the supported Resources as well as the expected file config for each.

| Resource Type | Client SDKs | | | |
| --- | --- | --- | --- | --- |
| TypeScript | Python | Java | C# |
| [Server Functions](#server-functions) | ✅ | ✅ | ⬜ | ⬜ |
| [Client Functions](#client-functions) | ✅ | ✅ | ⬜ | ⬜ |
| API Functions | ⬜ | ⬜ | ⬜ | ⬜ |
| [Webhooks](#webhooks) | ✅ | ⬜ | ⬜ | ⬜ |
| Triggers | ⬜ | ⬜ | ⬜ | ⬜ |
| Jobs | ⬜ | ⬜ | ⬜ | ⬜ |
| Snippets | ⬜ | ⬜ | ⬜ | ⬜ |
| Schemas | ⬜ | ⬜ | ⬜ | ⬜ |

Note

All types, comments and docstrings are considered optional. We display them here for completeness.

## Server Functions

TypeScript

> ```
> // Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/server-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> import { PolyServerFunction } from 'polyapi';
>
> const polyConfig: PolyServerFunction = {
>     name: 'fn_name',
>     context: 'context.namespace',
>     // other config here
> };
>
> /**
> * Function description
> *
> * @param {string} arg - Argument description
> * @returns {string} Return description
> */
> function fn_name(arg: string): string {
>     return "";
> }
> ```

Python

> ```
> # Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/server-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> from polyapi.typedefs import PolyServerFunction
>
> polyConfig: PolyServerFunction = {
>     'name': 'fn_name',
>     'context': 'context.namespace',
>     # other config here
> }
>
> def fn_name(first_name: str) -> str:
>     """Function description
>
>     Args:
>         arg (str): Argument description
>
>     Returns:
>         str: Return description
>     """
>     return ""
> ```

## Client Functions

TypeScript

> ```
> // Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/client-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> import { PolyClientFunction } from 'polyapi';
>
> const polyConfig: PolyClientFunction = {
>     name: 'fn_name',
>     context: 'context.namespace',
>     // other config here
> };
>
> /**
> * Function description
> *
> * @param {string} arg - Argument description
> * @returns {string} Return description
> */
> function fn_name(arg: string): string {
>     return "";
> }
> ```

Python

> ```
> # Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/client-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> from polyapi.typedefs import PolyClientFunction
>
> polyConfig: PolyClientFunction = {
>     'name': 'fn_name',
>     'context': 'context.namespace',
>     # other config here
> }
>
> def fn_name(first_name: str) -> str:
>     """Function description
>
>     Args:
>         arg (str): Argument description
>
>     Returns:
>         str: Return description
>     """
>     return ""
> ```

## Webhooks

```
// Poly deployed @ <ISO_DATE_STRING> - context.namespace.hook_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/webhooks/<WEBHOOK_ID> - <FILE_CONTENT_HASH>
import { PolyWebhook } from 'polyapi';

const polyConfig: PolyWebhook = {
    name: 'hook_name',
    context: 'context.namespace',
    description: 'description here',
    // other config here
};
```

---

## quickstart

Source: https://docs.polyapi.io/quickstart.html

# Quickstart

## Get Your API Key

To get an API key: [sign up for a PolyAPI account](https://na1.polyapi.io/canopy/polyui/signup).

Complete the form to create a new tenant on the PolyAPI cloud instance and service tier of your choice.

Tip

Try free with no obligations by selecting the [Trial Tier](https://polyapi.io/proof-of-value-tier-limits) during sign up.

Once you’ve finished sign up and confirmed your verification code: your tenant will be setup in the PolyAPI cloud and you’ll be given your API key. Copy this key and save it somewhere secure as you will not be able to get this key again.

And with that you’re now ready to start using the PolyAPI and services!

## Install the Visual Studio Code Extension

You can use PolyAPI right from your favorite code editor!

Tip

Alternatively, you can use the public beta of our PolyAPI GitHub Copilot Extension with GitHub Copilot.

Please refer to [GitHub Copilot Extension](copilot/index.html) for more information.

Helpful Resources

[Beginners guide to Visual Studio Code](https://code.visualstudio.com/docs/getstarted/getting-started)

[Setting up Poly (video)](https://www.youtube.com/watch?v=QQfi4hURHTo)

1. Open Visual Studio Code
2. Open the Extensions pane from the sidebar.
3. Search for “Poly Assistant” extension.
4. Click on “Install”.

Once the extension is installed you should see the Parrot icon in your primary sidebar which opens the Poly AI chat panel.

[![View of VS Code sidebar highlighting the Poly Parrot and Palm Tree icons.](_images/vscode-extension-icons.png)](_images/vscode-extension-icons.png)

If you opened an existing Poly project in VSCode the extension would automatically grab the project configuration to determine the project language type and authentication information needed to run the extension.

But since this is our first time the extension doesn’t yet know that information.

Open the Poly AI panel and click the “Setup Poly client” button to finish setting up the PolyAPI client SDK. The extension will guide you through the process of selecting the project type of your project (the programming language you’re using) and setting up your API key.

Warning

The VSCode Extension only supports a single language per VSCode workspace. To use multiple languages with PolyAPI keep each language in it’s own folder and open each in their own instance of VSCode where the extension can be configured separately for each language.

## Asking Questions

Once the extension is setup fully you should see the Palm Tree icon in your primary sidebar which will allow you to explore dozens of APIs provided out-of-the-box by PolyAPI as well as any APIs and functions you create.

In addition to exploring the SDK you can chat with the Poly Assistant which has full access to the same generated SDK.

Click the Parrot icon to open the AI chat panel, and click where is says “Ask Poly about APIs and Events” to get chatting.

You can ask Poly about anything related to PolyAPI, and have it write code using your generated SDK. For example, you can ask:

- “How do I create a new contact on Hubspot?”
- “How do I search for a customer on Stripe?”

Feel free to ask about whatever API you’re interested in!

If you run into any issues or feel that Poly is unclear, please email [support@polyapi.io](mailto:support%40polyapi.io).

## Onward

The next step on the guided tour of Poly is to train your first [API Function](api_functions/index.html) and use it in your code!

---

## schemas/create_schemas

Source: https://docs.polyapi.io/schemas/create_schemas.html

# Creating Schemas

How to create schemas in PolyAPI

## Create from an OpenAPI Specification

When you convert a full OpenAPI specification to a Poly spec and train it, any schemas defined within will be detected and made into a PolyAPI Schema. The process for doing this is exactly as documented here: [Using OpenAPI Specs](../api_functions/openapi.html)

Once you’ve converted your OpenAPI specification using the `npx poly model generate` command you can open the generated JSON file where you’ll see an array of Schemas that were referenced in the specification and are ready to be trained to Poly like this:

[![Screenshot of schemas detected in an OpenAPI specification and converted into a format ready to be trained to Poly.](../_images/oas_converted_schemas.png)](../_images/oas_converted_schemas.png)

At this point running the `npx poly model train` command will train all the functions, webhooks, and schemas into your environment in PolyAPI.

## Creating from Scratch in the PolyAPI Web UI

1. Navigate to the schemas collection in the PolyAPI web UI, and click the ‘Create’ button.

   [![Screenshot of the Schemas collection in the PolyAPI web UI.](../_images/schema_collection.png)](../_images/schema_collection.png)
2. Give your Schema a name and context path. Then set the visibility of your Schema to `ENVIRONMENT`.

   [![Screenshot of creating a schema in the PolyAPI web UI with the name 'UserRecord' and context 'demo.users'](../_images/schema_create_form.png)](../_images/schema_create_form.png)
3. Add a JSONSchema into the definition field. Here’s an example definition you can use just to see how this works:

   ```
   {
     "type": "object",
     "properties": {
       "id": {
         "type": "integer"
       },
       "first_name": {
         "type": "string"
       },
       "last_name": {
         "type": "string"
       },
       "email": {
         "type": "string",
         "nullable": true
       }
     },
     "required": [
       "id",
       "first_name",
       "last_name"
     ],
     "additionalProperties": false
   }
   ```
4. Submit the form to create a schema.

   [![Screenshot of the detail view of the 'demo.users.UserRecord' schema in the PolyAPI web UI ready to be used.](../_images/schema_detail_view.png)](../_images/schema_detail_view.png)

At this point you can now use your schema in your local development environment following the steps outlined here: [Using Schemas](use_schemas.html)

## Creating Schemas That Reference Other Schemas

PolyAPI Schemas can reference other Schemas using the `x-poly-ref` attribute. Let’s make a new schema that reference the `UserRecord` schema we made previously.

1. Navigate to the schemas collection in the PolyAPI web UI, and click the ‘Create’ button.
2. Give this Schema a name and context path. Then set the visibility to `ENVIRONMENT`.

   [![Screenshot of creating a schema in the PolyAPI web UI with the name 'GroupRecord' and context 'demo.users'](../_images/schema_create_form_2.png)](../_images/schema_create_form_2.png)
3. Add a JSONSchema into the definition field. For properties that you want to reference an existing PolyAPI schema simple give it a `x-poly-ref` attribute whose value is an object containing a `path` key mapping to the full context and name path of the other schema. Here’s an example definition you can use just to see how this works:

   ```
   {
     "type": "object",
     "properties": {
       "id": {
         "type": "integer"
       },
       "name": {
         "type": "string"
       },
       "members": {
         "type": "array",
         "items": {
           "x-poly-ref": {
             "path": "demo.users.UserRecord"
           }
         }
       }
     },
     "required": [
       "id",
       "name",
       "members"
     ],
     "additionalProperties": false
   }
   ```
4. Submit the form to create a schema.

   [![Screenshot of the detail view of the 'demo.users.GroupRecord' schema in the PolyAPI web UI ready to be used.](../_images/schema_group_detail_view.png)](../_images/schema_group_detail_view.png)

---

## schemas/index

Source: https://docs.polyapi.io/schemas/index.html

# Schemas

**Schemas** is how PolyAPI allows for defining and sharing resource type definitions while keeping a single source of truth, and builds on [JSONSchema](https://json-schema.org/) definitions.

Schemas can be used to specify things like arguments and return types for your functions bringing greater type safety. Schemas can be created manually from the PoyAPI web UI, or if you train an OpenAPI specification to Poly: any detected schemas will get pulled out and trained as a Schemas in your PolyAPI environment.

Schemas defined by your team, or made public to your development environment will be converted into typed interfaces you can import and reference easily within your code.

- [Creating Schemas](create_schemas.html)
- [Using Schemas](use_schemas.html)

---

## schemas/use_schemas

Source: https://docs.polyapi.io/schemas/use_schemas.html

# Using Schemas

Schemas are made accessible when developing integrations in PolyAPI, both when using the client SDK as well as within the tree view in the VSCode extension.

## Schemas within your code using the SDK

Schemas are currently supported by both the TypeScript and Python client libraries and work similarly across both.

Schemas are made available under the `schemas` namespace and can be imported from the `polyapi` library once you’ve generated the SDK locally.

Below are some code examples of importing and using a schema like this one shown here:

[![Screenshot of an example schema in the PolyAPI web UI with the name 'UserRecord' and context 'demo.users'](../_images/schema_detail_view.png)](../_images/schema_detail_view.png)

Example of using a schema for a function argument:

TypeScript

```
import { schemas } from 'polyapi';

function processUserRecord(user: schemas.Demo.Users.UserRecord): void {
    const fullName = `${user.first_name} ${user.last_name}`;
    console.log(`Processing record for user: ${fullName}, (id: ${user.id})`);
    // ...rest of function
}
```

Python

```
from polyapi import schemas

def processUserRecord(user: schemas.demo.users.UserRecord) -> void:
    full_name = f'{user.first_name} {user.last_name}'
    print(f'Processing record for user: {full_name}, (id: {user.id})')
    # ...rest of function
```

Example of using a schema for a function return type:

TypeScript

```
import { schemas } from 'polyapi';

function generateUserRecord(
    id: number,
    first_name: string,
    last_name: string
): schemas.Demo.Users.UserRecord {
    return { id, first_name, last_name };
}
```

Python

```
from polyapi import schemas

def generateUserRecord(
    id: int,
    first_name: str,
    last_name: str
) -> schemas.demo.users.UserRecord:
    return {
      'id': id,
      'first_name': first_name,
      'last_name': last_name,
    }
```

Note

Not every JSONSchema attribute can be expressed as TypeScript or Python types, but each client will generate as complete a type as is possible.

## Schemas within the VSCode Extension

Schemas are shown within your PolyAPI tree view alongside your functions and variables based on their context path, but are collected under a ‘Schemas’ tree to prevent them from overwhelming the view.

[![View of the Tree view panel in the PolyAPI VSCode Extension showing schemas grouped together, as well as Intellisense popup panel showing generated type definition in the SDK when hovering over a Schema.](../_images/schema_tree_view.png)](../_images/schema_tree_view.png)

Hovering over a schema will show you the written description for it, and will give you a link to view the schema details within the PolyAPI web UI where it can be updated as needed.

Clicking a schema in the tree will copy the schema’s path for you to use within your code. Simply paste it where you need it, and update your code imports accordingly to make sure the `schemas` namespace is in scope.

## Adding a Schema to an API Function

For API’s trained via Postman or created via the PolyAPI web UI they likely won’t be linked with any Schema. But it’s easy to modify them via the PolyAPI web UI to use a schema for an argument or a return type.

1. Navigate to the API function you wish to use the schema within, and click the edit button.

   [![View of an API function that we want to add a schema to within the PolyAPI web UI.](../_images/api_function_without_schema.png)](../_images/api_function_without_schema.png)
2. Update the return type schema with a barebones schema that includes the `x-poly-ref` attribute whose value is an object containing a `path` key mapping to the full context and name path of the schema we want to use for the return type.

   [![View of adding a schema to an API function Return Type Schema that reference a PolyAPI Schema.](../_images/adding_schema_to_api_function.png)](../_images/adding_schema_to_api_function.png)
3. Save the form and then you’re good to go! In your local development environment regenerate the SDK and you should now see updated types when hovering over the function, and should get full type safety when accessing properties defined within the schema.

   [![View of a type error when attempting to use an API function whose return value conforms to a PolyAPI Schema.](../_images/using_api_function_with_schema.png)](../_images/using_api_function_with_schema.png)

---

## snippets/index

Source: https://docs.polyapi.io/snippets/index.html

# Snippets

PolyAPI supports structured and discoverable snippets for establishing patterns and encouraging code re-use.

With Snippets, you can create reusable code blocks and easily share them for consumption across tenants, environments, or publicly.

Snippets can be managed or consumed from the PolyAPI web UI, API, and VSCode extension.

- [Managing Snippets](managing-snippets.html)
- [Using Snippets](using-snippets.html)

---

## snippets/managing-snippets

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

---

## snippets/using-snippets

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

---

## tabi_tables/best_practices

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

---

## tabi_tables/index

Source: https://docs.polyapi.io/tabi_tables/index.html

# Tabi Tables

PolyAPI has a built-in managed database service named `tabi` (backed by PostgreSQL).

Tabi allows you to manage your data through an easy-to-use SDK rather than having to go through
all the hassle of setting up and maintaining your own database.

Tabi is designed for structured, high-volume datasets that need row-level querying.

Use `tabi` when you have thousands of records and need table-style storage and filtering.

Use `vari` for small configuration objects and secrets (usually strings or small JSON blobs).

This section covers:

- [Manage Tabi Tables](table_management.html)
- [Tabi Row Operations](row_operations.html)
- [Tabi Limitations](limitations.html)
- [Tabi Best Practices](best_practices.html)

---

## tabi_tables/limitations

Source: https://docs.polyapi.io/tabi_tables/limitations.html

# Tabi Limitations

- Table PATCH only supports adding or dropping columns, not renaming columns or changing column types.
- UNIQUE constraints are supported per column (not composite).
- UNIQUE constraints can be added during or after creation, but cannot be removed.
- PostgreSQL allows multiple `NULL` values for a UNIQUE column.
- Composite indexes are not currently supported.
- Foreign keys are not currently supported.
- Upsert currently supports matching on one unique column.
- `jsonb` columns are great for storing flexible payloads, but query support inside JSON content is currently limited. Today, plan to query using top-level columns where possible, and use `jsonb` mostly for payload storage and retrieval.

Many of these limitations, like composite columns, are on the roadmap to be added and/or can be manually addressed by Poly staff.

Please [reach out](mailto:support%40polyapi.io) if your use case requires support for these features!

---

## tabi_tables/row_operations

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

---

## tabi_tables/table_management

Source: https://docs.polyapi.io/tabi_tables/table_management.html

# Manage Tabi Tables

This page covers table lifecycle operations using the REST API.

## Base URL and auth

Use your environment hostname (for example `eu1.polyapi.io`, `na1.polyapi.io`) and send your bearer token.

```
curl -H "Authorization: Bearer $YOUR_BEARER_TOKEN" \
    https://eu1.polyapi.io/tables
```

## Table endpoints

- `GET /tables` list tables
- `POST /tables` create table
- `GET /tables/{id}` get one table
- `PATCH /tables/{id}` update table metadata or schema
- `DELETE /tables/{id}` delete table

## Create a table

Note: Tabi automatically provides these columns on every table:

- `id` (UUID primary key)
- `created_at`
- `updated_at`

So there’s no need to include those in your column definitions when creating a table!

```
curl -X POST https://eu1.polyapi.io/tables \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $YOUR_BEARER_TOKEN" \
  -d '{
    "name": "MyTable",
    "context": "customer.data",
    "description": "Structured records for customer sync",
    "visibility": "ENVIRONMENT",
    "columns": [
      {
        "name": "data_type",
        "type": "text",
        "required": true,
        "unique": false,
        "primary": false,
        "schema": { "type": "string", "enum": ["building", "company", "user"] }
      },
      {
        "name": "external_id",
        "type": "text",
        "required": true,
        "unique": true,
        "primary": false,
        "schema": { "type": "string" }
      },
      {
        "name": "json_data",
        "type": "jsonb",
        "required": true,
        "unique": false,
        "primary": false,
        "schema": { "type": "object" }
      }
    ]
  }'
```

Notes:

- `name` and `columns` are required.
- `visibility` values are `ENVIRONMENT` or `TENANT`.
- Column `schema` is used for generated SDK type hints and documentation, not runtime enforcement.

## Supported column data types

Tabi accepts the following column type names and aliases:

- `string`, `text`, `varchar` -> stored as `text`
- `char` -> stored as `char`
- `uuid` -> stored as `uuid`
- `number`, `numeric`, `decimal` -> stored as `numeric`
- `float`, `double`, `float8` -> stored as `double precision`
- `int`, `integer`, `int4` -> stored as `integer`
- `bigint`, `int8` -> stored as `bigint`
- `serial` -> stored as `serial`
- `bigserial` -> stored as `bigserial`
- `boolean`, `bool` -> stored as `boolean`
- `date` -> stored as `date`
- `time`, `timesec` -> stored as `time`
- `timestamp`, `timestamptz` -> stored as `timestamptz`
- `json`, `jsonb`, `object` -> stored as `jsonb`

## Update a table

Use `PATCH /tables/{id}` to update name/context/description/visibility and apply supported schema changes.

```
curl -X PATCH https://eu1.polyapi.io/tables/$YOUR_TABLE_ID \
  -H "content-type: application/json" \
  -H "Authorization: Bearer $YOUR_BEARER_TOKEN" \
  -d '{
    "description": "Updated table description",
    "columns": [
      {
        "name": "new_status",
        "type": "text",
        "required": false,
        "unique": false,
        "primary": false,
        "schema": { "type": "string" }
      }
    ]
  }'
```

Warning

Schema changes currently support adding or dropping columns only.

## Delete a table

```
curl -X DELETE https://eu1.polyapi.io/tables/$YOUR_TABLE_ID \
    -H "Authorization: Bearer $YOUR_BEARER_TOKEN"
```

## References

- [Swagger /tables endpoints](https://eu1.polyapi.io/swagger/#/Tables)

---

## vari_variables/code

Source: https://docs.polyapi.io/vari_variables/code.html

# Vari in Your Code

Helpful Resource

[Creating Variables Video](https://www.youtube.com/watch?v=fauSyGZhSAw&list=PLrMPJ9Jjy1LTtT4rAGAOHhPgcZK63ts3-&index=9)

To use `vari` in your codebase, first do this:

```
$ npx poly generate
```

The generate command will generate a fresh version of the Poly library,
with all the latest functions and variables.

If you just did the [Vari in Your Code](#) tutorial, you should now see the `vari.test.test1` variable in your Poly library.

## Vari Get

Now let’s get the value of a variable in code and log it to the console!

Save the following code inside your Poly test project as variTest.ts:

```
import { vari } from 'polyapi';

(async () => {
    const myvar = await vari.test.test1.get();
    console.log(myvar);
})();
```

Then run the code via:

```
$ npx ts-node variTest.ts
```

That’s it! You should now see the value of the variable “abc” in your console.

Now you can go forth and use Vari in all your Poly functions to coordinate configuration and secrets!

## Vari Other Methods

Each `vari` variable has the following methods:

- get: get the value of a variable
- inject: inject the value of a secret variable (more below)
- update: update the value of a variable
- onUpdate: listen for updates of a variable and run some code when it happens

`update` and `onUpdate` should be pretty self-explanatory.

But let’s dive into `inject` a bit more and talk about when you use it, versus when you use `get`!

## Secret vs Non-Secret Variables

In PolyAPI, variables can be either secret or non-secret.

Secret variables are encrypted and stored in a [secure vault](https://www.vaultproject.io/) , while non-secret variables are stored in plain text.

Furthermore, non-secret variables can be accessed on local developers machines through the use of the `myvar.get()` method.

Secret variables, on the other hand, may only be used in server functions running on PolyAPI’s servers, or in a PolyAPI api function.

If you try to use `.get()` on a secret variable, you will get an error. To use a secret variable, you must use the `.inject()` method instead of `.get()`, and you must pass it into a function as an argument.

If you log the value of the result you get back from the `.inject()` method you’ll see that you don’t actually get the value of the variable–instead you have a reference object that the PolyAPI gateway will use to grab the secret and actually inject it when executing a function.

## Using Nested Values within JSON Variables

If your variable value is a JSON object you can easily get a nested property from it after you get it’s value like this: `const nestedVal = (await vari.some.path.to.myVar.get()).path.to.nestedVal`.

This also works for secret variables injected using the `.inject()` method either like this: `vari.some.path.to.myVar.inject().path.to.nestedVal` or you can pass the path in directly as an argument like this: `vari.some.path.to.myVar.inject('path.to.nestedVal')` and then when the gateway injects your variable into the function it will inject only the nested value extracted from your variable.

## Conclusion

That’s it! You now know how to use `vari` in your codebase.

If you have any questions or need help, please don’t hesitate to reach out to us at [support@polyapi.io](mailto:support%40polyapi.io)

---

## vari_variables/execute_endpoints

Source: https://docs.polyapi.io/vari_variables/execute_endpoints.html

# Using Variables with Execute Endpoints

While the Poly library provides a convenient way to interact with your functions, you can also call the `execute` endpoint directly. This is particularly useful when you’re working in an environment where using the Poly library isn’t feasible.

This guide covers calling PolyAPI functions via direct HTTP requests while securely injecting variables.

Note

You must have the **Execute Functions** permission to use execute endpoints.

## Create a Test Variable

To follow along with the examples below, create a test variable in your PolyAPI tenant

Click “+ Create” and create a variable with:
* **Context**: `tutorial`
* **Name**: `apiKey`
* **Value**: `test-secret-key-123`
* **Visibility**: Environment
* **Secret**: Choose based on your needs

Click “Create” to save your variable!

## Understanding Execute Endpoints

PolyAPI provides execute endpoints for both types of functions:

- **API Functions**: `POST /functions/api/{functionId}/execute`
- **Server Functions**: `POST /functions/server/{functionId}/execute`

When you call these endpoints, you can inject variables using special `PolyVariable` objects in your request body.

## Execute Call Without Variables

Here’s how to call a PolyAPI function without any variable injection.

For this example, we’ll assume you have a function with ID `my-function-id`. Replace this with an actual function ID from your environment.

TypeScript

```
// Execute an API function without variables
const response = await fetch('https://na1.polyapi.io/functions/api/my-function-id/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "userName": "john.doe",
    "includeMetadata": true,
    "limit": 50
  })
});

const result = await response.json();
console.log('Status:', result.status);
console.log('Data:', result.data);
```

Python

```
import requests

# Execute an API function without variables
response = requests.post(
    'https://na1.polyapi.io/functions/api/my-function-id/execute',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        "userName": "john.doe",
        "includeMetadata": True,
        "limit": 50
    }
)

result = response.json()
print(f'Status: {result["status"]}')
print(f'Data: {result["data"]}')
```

This shows the basic structure of an execute endpoint call. Now let’s add variable injection.

## Injecting Variables

Now let’s use the variable we created earlier. There are three ways to inject variables:

1. **By Variable Path**: `"pathIdentifier": "tutorial.apiKey"`
2. **By Variable ID**: `"id": "your-variable-uuid"`
3. **With Path Extraction**: Get only part of a complex JSON variable

Here’s an example using the first method with our `tutorial.apiKey` variable:

TypeScript

```
// Execute with variable injection
const response = await fetch('https://na1.polyapi.io/functions/api/my-function-id/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "userName": "john.doe",
    "authToken": {
      "type": "PolyVariable",
      "pathIdentifier": "tutorial.apiKey"
    }
  })
});

const result = await response.json();
console.log('Function executed with injected variable!');
```

Python

```
# Execute with variable injection
response = requests.post(
    'https://na1.polyapi.io/functions/api/my-function-id/execute',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        "userName": "john.doe",
        "authToken": {
            "type": "PolyVariable",
            "pathIdentifier": "tutorial.apiKey"
        }
    }
)

result = response.json()
print('Function executed with injected variable!')
```

## Advanced Variable Injection

The following examples demonstrate more complex scenarios for variable injection in real applications.

### Multi-Client Example

Using different credentials per client or integration.

First, create a variable containing multiple client configurations:

```
{
  "clientA": "SECRET_KEY_FOR_CLIENT_A",
  "clientB": "SECRET_KEY_FOR_CLIENT_B"
}
```

Then use path-based injection to extract just the configuration for a specific client:

TypeScript

```
// Using Client A credentials - extracts only "clientA" from the variable
const responseA = await fetch(`https://na1.polyapi.io/functions/api/send-email/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "emailData": {
      "to": "customer@companyA.com",
      "subject": "Welcome to Company A!"
    },
    "apiKey": {
      "type": "PolyVariable",
      "pathIdentifier": "integrations.emailService.credentials",
      "path": "clientA"  // Only injects "SECRET_KEY_FOR_CLIENT_A"
    }
  })
});

// Using Client B credentials - extracts only "clientB" from the same variable
const responseB = await fetch(`https://na1.polyapi.io/functions/api/send-email/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "emailData": {
      "to": "customer@companyB.com",
      "subject": "Welcome to Company B!"
    },
    "apiKey": {
      "type": "PolyVariable",
      "pathIdentifier": "integrations.emailService.credentials",
      "path": "clientB"  // Only injects "SECRET_KEY_FOR_CLIENT_B"
    }
  })
});
```

Python

```
import requests

# Using Client A credentials - extracts only "clientA" from the variable
response_a = requests.post(
    "https://na1.polyapi.io/functions/api/send-email/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "emailData": {
            "to": "customer@companyA.com",
            "subject": "Welcome to Company A!"
        },
        "apiKey": {
            "type": "PolyVariable",
            "pathIdentifier": "integrations.emailService.credentials",
            "path": "clientA"  # Only injects "SECRET_KEY_FOR_CLIENT_A"
        }
    }
)

# Using Client B credentials - extracts only "clientB" from the same variable
response_b = requests.post(
    "https://na1.polyapi.io/functions/api/send-email/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "emailData": {
            "to": "customer@companyB.com",
            "subject": "Welcome to Company B!"
        },
        "apiKey": {
            "type": "PolyVariable",
            "pathIdentifier": "integrations.emailService.credentials",
            "path": "clientB"  # Only injects "SECRET_KEY_FOR_CLIENT_B"
        }
    }
)
```

### Environment-Specific Database Access

Use different database configurations for development vs production:

TypeScript

```
// Development environment
const devResponse = await fetch(`https://na1.polyapi.io/functions/api/get-user-data/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "userId": 12345,
    "includeMetadata": true,
    "dbConfig": {
      "type": "PolyVariable",
      "pathIdentifier": "environments.development.database.config"
    }
  })
});

// Production environment (same code, different variable)
const prodResponse = await fetch(`https://na1.polyapi.io/functions/api/get-user-data/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "userId": 12345,
    "includeMetadata": true,
    "dbConfig": {
      "type": "PolyVariable",
      "pathIdentifier": "environments.production.database.config"
    }
  })
});
```

Python

```
# Development environment
dev_response = requests.post(
    "https://na1.polyapi.io/functions/api/get-user-data/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "userId": 12345,
        "includeMetadata": True,
        "dbConfig": {
            "type": "PolyVariable",
            "pathIdentifier": "environments.development.database.config"
        }
    }
)

# Production environment (same code, different variable)
prod_response = requests.post(
    "https://na1.polyapi.io/functions/api/get-user-data/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "userId": 12345,
        "includeMetadata": True,
        "dbConfig": {
            "type": "PolyVariable",
            "pathIdentifier": "environments.production.database.config"
        }
    }
)
```

### Nested Variable Extraction

Extract specific values from complex JSON variables.

For example, with a variable containing multiple client configurations but using path extraction to inject only one subset:

```
{
  "development": {
    "host": "dev-db.example.com",
    "username": "dev_user",
    "password": "dev_pass"
  },
  "production": {
    "host": "prod-db.example.com",
    "username": "prod_user",
    "password": "prod_pass"
  }
}
```

TypeScript

```
// Extract only the production configuration from the variable
const response = await fetch(`https://na1.polyapi.io/functions/api/get-user-data/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "userId": 12345,
    "includeMetadata": true,
    "dbConfig": {
      "type": "PolyVariable",
      "pathIdentifier": "database.environments.config",
      "path": "production"  // Only injects the production config subset
    }
  })
});
```

Python

```
# Extract only the production configuration from the variable
response = requests.post(
    "https://na1.polyapi.io/functions/api/get-user-data/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "userId": 12345,
        "includeMetadata": True,
        "dbConfig": {
            "type": "PolyVariable",
            "pathIdentifier": "database.environments.config",
            "path": "production"  # Only injects the production config subset
        }
    }
)
```

## Server Function Execute Endpoints

Server functions also support execute endpoints with the same variable injection capabilities:

TypeScript

```
// Execute a custom server function with variable injection
const response = await fetch(`https://na1.polyapi.io/functions/server/process-order/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "orderData": {
      "orderId": "order_12345",
      "customerId": "cust_67890",
      "amount": 99.99
    },
    "integrationSettings": {
      "type": "PolyVariable",
      "pathIdentifier": "integrations.orderProcessing.settings"
    },
    "paymentGatewayCredentials": {
      "type": "PolyVariable",
      "pathIdentifier": "payments.gateway.credentials",
      "path": "production"
    }
  })
});
```

Python

```
# Execute a custom server function with variable injection
response = requests.post(
    "https://na1.polyapi.io/functions/server/process-order/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "orderData": {
            "orderId": "order_12345",
            "customerId": "cust_67890",
            "amount": 99.99
        },
        "integrationSettings": {
            "type": "PolyVariable",
            "pathIdentifier": "integrations.orderProcessing.settings"
        },
        "paymentGatewayCredentials": {
            "type": "PolyVariable",
            "pathIdentifier": "payments.gateway.credentials",
            "path": "production"
        }
    }
)
```

Note

Server function execute endpoints support additional features like asynchronous execution and custom response handling via the `polyCustom` object in your function code.

## Execute Endpoints vs Generated SDKs

Use **execute endpoints** for integration platforms, legacy systems, or when SDKs aren’t practical.

Use **generated SDKs** for modern applications where you want type safety and simplified development.

See [Generated SDKs](../generated_sdks/index.html) for SDK documentation.

## Conclusion

That’s it! You’ve now learned how to:

- Create variables for use with execute endpoints
- Make direct HTTP calls to PolyAPI functions
- Inject variables securely using `PolyVariable` objects

---

## vari_variables/index

Source: https://docs.polyapi.io/vari_variables/index.html

# Vari Variables

PolyAPI has a built-in variable service named `vari`.

Vari is a powerful tool for managing variables that are shared between different functions, like configuration and secrets.

With Vari, you can update configurations once and have all your functions use the new values.

Similarly, you can rotate secrets like API keys once, and have all your functions start using the new API keys.

There are three main ways to use `vari` in the PolyAPI:

- [Vari Management UI](ui.html)
- [Vari in Your Code](code.html)
- [Using Variables with Execute Endpoints](execute_endpoints.html)

First, let’s take a look at creating `vari` variables in the UI, as that’s the most common way to create variables when working on a new integration!

---

## vari_variables/ui

Source: https://docs.polyapi.io/vari_variables/ui.html

# Vari Management UI

To manage variables on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must have the “Manage Variables” permission to manage variables.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create a Variable

Click “Variables” in the sidebar to see the following screen:

[![Variable List](../_images/vari-init.png)](../_images/vari-init.png)

Click “+ Create” to get started.

Enter a context, name, and description for your variable.

For this example, let’s have the context be `test` and the name be `test1`.

Then select visibility. For now, let’s just select “Environment”.

Note

Environment is the most common variable visibility.

Only other api keys within your specific environment will have access to this variable.

Leave “Secret” as “No” for now.

Secret variables will be covered in the next section of the docs: [Vari in Your Code](code.html)

Enter your value. For now, let’s just do the string “abc”.

Finally, click “Create” to create your variable!

## Update/Delete a Variable

If you go back to your variable list, you should see your new variable.

Note

You may have to refresh the page to see your new variable in the list.

- NA1 link: <https://na1.polyapi.io/canopy/polyui/collections/variables>
- EU1 link: <https://eu1.polyapi.io/canopy/polyui/collections/variables>

Click “Show Details” on your variable to see the following:

[![Variable Detail](../_images/vari-detail.png)](../_images/vari-detail.png)

From this screen, just click “Update” to update your variable or “Delete” to delete it!

## Conclusion

That’s it! You’ve now:

- created a new variable through the UI
- explored updating/deleting variables through the UI

In the next section, we’ll explore [how to use Vari Variables in your code](code.html)!

---

## versions

Source: https://docs.polyapi.io/versions.html

# Versions

This page lists the latest versions of PolyAPI software products,
and for languages, the min/max versions currently supported by Poly.

- [Poly Assistant VSCode Extension](https://marketplace.visualstudio.com/items?itemName=PolyAPICorp.polyapi-vscode-extension): 0.13.5
- [Poly Postman Scripts](https://na1.polyapi.io/postman/scripts.zip): 0.4.3

## PolyAPI TypeScript

- PolyAPI TypeScript Client: [polyapi](https://www.npmjs.com/package/polyapi)
- Source Code: [polyapi/polyapi-typescript](https://github.com/polyapi/polyapi-typescript)
- Requires Node JS 20.19.3+ and NPM 10.8.2+
- Requires TypeScript 4.0.2+ and ts-node 5.0.0+
- Dependencies: [package.json](https://www.npmjs.com/package/polyapi?activeTab=code)

## PolyAPI Python

- PolyAPI Python Client: [polyapi-python](https://pypi.org/project/polyapi-python/)
- Source Code: [polyapi/polyapi-python](https://github.com/polyapi/polyapi-python)
- Dependencies: [requirements.txt](https://github.com/polyapi/polyapi-python/blob/main/requirements.txt)
- Requires Python 3.10+

## PolyAPI Java

- Java Client: [PolyAPI library](https://mvnrepository.com/artifact/io.polyapi/library/latest)
- Source Code: [polyapi/polyapi-java](https://github.com/polyapi/polyapi-java)
- Java Maven plugin: [PolyAPI Maven Plugin](https://mvnrepository.com/artifact/io.polyapi/polyapi-maven-plugin/latest)
- Java 17+
- Maven 3.6.3+
- Dependencies: [Client](https://mvnrepository.com/artifact/io.polyapi/library/latest#:~:text=Compile-,Dependencies,-(3)) & [Maven Plugin](https://mvnrepository.com/artifact/io.polyapi/polyapi-maven-plugin/latest#:~:text=Compile-,Dependencies,-(7))

## PolyAPI .NET (Beta)

- .NET Tool: [PolyApi.Tools](https://www.nuget.org/packages/PolyApi.Tools)
- Requires .NET SDK 8.0
- Requires VS Code Add-On: [C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csdevkit)
- Requires VS Code Add-On: [IntelliCode for C# Dev Kit](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.vscodeintellicode-csharp)

---

## webhooks/index

Source: https://docs.polyapi.io/webhooks/index.html

# Webhooks

Webhooks on PolyAPI are API endpoints you can stand up to receive events via HTTP calls.

You can add authentication, define your own custom webhook listeners,
or you can route your webhook events to server functions using triggers.

First we’ll talk about creating, updating, and deleting webhooks. Then we’ll show you how you can secure and test them.

- [Managing Webhooks](managing-webhooks.html)
- [Webhook Security Functions](webhook-security-functions.html)
- [Managing Triggers](managing-triggers.html)
- [Testing Webhooks](testing.html)

---

## webhooks/managing-triggers

Source: https://docs.polyapi.io/webhooks/managing-triggers.html

# Managing Triggers

Triggers link Events in one part of PolyAPI from some source to some destination.

Currently, the main supported trigger in PolyAPI is from a Webhook to a Server Function.

Let’s build one!

## Getting Started

To manage triggers on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must have the “Manage Triggers” permission to manage triggers.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create a Trigger

Click “Triggers” in the sidebar. Then click “+ Create”.

You should see a screen like this:

[![Trigger Create](../_images/trigger-create.png)](../_images/trigger-create.png)

Enter “TriggerTest” for the name.

For the “Source -> Webhook Handle ID”, enter your webhook handle ID.

For the “Destination -> Server Function ID”, enter your server function ID.

Note, your server function accept the standard Poly `Event` object as input.

Specifically, it should accept three objects as inputs:

- eventPayload
- headersPayload
- paramsPayload

Let’s use this example server function:

```
// npx poly function add --server --context test weeklyReport weeklyReport.ts
function weeklyReport(eventPayload, headersPayload, paramsPayload) {
    console.log("Running weekly report job!");
    return "Hello Weekly Report!";
}
```

When implementing Python server functions that handle webhook triggers, it’s crucial to define your function to accept exactly three arguments:
`eventPayload`, `headersPayload`, and `paramsPayload`. The execution will fail if the connected function doesn’t match this signature.
Alternatively, you can use variable-length argument syntax (`*args`) to accept these webhook parameters flexibly. Here’s an example:

```
def weekly_report(eventPayload, headersPayload, paramsPayload):
    print("Running weekly report job!")
    return "Hello Weekly Report!"

# Or using variable-length arguments:
def weekly_report(*args):
    eventPayload, headersPayload, paramsPayload = args
    print("Running weekly report job!")
    return "Hello Weekly Report!"
```

Normally this function runs as a cron Job as described in [Jobs](../jobs/index.html).

But let’s have our webhook trigger a manual run of this weekly report!

Note

For more details on how to create server functions, see [Generated SDKs](../generated_sdks/index.html) to create a server function in your language of choice!

The final option is “Wait for Response”.

If you want to hit your webhook, and have the HTTP request wait until the server function finishes and have the
output of the server function be your HTTP response, click “True”.

If on the other hand, you want your webhook to just kick off your server function, then immediately return a 200 OK response, click “Wait for Response: False”.

For testing, let’s select “Wait for Response: True”!

Finally, click “Save”

## Updating / Deleting a Trigger

After clicking “Save”, you should see your trigger’s detail page like this:

[![Trigger Detail](../_images/trigger-detail.png)](../_images/trigger-detail.png)

Click “Update” to update your trigger or “Delete” to delete it.

## Conclusion

That’s it! You’ve now created your first Webhook and your first Trigger on PolyAPI!

Now, let’s head over to [Testing Webhooks](testing.html) so we can see our new Webhook in action.

---

## webhooks/managing-webhooks

Source: https://docs.polyapi.io/webhooks/managing-webhooks.html

# Managing Webhooks

To manage webhooks on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must have the “Manage Webhooks” permission to manage webhooks.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create a Webhook

To create a Webhook, click “Webhooks” in the sidebar. Then click “+ Create”.

For the “Name”, let’s enter “TestWebhook”.

For the “Context”, let’s enter “test”.

Leave “Description” blank.

For “Visibility”, select “Environment”.

For “Event Payload”, let’s enter `{"n": 3}`.

Leave “Event Payload Type Schema” blank.

For “Method”, select “POST”.

Leave “Slug” and “Subpath” blank.

Leave “Require Poly API Key” as “false”. This means that the webhook will not require a PolyAPI key to be sent with the request.

For “Response”, let’s enter `{"answer": 6}`.

Leave “Response Status Code” blank to use the default of 200.

Leave all the “XML parser options” as “false”. The XML parser is used when the input for the webhook needs to be XML.
For this webhook, we will use normal JSON so we won’t need the XML parser.

Finally, scroll back up to the top of the page and click “Save” to create the webhook!

## Updating / Deleting a Webhook

After clicking save, you should see your webhook’s detail page like this:

[![Webhook Detail](../_images/webhook-detail.png)](../_images/webhook-detail.png)

Click “Update” to update your webhook or “Delete” to delete it.

## Conclusion

That’s it! You’ve now created your first webhook on PolyAPI!

But our webhook doesn’t really do anything with the events it receives yet.

Additionally anyone who knows about our webhook can send it events. Follow the steps outlined in [Webhook Security Functions](webhook-security-functions.html) to secure access to your webhook.

Or head over to [Managing Triggers](managing-triggers.html) to setup which server function we want to route the webhook events to.

---

## webhooks/testing

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

---

## webhooks/webhook-security-functions

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
