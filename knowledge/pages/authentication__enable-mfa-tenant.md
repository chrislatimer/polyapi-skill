Source: https://docs.polyapi.io/authentication/enable-mfa-tenant.html

# Enable MFA for Your Tenant

By default, tenants do not have MFA turned on.
However, you can enable MFA for your tenant to add an extra layer of security.

To turn on MFA, please email [support@polyapi.io](mailto:support%40polyapi.io) and we will configure both of the required configuration variables with these calls:

```
PATCH <YOUR_INSTANCE>/tenants/<YOUR_TENANT_ID>/config-variables/MfaEnabled
{"value": true}
```

```
PATCH <YOUR_INSTANCE>/tenants/<YOUR_TENANT_ID>/config-variables/MfaRequiredActions
{
    "value": {
        "variable": {
            "update": true,
            "delete": true
        }
    }
}
```

After your tenant has been setup and your tenant admins have added their personal MFA devices, tenant admins will be able to make the above calls to update your tenant MFA configuration.

Replace `<YOUR_INSTANCE>` with your instance’s base URL, ex <https://na1.polyapi.io> and replace `<YOUR_TENANT_ID>` with your actual tenant UUID.

To see how to setup MFA as a user, see [Setting up MFA for your User Account](setup-user-mfa.html).

Please contact [support@polyapi.io](mailto:support%40polyapi.io) if you have any questions!
