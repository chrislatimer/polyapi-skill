Source: https://docs.polyapi.io/schemas/index.html

# Schemas

**Schemas** is how PolyAPI allows for defining and sharing resource type definitions while keeping a single source of truth, and builds on [JSONSchema](https://json-schema.org/) definitions.

Schemas can be used to specify things like arguments and return types for your functions bringing greater type safety. Schemas can be created manually from the PoyAPI web UI, or if you train an OpenAPI specification to Poly: any detected schemas will get pulled out and trained as a Schemas in your PolyAPI environment.

Schemas defined by your team, or made public to your development environment will be converted into typed interfaces you can import and reference easily within your code.

- [Creating Schemas](create_schemas.html)
- [Using Schemas](use_schemas.html)
