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
