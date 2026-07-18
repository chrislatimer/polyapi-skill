Source: https://docs.polyapi.io/authentication/api-key-permissions.html

# API Key Permissions

PolyAPI provides a fine-grained permissions system for API keys, allowing precise control over what operations can be performed. Permissions can be assigned at both the environment and tenant levels, with most permissions being environment-scoped except for tenant and user management which are tenant-wide.

![PolyApi api key permission example](../_images/api-key-create.png)

API keys are the gateway to interacting with Poly’s backend and frontend features. By assigning the right permissions, you can ensure that each key only has access to the resources and actions it truly needs. This helps keep your environments secure and your workflows efficient.

## Environment-Scoped Permissions

Environment-scoped permissions let you control access to specific features and resources within a given environment (such as development, staging, or production). This means you can grant different levels of access to different teams or automation scripts, depending on their needs.

1. **Execute Functions**

   Allows invocation and usage of all primitives in Poly.

   - Execute API Functions
   - Execute Server Functions
   - Trigger Webhooks
   - Use execution endpoints
   - Access generated libraries
2. **Use Applications**

   Enables access to Canopy applications.

   - Access Poly Management UI
   - Use other applications protected by PolyAPI keys
   - View application interfaces
3. **Generate Library**

   Permits generation of SDKs and libraries.

   - Generate SDKs for integration
   - Create client libraries
   - Generate API documentation
4. **Manage API Functions**

   Full control over API function management.

   - Create new API functions
   - Modify existing functions
   - Delete functions
   - Manage function training
   - Configure function settings
5. **Manage Webhooks**

   Control over webhook configuration.

   - Create webhooks
   - Modify webhook settings
   - Delete webhooks
   - Configure webhook endpoints
6. **Manage Triggers**

   Management of trigger configurations.

   - Create triggers
   - Modify trigger settings
   - Delete triggers
   - Configure trigger conditions
7. **Custom Dev**

   Development and deployment capabilities.

   - Deploy client functions
   - Deploy server functions
   - Redeploy functions
   - Manage development environments
   - Access development tools
8. **Manage Applications**

   Control over application management.

   - Create applications
   - Modify application settings
   - Delete applications
   - Configure application access
   - Manage application resources
9. **Manage Schemas**

   Schema management capabilities.

   - Create schemas
   - Modify schemas
   - Delete schemas
   - Validate schemas
   - Manage schema versions
10. **Auth Config**

    Authentication configuration management.

    - Configure authentication providers
    - Manage auth settings
    - Set up SSO
    - Configure OAuth
    - Manage API key authentication
11. **Manage Snippets**

    Code snippet management.

    - Create snippets
    - Modify snippets
    - Delete snippets
    - Publish snippets from CLI
    - Share snippets
12. **Manage Variables**

    Management of non-secret variables.

    - Create variables
    - Modify variables
    - Delete variables
    - View variable values
    - Manage variable scopes
13. **Manage Secret Variables**

    Management of sensitive variables.

    - Create secret variables
    - Modify secret variables
    - Delete secret variables
    - Rotate secrets
    - Manage secret access
14. **Manage Jobs**

    Job management capabilities.

    - Create jobs
    - Modify job settings
    - Delete jobs
    - View job status
    - Manage job schedules

## Tenant-Scoped Permissions

Some permissions operate at the tenant level, giving administrators the ability to manage users, API keys, and tenant-wide settings across all environments. These are powerful permissions and should be granted with care.

15. **Manage Users** (Admin-only)

    User and API key management across all environments.

    - Create users
    - Modify user settings
    - Delete users
    - Manage user roles
    - Create and manage API keys
    - Reset user MFA
    - Manage user permissions
16. **Manage Tenant** (Admin-only)

    Tenant-level configuration and management.

    - Configure tenant settings
    - View audit logs
    - Manage environments
    - Change tier settings
    - Configure tenant-wide policies

## Important Notes

Assigning permissions is a critical part of securing your Poly environment. Here are some key points and best practices to keep in mind as you manage API keys:

- **Admin-Only Permissions**

  - Manage Users and Manage Tenant permissions are restricted to admin keys only
  - These permissions operate at the tenant level, affecting all environments
- **Environment Scoping**

  - Most permissions are scoped to specific environments
  - This allows for granular control over different development, staging, and production environments
- **Default Access**

  - All users with valid keys retain access to the Poly AI Assistant
  - This is a system-wide permission that cannot be revoked
- **Security Considerations**

  - Secret variables require special handling and should be managed carefully
  - Admin permissions should be granted judiciously
  - Regular review of permissions is recommended
- **Best Practices**

  - Use the principle of least privilege when assigning permissions
  - Regularly audit API key usage and permissions
  - Rotate API keys periodically
  - Use environment-specific keys for different deployment stages

By thoughtfully assigning permissions and following these guidelines, you can ensure your Poly-powered applications remain secure, flexible, and easy to manage for your team.
