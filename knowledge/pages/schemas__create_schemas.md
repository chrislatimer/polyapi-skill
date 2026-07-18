Source: https://docs.polyapi.io/schemas/create_schemas.html

# Creating Schemas

How to create schemas in PolyAPI

## Create from an OpenAPI Specification

When you convert a full OpenAPI specification to a Poly spec and train it, any schemas defined within will be detected and made into a PolyAPI Schema. The process for doing this is exactly as documented here: [Using OpenAPI Specs](../api_functions/openapi.html)

Once you’ve converted your OpenAPI specification using the `npx poly model generate` command you can open the generated JSON file where you’ll see an array of Schemas that were referenced in the specification and are ready to be trained to Poly like this:

[![Screenshot of schemas detected in an OpenAPI specification and converted into a format ready to be trained to Poly.](../_images/oas_converted_schemas.png)](../_images/oas_converted_schemas.png)

At this point running the `npx poly model train` command will train all the functions, webhooks, and schemas into your environment in PolyAPI.

## Creating from Scratch in the PolyAPI Web UI

1. Navigate to the schemas collection in the PolyAPI web UI, and click the ‘Create’ button.

   [![Screenshot of the Schemas collection in the PolyAPI web UI.](../_images/schema_collection.png)](../_images/schema_collection.png)
2. Give your Schema a name and context path. Then set the visibility of your Schema to `ENVIRONMENT`.

   [![Screenshot of creating a schema in the PolyAPI web UI with the name 'UserRecord' and context 'demo.users'](../_images/schema_create_form.png)](../_images/schema_create_form.png)
3. Add a JSONSchema into the definition field. Here’s an example definition you can use just to see how this works:

   ```
   {
     "type": "object",
     "properties": {
       "id": {
         "type": "integer"
       },
       "first_name": {
         "type": "string"
       },
       "last_name": {
         "type": "string"
       },
       "email": {
         "type": "string",
         "nullable": true
       }
     },
     "required": [
       "id",
       "first_name",
       "last_name"
     ],
     "additionalProperties": false
   }
   ```
4. Submit the form to create a schema.

   [![Screenshot of the detail view of the 'demo.users.UserRecord' schema in the PolyAPI web UI ready to be used.](../_images/schema_detail_view.png)](../_images/schema_detail_view.png)

At this point you can now use your schema in your local development environment following the steps outlined here: [Using Schemas](use_schemas.html)

## Creating Schemas That Reference Other Schemas

PolyAPI Schemas can reference other Schemas using the `x-poly-ref` attribute. Let’s make a new schema that reference the `UserRecord` schema we made previously.

1. Navigate to the schemas collection in the PolyAPI web UI, and click the ‘Create’ button.
2. Give this Schema a name and context path. Then set the visibility to `ENVIRONMENT`.

   [![Screenshot of creating a schema in the PolyAPI web UI with the name 'GroupRecord' and context 'demo.users'](../_images/schema_create_form_2.png)](../_images/schema_create_form_2.png)
3. Add a JSONSchema into the definition field. For properties that you want to reference an existing PolyAPI schema simple give it a `x-poly-ref` attribute whose value is an object containing a `path` key mapping to the full context and name path of the other schema. Here’s an example definition you can use just to see how this works:

   ```
   {
     "type": "object",
     "properties": {
       "id": {
         "type": "integer"
       },
       "name": {
         "type": "string"
       },
       "members": {
         "type": "array",
         "items": {
           "x-poly-ref": {
             "path": "demo.users.UserRecord"
           }
         }
       }
     },
     "required": [
       "id",
       "name",
       "members"
     ],
     "additionalProperties": false
   }
   ```
4. Submit the form to create a schema.

   [![Screenshot of the detail view of the 'demo.users.GroupRecord' schema in the PolyAPI web UI ready to be used.](../_images/schema_group_detail_view.png)](../_images/schema_group_detail_view.png)
