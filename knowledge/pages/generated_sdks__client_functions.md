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
