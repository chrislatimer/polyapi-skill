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
