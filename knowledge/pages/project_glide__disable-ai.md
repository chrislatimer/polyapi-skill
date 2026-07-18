Source: https://docs.polyapi.io/project_glide/disable-ai.html

# Using Glide without AI

TypeScript

If for whatever reason you wish to disable the use of AI you have several avenues to do so:

- You can disable use of AI at a global level by setting `DISABLE_AI=true` within your `node_modules/.poly/config.env` file.
- You can disable use of AI at a function level when configuring your poly functions:
  :   ```
      const polyConfig: PolyServerFunction = {
          name: "helloPoly",
          context: "demo",
          disableAi: true,
      }
      ```
- Or you can disable use of AI when running the `prepare` command by adding the `--disable-ai` option, ex: `poly prepare --disable-ai`.

Python

If for whatever reason you wish to disable the use of AI you have several avenues to do so:

- You can disable use of AI at a global level by setting `DISABLE_AI=true` within your `polyapi/config.env` file.
- You can disable use of AI at a function level when configuring your poly functions:
  :   ```
      polyConfig: PolyServerFunction = {
          'name': "hello_poly",
          'context': "demo",
          'disableAi': True,
      }
      ```
- Or you can disable use of AI when running the `prepare` command by adding the `--disable-ai` option, ex: `polyapi prepare --disable-ai`.
