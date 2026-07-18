Source: https://docs.polyapi.io/authentication/index.html

# Authentication

Poly’s authentication system is designed to provide robust, flexible, and secure access to your resources. Here’s how it works:

## API Keys and Permissions

**Environment-Specific Access:** API Keys are tied to a specific Environment, ensuring scoped access to resources.

**Granular Permissions:** Define permissions for each API Key to control access at a fine-grained level.

**User Access:** Assign API Keys to users to enable access; without an API Key, users cannot interact with resources.

## Single Sign-On

PolyAPI also supports single sign-on (SSO) through your preferred identity provider, in addition to API keys. We are compatible with any provider that uses the OpenID Connect protocol, including public providers like Google and Okta, as well as private providers.

Learn more: [Setting up Single Sign-On](setup-sso.html)

## Multi-Factor Authentication (MFA)

Poly supports MFA to enhance security for your account.

Administrators can enable or disable MFA at the Tenant level to make MFA available across the organization. This configuration allows users to set up MFA individually but does not enforce it.

Users can set up MFA for their accounts to add an extra layer of security. Once enabled, users authenticate with a second factor during login.

For more details, see the following pages:

- [Managing Users and API Keys](managing-users-and-api-keys.html)
- [API Key Permissions](api-key-permissions.html)
- [Enable MFA for Your Tenant](enable-mfa-tenant.html)
- [Setting up MFA for your User Account](setup-user-mfa.html)
- [Setting up Single Sign-On](setup-sso.html)
