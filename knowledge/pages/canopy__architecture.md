Source: https://docs.polyapi.io/canopy/architecture.html

# Canopy Architecture and Configurations

**Canopy** operates as a dynamically configurable UI framework within PolyAPI, enabling the creation of tailored user interfaces based on API configurations. This section provides an overview of Canopy’s architecture and the customizable properties and attributes that you can leverage when building **Canopy applications**.

## Canopy Architecture

### General Structure

**Canopy** functions as a **shell application** that dynamically configures itself based on **JSON application configurations**. The high-level structure of **Canopy** consists of the following elements:

- **Canopy Runtime**: The overarching execution environment for **Canopy applications**.
- **Configured Application**: Specific **Canopy-powered** application, defined within PolyAPI.
- **Configured Collection**: Logical grouping of resources within an application.
- **Item Detail**: A view displaying in-depth information about a specific resource within a collection.
- **Item Sub-page**: Additional pages within an item’s detail view.
- **Item Sub-collection**: A nested collection under a primary item.
- **Sub-item Detail**: A detail view for items within sub-collections.
- **Other collections and applications**: **Canopy** supports multiple collections and applications within the same runtime.

The hierarchy of **Canopy applications** is illustrated below:

```
    Canopy Runtime
    ├── Configured Application
    │   ├── Configured Collection
    │   │   ├── Item Detail
    │   │   │   ├── Item Sub-page
    │   │   │   ├── Item Sub-collection
    │   │   │   │   ├── Sub-item Detail
    │   ├── Other collections within the Application
    ├── Other Applications within the Runtime
```

### Base Route and Authentication

The **base route** of **Canopy** serves as the application launch screen. Depending on authentication status, users are either:

- Presented with a list of available **Canopy applications**.
- Redirected to a specific **Canopy application** login/signup screen for authentication.

For **hosted instances** of PolyAPI, the default application is typically **PolyUI**, used for managing Poly-related resources. In **self-hosted instances**, the default application can be modified within the next.config.mjs file.

### High Level Application Structure

Each **Canopy application** can define:

- **Metadata** to define branding and routing details.
- **Collections** for organizing resources.
- **Configurable login/signup screens** (within metadata) tailored to user authentication needs and branding.

## Customizing Canopy Applications

**Canopy applications** are fully customizable, enabling you to modify **metadata**, **collections**, **login/signup**, **items**, **sub-pages**, **sub-collections**, and **function/API operations** based on your requirements.

### Metadata Attributes

**Canopy applications** have a **metadata** property to define branding elements and navigation behavior:

- `name` Display name of the application.
- `subpath` Custom route for the application.
- `icon` URL for the application icon.
- `logoSrc` URL for the application logo.
- `login` Property for the login screen.
- `signUp` Property for the signup screen.

### Metadata Login Attributes

The **login** property within **metadata** can be customized with the following attributes:

- `title` Title for the login screen.
- `logoSrc` Logo for the login screen.

Example **metadata** configuration:

```
{
  "name": "Quantum Quirk",
  "subpath": "quantum-quirk-dashboard",
  "icon": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "login": {
    "title": "Login To Quantum Quirk Dashboard",
    "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.png"
}
```

### Metadata SignUp Attributes

**Canopy applications** support a **signUp** property, which configures the signup experience for users. This property consists of multiple steps, each defining fields and actions:

- `title` Title of the signup process.
- `logoSrc` URL for the signup logo.
- `steps` Ordered list of signup step properties.

Each **step** property within **signUp** can include the following attributes:

- `name` Unique identifier for the step.
- `title` Display title for the step.
- `subtitle` Descriptive text for the step.
- `fields` Array of input fields required for the step.
- `submit` Defines submission behavior for the step.
- `additionalInfo` Extra information displayed to users.
- `texts` Array of text fields and links for the step.

Each **field** property within a **step** can include the following attributes:

- `name` Field name.
- `type` [Supported Attribute Types](#types-section).
- `label` Display label for the field.
- `placeholder` Placeholder text.
- `required` Boolean indicating if the field is mandatory.
- `requiredError` Error message if the field is not filled.
- `values` Predefined options for `enum` fields with `name` and `value` attributes.
- `functionValues` API-driven options for `enum` fields.
- `showValue` Boolean indicating to show field value.
- `queryParam` Name of the query parameter to use as the field value.
- `labelHtml` HTML content for the field label.
- `helperText` Helper text for the field.

Each **submit** property within a **step** can include the following attributes:

- `label` Display label for the action.
- `function` Function property to configure execution upon submission.
- `redirectTo` URL for redirection after submission.
- `redirectWithQueryParams` Boolean indicating if query parameters should be included in the redirect.

[Function Property Attributes](#function-section) are covered below and work the same way for **submit** in **signup**.

Example **signUp** configuration:

```
"signUp": {
  "title": "Create an Account",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/signup-logo.png",
  "steps": [
    {
      "name": "userInfo",
      "title": "Sign Up",
      "fields": [
        { "name": "email", "type": "text", "label": "Email", "required": true },
        { "name": "firstName", "type": "text", "label": "First Name", "required": true },
        { "name": "lastName", "type": "text", "label": "Last Name", "required": true },
        { "name": "terms", "type": "checkbox", "label": "Agree to Terms", "required": true }
      ],
      "submit": {
        "label": "Sign Up",
        "function": { "path": "auth.createUser", "type": "server", "arguments": { "body": { "data": true } } },
        "redirectTo": "/dashboard"
      }
    }
  ]
}
```

### Collections

A **Collection** represents a structured list of items within a **Canopy application**. Key features include:

- **Card-based display** for intuitive visualization.
- **Item detail pages** for deeper exploration of individual records.
- **CRUD support** through Poly functions for authenticated users.

### Collection Configuration

Each **collection** is defined using a structured configuration that specifies:

- `id` A unique identifier.
- `name` Display name.
- `group` Group name for organizing collections.
- `nameProperty` Which property to use as the primary display name for items.
- `properties` A set of properties defining the item structure.
- `itemActions` (Optional) actions available for items list view.
- `list` and `get` Required CRUD operations for items.
- `create`, `update`, `delete` (Optional) CRUD operations for items.

Example **collection** configuration:

```
"collections": [
  {
    "id": "tasks",
    "name": "Tasks",
    "group": "Dashboard",
    "nameProperty": "title",
    "properties": {
      "id": {
        "label": "ID",
        "readOnly": true,
        "excludeFromCreate": true,
        "excludeFromUpdate": true
      },
      "title": {
        "label": "Title",
        "type": "text"
      },
      "description": {
        "label": "Description",
        "type": "multiline",
        "autoSize": true
      },
      "status": {
        "label": "Status",
        "type": "enum",
        "values": [
          {
            "name": "To Do",
            "value": "TODO"
          },
          {
            "name": "In Progress",
            "value": "IN_PROGRESS"
          }
        ]
      }
    },
    "itemActions": [
      "get",
      "update",
      "create"
    ],
    "create": {
      "actionLabel": "Add",
      "submitLabel": "Save",
      "cancelLabel": "Cancel",
      "function": {
        "path": "dashboard.createTask",
        "type": "server",
        "arguments": {
          "body": {
            "data": true
          }
        }
      }
    },
    "list": {
      "function": {
        "path": "dashboard.listTasks",
        "type": "server"
      }
    },
    "get": {},
    "update": {},
    "delete": {}
  }
]
```

### Item Properties

Each **item** within a **Canopy application collection** can include a variety of **customizable properties**, supporting different data types and UI behaviors.

**Canopy** supports the following pre-defined properties for showing basic item information and for navigation:

- `id` Unique identifier for the property.
- `name` Name for the property.
- `description` Description of the property.

Additional properties can be defined for each item based on use case.

### Supported Property Attributes

Each property can be customized with the following attributes:

- `label` Display name for the property.
- `type` Defines how the property is displayed in the UI.
- `values` Predefined options for `enum` type properties.
- `functionValues` Function to return list of predefined options for `enum` type properties.
- `key` Use property as key for CRUD operations.
- `readOnly` Prevents users from modifying the property.
- `excludeFromCreate`, `excludeFromUpdate` Hides the property from specific forms.
- `hideIfEmpty` Automatically hides the property in details view if no value exists.
- `autoSize` Automatically adjusts the input field size based on content.

### Supported Attribute Types

Types dictate how properties are displayed in the UI. Supported types include the following:

- `text` Simple text input.
- `multiline` Text area input.
- `number` Numeric input.
- `boolean` Checkbox input.
- `enum` Select input.
- `multi` Sting or JSON input.
- `nested` Nested object with properties.
- `array` Array of items with properties.
- `json` JSON code editor.
- `code` Code editor with language attribute.

Example **properties** configuration:

```
"properties": {
  "id": {
    "label": "ID",
    "readOnly": true,
    "excludeFromCreate": true,
    "excludeFromUpdate": true
  },
  "title": {
    "label": "Title",
    "type": "text"
  },
  "description": {
    "label": "Description",
    "type": "multiline",
    "autoSize": true
  },
  "status": {
    "label": "Status",
    "type": "enum",
    "values": [
      {
        "name": "To Do",
        "value": "TODO"
      },
      {
        "name": "In Progress",
        "value": "IN_PROGRESS"
      }
    ]
  }
}
```

## Function Configurations

**Canopy applications** support **CRUD operations** for managing **collection items**. Each **CRUD action** is associated with a **PolyAPI function** that performs the necessary operations. In addition to CRUD operations, **Canopy applications** can also leverage functions for other purposes, such as standalone item Sub-pages.

For **Canopy** to operate on **collection items**, it requires **PolyAPI functions** mapped to the following CRUD action properties:

- `list` Retrieves all items.
- `get` Fetches a single item.
- `create` Adds a new item.
- `update` Modifies an existing item.
- `delete` Removes an item.

### CRUD Property Attributes

Each CRUD action can be customized with the following attributes:

- `actionLabel` Display name for the action button.
- `submitLabel` Display name for the submit button.
- `cancelLabel` Display name for the cancel button.
- `function` Property for configuring Poly function associations.

### Function Property Attributes

- `path` Path to the function.
- `type` Type of function (`server` or `API`).
- `arguments` Arguments property to define what gets passed to the associated function. Configuration can draw from any params in the current url, or information from the user’s session data, or even from the collection items themselves.
- `mfaRequired` Specifies if MFA is required for the **function** being called.

### Function Arguments Property Attributes

Each argument within a function can be customized with one of the following attributes:

- `value` Specific static value of the argument.
- `apiKey` If true, value is filled with the API key currently being used by the app.
- `id` If true, value is filled with the item’s ID.
- `variableId` ID of the variable used as the argument, which is resolved by PolyAPI.
- `variablePath` Path (context.name) of the variable that is used as the value of the argument, resolved by PolyAPI.
- `data` If true, then the argument is filled with the data of the item for CRUD operations - if set to key of a property (e.g. “data”: “environmentId”), then the value of the property is used as the argument value.
- `tenant` If true, then the argument is filled with the tenant ID from the session API key.
- `environment` If true, then the argument is filled with the environment ID from the session API key.
- `pathParam` Name of the url path parameter (parsed from the url by nextjs) that is used as the value of the argument.
- `queryParam` Name of query parameter that is used as the value of the argument - additionally you can define a fallback attribute that is used as the value of the argument if the query parameter is not set - having this attribute equal to some property key, creates an additional filter field in the UI based on the property.

Example **function** configuration:

```
"create": {
  "actionLabel": "Add",
  "submitLabel": "Save",
  "cancelLabel": "Cancel",
  "function": {
    "path": "dashboard.createTask",
    "type": "server",
    "arguments": {
      "body": {
        "data": true
      }
    }
  }
}
```

Example **list function** configuration with pagination:

```
...other list properties
"paginated": true,
"function": {
  ...other function properties
  "arguments": {
    ...other arguments
    "page": {
      "queryParam": "page"
    },
    "pageSize": {
      "queryParam": "pageSize"
    },
  }
}
```

### Nested Collections and Sub-pages

Each **collection item** can contain additional **sub-collections** or **custom pages**, allowing for deeper nesting and extended functionality.

- **Sub-collections**: Support their own CRUD functions and nested structures.
- **Item Pages**: Custom standalone views powered by Poly functions.

### Development Cycle for Canopy Applications

**Canopy application** configurations can be edited and applied directly from within the **PolyAPI UI** or via Poly’s API endpoint `PUT /applications/{id}/config`.

## Conclusion

**Canopy** provides a flexible, API-driven framework for dynamically generating UI applications. By leveraging customizable collections, properties, attributes, and function configurations, you can tailor **Canopy applications** to fit your specific use cases.

To learn more, checkout [Using a Canopy Application](using_canopy.html).
