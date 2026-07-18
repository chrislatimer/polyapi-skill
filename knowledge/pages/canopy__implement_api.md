Source: https://docs.polyapi.io/canopy/implement_api.html

# Enhancing Canopy Applications with APIs

**Canopy applications** can leverage API functions to interact with external services, fetch dynamic data, and extend application functionality. This guide will build upon the previous page where we covered [Implementing CRUD Operations in Canopy Applications](implement_crud.html), and show you how to configure your **Canopy application** to call API functions.

## Expanding the Configuration to Include API Functions

To enhance our existing example application **Quantum Quirk**, we will update the JSON configuration to display all the server functions we created earlier via **Out of the Box (OOB)** publicly available APIs. This will allow users to browse and interact with server functions they have access to.

To do this, we will add a new collection called **Poly Server Functions** to the JSON configuration. We’ll add it to the same group **Dashboard**. The collection will be displayed in the sidebar of the application under tasks.

### Updating the JSON Configuration

Below is the updated JSON configuration with a new **Poly Server Functions** collection:

```
{
  "name": "Quantum Quirk",
  "subpath": "quantum-quirk-dashboard",
  "icon": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.svg",
  "login": {
    "title": "Login To Quantum Quirk Dashboard",
    "logoSrc": "https://polyapi-public.s3.us-west-2.amazonaws.com/clients/quantum-quirk/quantum-quirk.png"
  },
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
            },
            {
              "name": "Completed",
              "value": "COMPLETED"
            }
          ]
        },
        "priority": {
          "label": "Priority",
          "type": "enum",
          "values": [
            {
              "name": "Low",
              "value": "LOW"
            },
            {
              "name": "Medium",
              "value": "MEDIUM"
            },
            {
              "name": "High",
              "value": "HIGH"
            }
          ]
        },
        "due_date": {
          "label": "Due Date",
          "type": "text"
        },
        "assignee": {
          "label": "Assignee",
          "type": "text"
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
      "get": {
        "function": {
          "path": "dashboard.getTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            }
          }
        }
      },
      "update": {
        "actionLabel": "Edit",
        "submitLabel": "Save",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.updateTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            },
            "body": {
              "data": true
            }
          }
        }
      },
      "delete": {
        "actionLabel": "Delete",
        "submitLabel": "Confirm",
        "cancelLabel": "Cancel",
        "function": {
          "path": "dashboard.deleteTask",
          "type": "server",
          "arguments": {
            "id": {
              "id": true
            }
          }
        }
      }
    },
    {
      "id": "server-functions",
      "name": "Poly Server functions",
      "group": "Dashboard",
      "nameProperty": "contextName",
      "properties": {
        "id": {
          "label": "ID",
          "excludeFromCreate": true,
          "readOnly": true
        },
        "name": {
          "label": "Name"
        },
        "context": {
          "label": "Context"
        },
        "contextName": {
          "label": "Context Name (computed)",
          "readOnly": true,
          "excludeFromCreate": true,
          "excludeFromUpdate": true
        },
        "description": {
          "label": "Description",
          "type": "multiline",
          "autoSize": true
        },
        "visibility": {
          "type": "enum",
          "label": "Visibility",
          "values": [
            {
              "name": "Public",
              "value": "PUBLIC"
            },
            {
              "name": "Environment",
              "value": "ENVIRONMENT"
            },
            {
              "name": "Tenant",
              "value": "TENANT"
            }
          ]
        }
      },
      "list": {
        "function": {
          "path": "OOB.polyapi.serverFunctions.list",
          "type": "api",
          "arguments": {
            "instanceUrl": {
              "variablePath": "OOB.polyapi.configurations.instanceUrl"
            },
            "polyAPIKey": {
              "apiKey": true
            }
          }
        }
      },
      "get": {
        "function": {
          "path": "OOB.polyapi.serverFunctions.get",
          "type": "api",
          "arguments": {
            "instanceUrl": {
              "variablePath": "OOB.polyapi.configurations.instanceUrl"
            },
            "polyAPIKey": {
              "apiKey": true
            },
            "id": {
              "id": true
            }
          }
        }
      }
    }
  ]
}
```

### Explanation of the Changes

- New Collection: **Poly Server Functions** displays all the server functions available to this environment.
- **list** Function: Calls the public API OOB.polyapi.serverFunctions.list to fetch the environment’s server functions.
- **get** Function: Retrieves the property details for a specific server function using OOB.polyapi.serverFunctions.get.
- Properties: Key details that we included in our config from server function attributes such as `name`, `context`, `description`, and `visibility`.

### Updating Your Canopy Application

1. Navigate to **Applications** in PolyUI.
2. Select your application (Quantum Quirk).
3. Click the “Update” button to modify the configuration.
4. Replace the existing JSON configuration with the updated version above.
5. Click “Submit” to apply the changes.

Pro Tip

You can iterate even faster by using Poly’s API endpoint `PUT /applications/{id}/config` to push your config changes to PolyAPI.

Once submitted, the application will now include a section displaying all server functions accessible to the user.

Login to the application at `/canopy/<your-subpath>/login` and you should see the following list view of this latest collection in your application:

[![Canopy Application Server Functions List](../_images/canopy-app-funcs-list.png)](../_images/canopy-app-funcs-list.png)

### Conclusion

By following this guide, you have successfully:

- Integrated public API functions into your **Canopy application** ✅
- Enabled users to browse and inspect server functions in the UI ✅
- Extended your **Canopy application** beyond CRUD operations ✅

With API functions now available, you can further enhance functionality by adding custom execution actions or integrating third-party APIs. 🚀
