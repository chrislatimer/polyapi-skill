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
