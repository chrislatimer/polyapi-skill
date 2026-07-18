Source: https://docs.polyapi.io/project_glide/gitlab-workflow.html

# Gitlab Workflow

For users of Gitlab, there is no marketplace where we can publish the Project Glide deployment action for easy importing and use as exists with Github. But we’re happy to share the full contents of the Gitlab deploy workflow here.

## Adding to Existing Gitlab Project

1. Add the following secret variables defined within your gitlab instance, group or within your projects settings:
   :   `POLY_API_KEY` - Your key to your instance of PolyAPI. Be sure to make this variable “Masked” so that it’s not inadvertently logged. See <https://docs.gitlab.com/ee/ci/variables/index.html#mask-a-cicd-variable> for more details.

       `POLY_API_BASE_URL` - The base url to your instance of PolyAPI, ex. `https://na1.polyapi.io` for north american cloud users.
2. Ensure you have runners available to run the deployment workflow. If you’re using the hosted gitlab.com you can skip this step. If you’re self-hosting Gitlab however you should verify in your projects CI/CD settings that you have a linux runner installed and showing up as active. If you don’t have a runner, see Gitlab documentation to get one installed: <https://docs.gitlab.com/runner/install/>

2. Copy the following and save it as `your_repo/.gitlab-ci.yml`:

   > ```
   > stages:
   >     - deploy
   >
   > variables:
   >     NODE_VERSION: "20"
   >     POLY_API_KEY: $POLY_API_KEY
   >     POLY_API_BASE_URL: $POLY_API_BASE_URL
   >     ENVIRONMENT: development
   > deploy_polyapi:
   >     stage: deploy
   >     image: node:${NODE_VERSION}
   >     only:
   >         - main    # Execute this job only on the main branch
   >     before_script:
   >         - echo "Setting up environment"
   >         - export PACKAGE_MANAGER="npm"
   >
   >     script:
   >         # Step: Poly pre-check
   >         - echo "Running Poly pre-check"
   >         - |
   >             if ! grep -q '"polyapi":' package.json; then
   >                 echo "Please install the PolyAPI client using your package manager."
   >                 exit 1
   >             fi
   >
   >         # Step: Setup Node and determine package manager
   >         - echo "Setting up Node and determining package manager"
   >
   >         - |
   >             if [ -f "yarn.lock" ]; then
   >                 export PACKAGE_MANAGER="yarn"
   >             elif [ -f "package-lock.json" ]; then
   >                 export PACKAGE_MANAGER="npm"
   >             fi
   >
   >         - |
   >             echo "Using package manager: $PACKAGE_MANAGER"
   >
   >         # Step: Restore cached dependencies
   >         - echo "Restoring cached dependencies"
   >         - if [ "$PACKAGE_MANAGER" == "yarn" ]; then yarn install --cache-folder ~/.cache/yarn; else npm ci; fi
   >
   >         # Step: Setup Poly
   >         - echo "Setting up Poly"
   >         - mkdir -p node_modules/.poly
   >         - POLY_ENV_PATH="node_modules/.poly/.config.env"
   >         - if [ ! -f "$POLY_ENV_PATH" ]; then echo -e "DISABLE_AI=true\nENVIRONMENT_SETUP_COMPLETE=true" > "$POLY_ENV_PATH"; fi
   >
   >         # Step: Deploy
   >         - echo "Deploying with PolyAPI"
   >         - if [ "$PACKAGE_MANAGER" == "yarn" ]; then yarn poly sync --custom-path=./node_modules/.poly/; else npx poly sync --custom-path=./node_modules/.poly/; fi
   >
   >         - git config --global user.email "${GIT_USER_EMAIL:-$GITLAB_USER_EMAIL}"
   >         - git config --global user.name "${GIT_USER_NAME:-$GITLAB_USER_NAME}"
   >         - git checkout main
   >         - git branch -vv
   >         - git remote set-url origin "https://${GITLAB_USERNAME}:${GITLAB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git"
   >
   >         # Step: Commit deployment receipts
   >         - echo "Committing deployment receipts"
   >         - git add .
   >         - if ! git diff-index --quiet HEAD; then git commit -m "PolyAPI Deployment" --no-verify; else echo "No changes to commit."; fi
   >
   >         # Step: Push changes
   >         - echo "Pushing changes"
   >         - git push origin "${CI_DEFAULT_BRANCH}" -o ci.skip
   >
   >     cache:
   >         - key: "$ENVIRONMENT-Node-deps"
   >         paths:
   >             - "node_modules/"
   >             - ".npm/"
   >             - ".cache/yarn"
   >
   >         - key: "$ENVIRONMENT-poly-deps"
   >         paths:
   >             - "node_modules/.poly/"
   > ```
3. Commit these changes to git.
4. That’s it! Gitlab should pick up this workflow and run it anytime you commit changes to your main branch. Take a moment to verify the actual output of the workflow in your Gitlab UI to see that it’s running correctly, deploying your functions, and committing any deploy receipts.
