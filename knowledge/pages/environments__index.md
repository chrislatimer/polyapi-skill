Source: https://docs.polyapi.io/environments/index.html

# Environments

In PolyAPI if you want to separate your functions, variables, etc., you can use environments.

All API keys, functions, variables, etc are scoped to a specific environment.

Individual API Keys only allow access to their specific environment.

Functions and variables in one environment are not accessible from another environment (unless explicitly shared).

Environments can either represent different stages of your application (dev, prod, etc) or different teams or projects.

## Dev vs Prod

The most common separation is to have a development environment and a production environment.

You have one set of functions in development and another in production and hack on the development environment without affecting production.

Almost everything on PolyAPI is associated with a distinct environment, including:

- Functions
- Vari Variables
- API Keys
- Snippets
- Jobs
- Webhooks
- Auth Providers

First we’ll look at how to create and update envrionments in the UI.

Then we will look at how, in your codebase, you can push your functions, variables, etc to a new environment.

- [Managing Environments](ui.html)
- [Pushing to Another Environment](pushing.html)
