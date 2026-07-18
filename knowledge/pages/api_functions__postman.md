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
