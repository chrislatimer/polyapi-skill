Source: https://docs.polyapi.io/vari_variables/ui.html

# Vari Management UI

To manage variables on PolyAPI, head to this path on your instance:

`/canopy/polyui/login`

For example, on `na1`, the path would be:

<https://na1.polyapi.io/canopy/polyui/login>

Enter your api key to login and let’s begin!

Note

You must have the “Manage Variables” permission to manage variables.

Please contact your tenant administrator or [support@polyapi.io](mailto:support%40polyapi.io) if you need these permissions added!

## Create a Variable

Click “Variables” in the sidebar to see the following screen:

[![Variable List](../_images/vari-init.png)](../_images/vari-init.png)

Click “+ Create” to get started.

Enter a context, name, and description for your variable.

For this example, let’s have the context be `test` and the name be `test1`.

Then select visibility. For now, let’s just select “Environment”.

Note

Environment is the most common variable visibility.

Only other api keys within your specific environment will have access to this variable.

Leave “Secret” as “No” for now.

Secret variables will be covered in the next section of the docs: [Vari in Your Code](code.html)

Enter your value. For now, let’s just do the string “abc”.

Finally, click “Create” to create your variable!

## Update/Delete a Variable

If you go back to your variable list, you should see your new variable.

Note

You may have to refresh the page to see your new variable in the list.

- NA1 link: <https://na1.polyapi.io/canopy/polyui/collections/variables>
- EU1 link: <https://eu1.polyapi.io/canopy/polyui/collections/variables>

Click “Show Details” on your variable to see the following:

[![Variable Detail](../_images/vari-detail.png)](../_images/vari-detail.png)

From this screen, just click “Update” to update your variable or “Delete” to delete it!

## Conclusion

That’s it! You’ve now:

- created a new variable through the UI
- explored updating/deleting variables through the UI

In the next section, we’ll explore [how to use Vari Variables in your code](code.html)!
