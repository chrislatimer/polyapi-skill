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
