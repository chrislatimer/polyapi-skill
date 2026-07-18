Source: https://docs.polyapi.io/authentication/setup-sso.html

# Setting up Single Sign-On

PolyAPI supports single sign-on (SSO) using OpenID Connect for your tenant users using your preferred identity provider. Whether you use a public identity provider like Google, Okta, Microsoft, or even if you have your own private identity provider: PolyAPI supports them.

Once you’ve created your PolyAPI tenant and have logged into the PolyAPI application, you’ll be able to start setting up single sign-on and allow your users to log into Poly.

## Setting up Single Sign-On

1. Add your org or tenant id to your PolyAPI tenant. This is the id used by your SSO Identity Provider. For example if your team uses Google Workspace, then this will be the domain of your orgs’ email address, ex. `polyapi.io`

   [![Editing a tenant via the PolyAPI UI](../_images/sso-update-tenant.png)](../_images/sso-update-tenant.png)
2. For each user on your team you wish to allow to SSO into Poly, create a User record in Poly and add their unique SSO ID to their profile. This is typically the id used as the `sub` claim by your identity provider.

   [![Editing a user record via the PolyAPI UI](../_images/sso-update-user.png)](../_images/sso-update-user.png)
3. Configure one or more permission policies for your users which will grant them some set of permissions to one or more of your tenant environments.

   [![Creating a permission policy granting a user access to several environments](../_images/sso-permission-policies.png)](../_images/sso-permission-policies.png)
4. Create a client application in your identity provider system. Your identity provider will assign your application a Client ID, and a Client Secret which you will need in the next step.
5. Register your identity provider in PolyAPI. Set the full url for your identity provider. For example if you’re using Google, then this would be `https://accounts.google.com`. For providers like Okta, this will be your custom Okta domain which includes your custom subdomain.

   Enter the Client ID and Client Secret obtained in the previous step, and make sure you enable the identity provider.

   [![Creating an identity provider](../_images/sso-identity-providers.png)](../_images/sso-identity-providers.png)
6. Create a public PolyAPI Application which your team can use to login to PolyAPI. We’ve provided a template application config below for you to copy, and customize. Be sure to update the subpath to one unique to your tenant that your team will recognize. Lastly make sure to set the id and name of your identity provider.

   ```
   {
       "name": "Your Tenant Name",
       "subpath": "unique-subpath",
       "icon": "/canopy/PolyLogo.svg",
       "login": {
           "title": "Login To Poly",
           "logoSrc": "https://polyapi.io/wp-content/uploads/2024/07/polyapi-logo-color-2024.webp",
           "identityProviders": [
               {
                   "id": "UUID of your identity provider",
                   "name": "Google"
               }
           ],
           "loginToPoly": true,
           "allowPolyApiKey": false,
           "redirectTo": "/polyui/collections/api-functions"
       },
       "collections": []
   }
   ```
7. Once your PolyAPI application is created you’ll need to return to your identity provider and finish configuring the client application. Most providers need some or all of the following data:

   Valid Domain: `https://na1.polyapi.io`

   Redirect URL: `https://na1.polyapi.io/canopy/unique-subpath/auth/finish-oauth`

   Login URL: `https://na1.polyapi.io/canopy/unique-subpath/login`

   Logout URL: `https://na1.polyapi.io/canopy/unique-subpath/logout`

   Note that the URLs provided here are for our NA1 instance. Please replace `na1` with your instance, ex. `https://eu1.polyapi.io` or `https://na2.polyapi.io`
8. At this point your team mates should be able to navigate to your canopy application:
   `https://na1.polyapi.io/canopy/unique-subpath/login`

   Share it with your team and have them bookmark this as their way of authenticating into PolyAPI.

   [![Example application showing Google SSO button for authenticating into PolyAPI](../_images/sso-login-app-example.png)](../_images/sso-login-app-example.png)
