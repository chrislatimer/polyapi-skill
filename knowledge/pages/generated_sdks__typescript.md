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
