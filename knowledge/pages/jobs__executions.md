Source: https://docs.polyapi.io/jobs/executions.html

# Checking Job Executions

Each Job Execution represents a specific run of a specific job.

For example, if you have a job that runs every hour, you will have
a specific Execution summarizing the results of each hourly run.

## Execution List

Go to a specific Job, and on the Job Detail page, click the “Show Executions” button.

[![Job Detail](../_images/detail-job.png)](../_images/detail-job.png)

You should see a list of all executions for that job, including what time the execution happened and the status of the execution.

[![Execution List](../_images/execution-list.png)](../_images/execution-list.png)

If the status is “finished”, that means all functions executed and returned normally.

If the status is “error”, that means one or more functions in the job threw an error.

## Execution Detail

Now click “Show Details” to see more information about a specific execution.

You will see all the details about a specific execution, including what arguments each function was called with
and the status code response of each function:

[![Execution Detail](../_images/execution-detail.png)](../_images/execution-detail.png)

## Conclusion

Job Executions provide a great way to:

- monitor your jobs
- ensure they executed successfully
- debug any errors
- review performance

That’s it! You now know how to use Jobs in your codebase.

If you have any questions or need help, please don’t hesitate to reach out to us at [support@polyapi.io](mailto:support%40polyapi.io)
