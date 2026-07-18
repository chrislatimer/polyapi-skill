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
