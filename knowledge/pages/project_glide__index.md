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
