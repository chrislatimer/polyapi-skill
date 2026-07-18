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
