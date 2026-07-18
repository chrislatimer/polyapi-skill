Source: https://docs.polyapi.io/canopy/implement_crud.html

# Implementing CRUD Operations in Canopy Applications

**Canopy** enables you to build fully functional applications with an auto-generated UI backed by API-driven configurations. A key part of these applications is implementing CRUD (Create, Read, Update, Delete) operations to allow users to manage their data seamlessly.

If you haven’t yet set up a **Canopy application**, we recommend first visiting the previous page to [Create a Canopy UI Application](create_application.html) to learn how to define an application structure. This guide will build upon that foundation and will use the example JSON configuration provided.

Important

The minimum requirements for a functional Canopy application are **list** and **get** operations.

## Adding CRUD to a Canopy Application Collection

To implement CRUD in the example “Tasks” collection for the “Quantum Quirk” application, you’ll need to map each operation to a server function in PolyAPI. Let’s start by creating some very basic server functions in a namespace called “dashboard” that will handle the operations.

### Create CRUD Server Functions

For the sake of simplicity, let’s use `Vari` to hold a sample dataset of our tasks. Head over to [Vari Management UI](../vari_variables/ui.html) and create the following variable:

- Name: tasks
- Context: dashboard
- Description: (Optional)
- Visibility: Environment
- Secret: False

Select “Object” and submit with the following:

```
[
    {
        "id": "1001",
        "title": "Schrödinger’s Task",
        "description": "Both complete and incomplete until observed.",
        "status": "TODO",
        "priority": "HIGH",
        "due_date": "2023-10-01",
        "assignee": "User A"
    },
    {
        "id": "1002",
        "title": "Entanglement Experiment",
        "description": "Progress is mysteriously linked to another task.",
        "status": "IN_PROGRESS",
        "priority": "MEDIUM",
        "due_date": "2023-10-05",
        "assignee": "User B"
    },
    {
        "id": "1003",
        "title": "Warp Drive Calibration",
        "description": "Successfully bent space-time (or at least completed the task).",
        "status": "COMPLETED",
        "priority": "LOW",
        "due_date": "2023-10-10",
        "assignee": "User C"
    }
]
```

Using your language of choice, create the server functions below for mapping the CRUD operations.
If you need a refresher on how to create and deploy server functions head back to [Generated SDKs](../generated_sdks/index.html) and select your language.

TypeScript

Function for **create** operation:

```
// create-task.ts
import { vari } from 'polyapi';

async function createTask(body: any): Promise<boolean> {
  const tasks = await vari.dashboard.tasks.get();

  let newId = "1";
  if (tasks.length > 0) {
    const maxId = Math.max(...tasks.map(task => parseInt(task.id, 10)));
    newId = (maxId + 1).toString();
  }

  body.id = newId;
  tasks.push(body);

  await vari.dashboard.tasks.update(tasks);

  return true;
}
```

Function for **list** operation:

```
// list-tasks.ts
import { vari } from 'polyapi';

async function listTasks(): Promise<any[]> {
  return await vari.dashboard.tasks.get();
}
```

Function for **get** operation:

```
// get-task.ts
import { vari } from 'polyapi';

async function getTask(id: string): Promise<any | null> {
  const tasks = await vari.dashboard.tasks.get();
  const task = tasks.find(task => task.id === id);

  return task || null;
}
```

Function for **update** operation:

```
// update-task.ts
import { vari } from 'polyapi';

async function updateTask(id: string, body: any): Promise<boolean> {
  const tasks = await vari.dashboard.tasks.get();
  const existingTaskIndex = tasks.findIndex(task => task.id === id);

  if (existingTaskIndex !== -1) {
    tasks[existingTaskIndex] = { ...tasks[existingTaskIndex], ...body };
    await vari.dashboard.tasks.update(tasks);
  } else {
    throw new Error(`Task with ID ${id} not found.`);
  }

  return true;
}
```

Function for **delete** operation:

```
// delete-task.ts
import { vari } from 'polyapi';

async function deleteTask(id: string): Promise<boolean> {
  const tasks = await vari.dashboard.tasks.get();
  const existingTaskIndex = tasks.findIndex(task => task.id === id);

  if (existingTaskIndex !== -1) {
    tasks.splice(existingTaskIndex, 1);
    await vari.dashboard.tasks.update(tasks);
  } else {
    throw new Error(`Task with ID ${id} not found.`);
  }

  return true;
}
```

Deploy the functions:

```
$ npx poly function add createTask create-task.ts --context dashboard --server
$ npx poly function add listTasks list-tasks.ts --context dashboard --server
$ npx poly function add getTask get-task.ts --context dashboard --server
$ npx poly function add updateTask update-task.ts --context dashboard --server
$ npx poly function add deleteTask delete-task.ts --context dashboard --server
```

Python

Function for **create** operation:

```
# create_task.py
import json
from polyapi import vari

def create_task(body: dict) -> bool:
    tasks = json.loads(vari.dashboard.tasks.get())

    if tasks:
        max_id = max(int(task["id"]) for task in tasks)
        new_id = str(max_id + 1)
    else:
        new_id = "1"

    body["id"] = new_id
    tasks.append(body)
    vari.dashboard.tasks.update(json.dumps(tasks))

    return True
```

Function for **list** operation:

```
# list_tasks.py
import json
from typing import Any
from polyapi import vari

def list_tasks() -> Any:
    return json.loads(vari.dashboard.tasks.get())
```

Function for **get** operation:

```
# get_task.py
import json
from typing import Any, Optional
from polyapi import vari

def get_task(id: str) -> Optional[Any]:
    tasks = json.loads(vari.dashboard.tasks.get())
    task = next((task for task in tasks if task.get("id") == id), None)

    return task
```

Function for **update** operation:

```
# update_task.py
import json
from polyapi import vari

def update_task(id: str, body: dict) -> bool:
    tasks = json.loads(vari.dashboard.tasks.get())
    existing_task_index = next((index for (index, task) in enumerate(tasks) if task['id'] == id), None)

    if existing_task_index is not None:
        tasks[existing_task_index].update(body)
        vari.dashboard.tasks.update(json.dumps(tasks))
    else:
        raise ValueError(f"Task with ID {id} not found.")

    return True
```

Function for **delete** operation:

```
# delete_task.py
import json
from polyapi import vari

def delete_task(id: str) -> bool:
    tasks = json.loads(vari.dashboard.tasks.get())
    existing_task_index = next(
        (index for index, task in enumerate(tasks) if task["id"] == id), None
    )

    if existing_task_index is not None:
        del tasks[existing_task_index]
        vari.dashboard.tasks.update(json.dumps(tasks))
    else:
        raise ValueError(f"Task with ID {id} not found.")

    return True
```

Deploy the functions:

```
$ python -m polyapi function add create_task create_task.py --server --context dashboard
$ python -m polyapi function add list_tasks list_tasks.py --server --context dashboard
$ python -m polyapi function add get_task get_task.py --server --context dashboard
$ python -m polyapi function add update_task update_task.py --server --context dashboard
$ python -m polyapi function add delete_task delete_task.py --server --context dashboard
```

### Updating the Application Configuration

Now that your server functions are in place, it’s time to integrate them into your **Canopy application**.

1. Navigate to Applications in PolyUI.
2. Locate and select your new application (Quantum Quirk).
3. Click the “Update” button to modify the configuration.
4. Replace the existing JSON configuration with the updated version provided below.
5. Click “Submit” to apply the changes.

Pro Tip

You can iterate even faster by using Poly’s API endpoint `PUT /applications/{id}/config` to push your config changes to PolyAPI.

Here is the updated JSON configuration for the “Tasks” collection that we started from [Create a Canopy UI Application](create_application.html). Notice the new keys: `itemActions`, `create`, `list`, `get`, `update`, and `delete`:

Warning

This config is mapping to TypeScript functions. If you are using Python, make sure to update the `path` values accordingly to account for subtle function naming differences between the languages.

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
    }
  ]
}
```

Once submitted, the application will automatically reflect the newly added CRUD operations, allowing users to manage tasks within the UI. 🔥

To visit your new application, go to `/canopy/<your-subpath>/login`.

For example, on `na1`, the path to the app above would be:

<https://na1.polyapi.io/canopy/quantum-quirk-dashboard/login>

[![Canopy New Application Login Page](../_images/canopy-new-app-login.png)](../_images/canopy-new-app-login.png)

Login using the same Poly API key that you used earlier to create the application.

Once logged in, you should see the following list view of the tasks we created above:

[![Canopy Application Task List](../_images/canopy-task-list.png)](../_images/canopy-task-list.png)

From the list view, you can create a new task by clicking the “Add” button. You can also select a task to open a detailed view, where you can edit or delete the task:

[![Canopy Application Task Detail](../_images/canopy-task-detail.png)](../_images/canopy-task-detail.png)

## Conclusion

By following this guide, you have successfully:

- Defined CRUD operations for a **Canopy application** collection ✅
- Linked each operation to a corresponding server function ✅
- Implemented full task management within the Quantum Quirk dashboard ✅

With CRUD now in place, you can further customize your application by refining validation rules, enhancing UI interactions, or extending functionality with additional collections, groups and resources. 🚀

Let’s keep building upon this foundation! 💪 Next up [Enhancing Canopy Applications with APIs](implement_api.html).
