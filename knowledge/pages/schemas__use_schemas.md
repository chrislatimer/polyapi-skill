Source: https://docs.polyapi.io/schemas/use_schemas.html

# Using Schemas

Schemas are made accessible when developing integrations in PolyAPI, both when using the client SDK as well as within the tree view in the VSCode extension.

## Schemas within your code using the SDK

Schemas are currently supported by both the TypeScript and Python client libraries and work similarly across both.

Schemas are made available under the `schemas` namespace and can be imported from the `polyapi` library once you’ve generated the SDK locally.

Below are some code examples of importing and using a schema like this one shown here:

[![Screenshot of an example schema in the PolyAPI web UI with the name 'UserRecord' and context 'demo.users'](../_images/schema_detail_view.png)](../_images/schema_detail_view.png)

Example of using a schema for a function argument:

TypeScript

```
import { schemas } from 'polyapi';

function processUserRecord(user: schemas.Demo.Users.UserRecord): void {
    const fullName = `${user.first_name} ${user.last_name}`;
    console.log(`Processing record for user: ${fullName}, (id: ${user.id})`);
    // ...rest of function
}
```

Python

```
from polyapi import schemas

def processUserRecord(user: schemas.demo.users.UserRecord) -> void:
    full_name = f'{user.first_name} {user.last_name}'
    print(f'Processing record for user: {full_name}, (id: {user.id})')
    # ...rest of function
```

Example of using a schema for a function return type:

TypeScript

```
import { schemas } from 'polyapi';

function generateUserRecord(
    id: number,
    first_name: string,
    last_name: string
): schemas.Demo.Users.UserRecord {
    return { id, first_name, last_name };
}
```

Python

```
from polyapi import schemas

def generateUserRecord(
    id: int,
    first_name: str,
    last_name: str
) -> schemas.demo.users.UserRecord:
    return {
      'id': id,
      'first_name': first_name,
      'last_name': last_name,
    }
```

Note

Not every JSONSchema attribute can be expressed as TypeScript or Python types, but each client will generate as complete a type as is possible.

## Schemas within the VSCode Extension

Schemas are shown within your PolyAPI tree view alongside your functions and variables based on their context path, but are collected under a ‘Schemas’ tree to prevent them from overwhelming the view.

[![View of the Tree view panel in the PolyAPI VSCode Extension showing schemas grouped together, as well as Intellisense popup panel showing generated type definition in the SDK when hovering over a Schema.](../_images/schema_tree_view.png)](../_images/schema_tree_view.png)

Hovering over a schema will show you the written description for it, and will give you a link to view the schema details within the PolyAPI web UI where it can be updated as needed.

Clicking a schema in the tree will copy the schema’s path for you to use within your code. Simply paste it where you need it, and update your code imports accordingly to make sure the `schemas` namespace is in scope.

## Adding a Schema to an API Function

For API’s trained via Postman or created via the PolyAPI web UI they likely won’t be linked with any Schema. But it’s easy to modify them via the PolyAPI web UI to use a schema for an argument or a return type.

1. Navigate to the API function you wish to use the schema within, and click the edit button.

   [![View of an API function that we want to add a schema to within the PolyAPI web UI.](../_images/api_function_without_schema.png)](../_images/api_function_without_schema.png)
2. Update the return type schema with a barebones schema that includes the `x-poly-ref` attribute whose value is an object containing a `path` key mapping to the full context and name path of the schema we want to use for the return type.

   [![View of adding a schema to an API function Return Type Schema that reference a PolyAPI Schema.](../_images/adding_schema_to_api_function.png)](../_images/adding_schema_to_api_function.png)
3. Save the form and then you’re good to go! In your local development environment regenerate the SDK and you should now see updated types when hovering over the function, and should get full type safety when accessing properties defined within the schema.

   [![View of a type error when attempting to use an API function whose return value conforms to a PolyAPI Schema.](../_images/using_api_function_with_schema.png)](../_images/using_api_function_with_schema.png)
