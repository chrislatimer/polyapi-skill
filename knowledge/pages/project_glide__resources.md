Source: https://docs.polyapi.io/project_glide/resources.html

# Supported Resources

Many PolyAPI resources are supported in a Project Glide workflow, though many are missing and still in progress. This page documents the supported Resources as well as the expected file config for each.

| Resource Type | Client SDKs | | | |
| --- | --- | --- | --- | --- |
| TypeScript | Python | Java | C# |
| [Server Functions](#server-functions) | ✅ | ✅ | ⬜ | ⬜ |
| [Client Functions](#client-functions) | ✅ | ✅ | ⬜ | ⬜ |
| API Functions | ⬜ | ⬜ | ⬜ | ⬜ |
| [Webhooks](#webhooks) | ✅ | ⬜ | ⬜ | ⬜ |
| Triggers | ⬜ | ⬜ | ⬜ | ⬜ |
| Jobs | ⬜ | ⬜ | ⬜ | ⬜ |
| Snippets | ⬜ | ⬜ | ⬜ | ⬜ |
| Schemas | ⬜ | ⬜ | ⬜ | ⬜ |

Note

All types, comments and docstrings are considered optional. We display them here for completeness.

## Server Functions

TypeScript

> ```
> // Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/server-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> import { PolyServerFunction } from 'polyapi';
>
> const polyConfig: PolyServerFunction = {
>     name: 'fn_name',
>     context: 'context.namespace',
>     // other config here
> };
>
> /**
> * Function description
> *
> * @param {string} arg - Argument description
> * @returns {string} Return description
> */
> function fn_name(arg: string): string {
>     return "";
> }
> ```

Python

> ```
> # Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/server-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> from polyapi.typedefs import PolyServerFunction
>
> polyConfig: PolyServerFunction = {
>     'name': 'fn_name',
>     'context': 'context.namespace',
>     # other config here
> }
>
> def fn_name(first_name: str) -> str:
>     """Function description
>
>     Args:
>         arg (str): Argument description
>
>     Returns:
>         str: Return description
>     """
>     return ""
> ```

## Client Functions

TypeScript

> ```
> // Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/client-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> import { PolyClientFunction } from 'polyapi';
>
> const polyConfig: PolyClientFunction = {
>     name: 'fn_name',
>     context: 'context.namespace',
>     // other config here
> };
>
> /**
> * Function description
> *
> * @param {string} arg - Argument description
> * @returns {string} Return description
> */
> function fn_name(arg: string): string {
>     return "";
> }
> ```

Python

> ```
> # Poly deployed @ <ISO_DATE_STRING> - context.namespace.fn_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/client-functions/<FUNCTION_ID> - <FILE_CONTENT_HASH>
> from polyapi.typedefs import PolyClientFunction
>
> polyConfig: PolyClientFunction = {
>     'name': 'fn_name',
>     'context': 'context.namespace',
>     # other config here
> }
>
> def fn_name(first_name: str) -> str:
>     """Function description
>
>     Args:
>         arg (str): Argument description
>
>     Returns:
>         str: Return description
>     """
>     return ""
> ```

## Webhooks

```
// Poly deployed @ <ISO_DATE_STRING> - context.namespace.hook_name - <POLYAPI_BASE_URL>/canopy/polyui/collections/webhooks/<WEBHOOK_ID> - <FILE_CONTENT_HASH>
import { PolyWebhook } from 'polyapi';

const polyConfig: PolyWebhook = {
    name: 'hook_name',
    context: 'context.namespace',
    description: 'description here',
    // other config here
};
```
