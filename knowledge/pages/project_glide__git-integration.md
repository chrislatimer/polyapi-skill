Source: https://docs.polyapi.io/project_glide/git-integration.html

# Setup Glide Workflow

## Starting from Scratch

We have a public template you can clone or use for reference if you’re starting a new project.

TypeScript

Please follow the steps in that repository’s readme file: <https://github.com/polyapi/poly-glide-template-js?tab=readme-ov-file#getting-started> to get setup.

Python

Please follow the steps in that repository’s readme file: <https://github.com/polyapi/poly-glide-template-py?tab=readme-ov-file#getting-started> to get setup.

## Starting from Existing Project

Note

These steps are written for users of Github. But we support Gitlab too! You can mostly follow the same steps for A and B. For step C, see the [Gitlab Workflow](gitlab-workflow.html) page.

If you’ve already started a poly project, or have an existing project you want to integrate Poly and the Glide workflow with, there’s just a few steps you need to take to integrate Poly with Git.

To enable the Glide workflow you need:

**A. Git-managed repository hosted on Github.**

1. Follow instructions from Github to setup a new github repository: <https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository>.
2. Follow instructions from Github to authenticate with Github via the command line: <https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/about-authentication-to-github#authenticating-with-the-command-line>.

**B. Pre-commit and post-merge hooks setup to run Poly commands.**

TypeScript

1. Run the following in your terminal from within your project.

   ```
   $ npm install --save-dev husky
   ```
2. Copy the pre-commit and post-merge hooks from our template project `.husky` into your own `your_repo/.husky` directory: <https://github.com/polyapi/poly-glide-template-js/tree/main/.husky>.
3. Commit these changes to git.

Python

1. Add the following to your project `requirements.txt`

   ```
   pre-commit==4.0.1
   ```
2. And then run pip install to get `pre-commit`

   ```
   $ pip install -r requirements.txt
   ```
3. Copy the pre-commit config from our template project `.pre-commit-config.yaml` into your repo: <https://github.com/polyapi/poly-glide-template-py/tree/main/.pre-commit-config.yaml>.
4. Install the pre-commit hook to enable it: (note the intentional use of underscores in the command)

   ```
   $ python -m pre_commit install
   ```
5. Commit these changes to git.

**C. A simple Github action that will deploy to Poly.**

1. Add the following secret variables defined within your github organization or within your github repository:

   `POLY_API_KEY` - Your key to your instance of PolyAPI.

   `POLY_API_BASE_URL` - The base url to your instance of PolyAPI, ex. `https://na1.polyapi.io` for north american cloud users.
2. Copy the following and save it as `your_repo/.github/workflows/deploy.yml`:

   TypeScript

   ```
   name: Deploy to PolyAPI
   on:
   push:
       branches:
       - main

   concurrency:
   group: ${{ github.ref }}
   cancel-in-progress: true

   jobs:
   deploy:
       runs-on: ubuntu-latest

       steps:
       - name: Poly Deploy
           uses: polyapi/poly-deployment-action-js@v0.2.13-alpha
           with:
           poly_api_key: ${{ secrets.POLY_API_KEY }}
           poly_api_base_url: ${{ secrets.POLY_API_BASE_URL }}
   ```

   Python

   ```
   name: Deploy to PolyAPI
   on:
   push:
       branches:
       - main

   concurrency:
   group: ${{ github.ref }}
   cancel-in-progress: true

   jobs:
   deploy:
       runs-on: ubuntu-latest

       steps:
       - name: Poly Deploy
           uses: polyapi/poly-deployment-action-py@v0.0.8
           with:
           poly_api_key: ${{ secrets.POLY_API_KEY }}
           poly_api_base_url: ${{ secrets.POLY_API_BASE_URL }}
   ```
3. Commit these changes to git.
4. That’s it! Github should pick up this workflow and run it anytime you commit changes to your main branch. Take a moment to verify the actual output of the workflow in the Github UI to see that it’s running correctly, deploying your functions, and committing any deploy receipts.
