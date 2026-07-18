Source: https://docs.polyapi.io/error_handlers/error-handler-module.html

# errorHandler Module

The `errorHandler` module allows you to define custom error handling logic for your poly functions within your codebase.

This allows you to watch for errors from functions within your entire PolyAPI instance, and respond to them dynamically.

To register an error handler for a function path:

TypeScript

```
import { errorHandler } from "polyapi";

myErrorHandler = errorHandler.on('myContext.myFunction', (error) => {
  // handle error
});
```

You can also register an error handler for an entire context:

```
import { errorHandler } from "polyapi";

myErrorHandler = errorHandler.on('myContext', (error) => {
  // handle error
});
```

Because the errorHandler.on function returns an unregister function, you can easily remove the error handler by calling it:

```
myErrorHandler();
```

Python

```
from polyapi import error_handler

await error_handler.get_client_and_connect()
await error_handler.on('myContext.myFunction', handler_function)
```

You can also register an error handler for an entire context:

```
from polyapi import error_handler

await error_handler.get_client_and_connect()
await error_handler.on('myContext', handler_function)
```

When you no longer need it, you can unregister all error handlers with the `unregister_all` function:

```
await error_handler.unregister_all()
```

Happy error handling!
