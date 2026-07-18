Source: https://docs.polyapi.io/vari_variables/execute_endpoints.html

# Using Variables with Execute Endpoints

While the Poly library provides a convenient way to interact with your functions, you can also call the `execute` endpoint directly. This is particularly useful when you’re working in an environment where using the Poly library isn’t feasible.

This guide covers calling PolyAPI functions via direct HTTP requests while securely injecting variables.

Note

You must have the **Execute Functions** permission to use execute endpoints.

## Create a Test Variable

To follow along with the examples below, create a test variable in your PolyAPI tenant

Click “+ Create” and create a variable with:
* **Context**: `tutorial`
* **Name**: `apiKey`
* **Value**: `test-secret-key-123`
* **Visibility**: Environment
* **Secret**: Choose based on your needs

Click “Create” to save your variable!

## Understanding Execute Endpoints

PolyAPI provides execute endpoints for both types of functions:

- **API Functions**: `POST /functions/api/{functionId}/execute`
- **Server Functions**: `POST /functions/server/{functionId}/execute`

When you call these endpoints, you can inject variables using special `PolyVariable` objects in your request body.

## Execute Call Without Variables

Here’s how to call a PolyAPI function without any variable injection.

For this example, we’ll assume you have a function with ID `my-function-id`. Replace this with an actual function ID from your environment.

TypeScript

```
// Execute an API function without variables
const response = await fetch('https://na1.polyapi.io/functions/api/my-function-id/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "userName": "john.doe",
    "includeMetadata": true,
    "limit": 50
  })
});

const result = await response.json();
console.log('Status:', result.status);
console.log('Data:', result.data);
```

Python

```
import requests

# Execute an API function without variables
response = requests.post(
    'https://na1.polyapi.io/functions/api/my-function-id/execute',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        "userName": "john.doe",
        "includeMetadata": True,
        "limit": 50
    }
)

result = response.json()
print(f'Status: {result["status"]}')
print(f'Data: {result["data"]}')
```

This shows the basic structure of an execute endpoint call. Now let’s add variable injection.

## Injecting Variables

Now let’s use the variable we created earlier. There are three ways to inject variables:

1. **By Variable Path**: `"pathIdentifier": "tutorial.apiKey"`
2. **By Variable ID**: `"id": "your-variable-uuid"`
3. **With Path Extraction**: Get only part of a complex JSON variable

Here’s an example using the first method with our `tutorial.apiKey` variable:

TypeScript

```
// Execute with variable injection
const response = await fetch('https://na1.polyapi.io/functions/api/my-function-id/execute', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "userName": "john.doe",
    "authToken": {
      "type": "PolyVariable",
      "pathIdentifier": "tutorial.apiKey"
    }
  })
});

const result = await response.json();
console.log('Function executed with injected variable!');
```

Python

```
# Execute with variable injection
response = requests.post(
    'https://na1.polyapi.io/functions/api/my-function-id/execute',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        "userName": "john.doe",
        "authToken": {
            "type": "PolyVariable",
            "pathIdentifier": "tutorial.apiKey"
        }
    }
)

result = response.json()
print('Function executed with injected variable!')
```

## Advanced Variable Injection

The following examples demonstrate more complex scenarios for variable injection in real applications.

### Multi-Client Example

Using different credentials per client or integration.

First, create a variable containing multiple client configurations:

```
{
  "clientA": "SECRET_KEY_FOR_CLIENT_A",
  "clientB": "SECRET_KEY_FOR_CLIENT_B"
}
```

Then use path-based injection to extract just the configuration for a specific client:

TypeScript

```
// Using Client A credentials - extracts only "clientA" from the variable
const responseA = await fetch(`https://na1.polyapi.io/functions/api/send-email/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "emailData": {
      "to": "customer@companyA.com",
      "subject": "Welcome to Company A!"
    },
    "apiKey": {
      "type": "PolyVariable",
      "pathIdentifier": "integrations.emailService.credentials",
      "path": "clientA"  // Only injects "SECRET_KEY_FOR_CLIENT_A"
    }
  })
});

// Using Client B credentials - extracts only "clientB" from the same variable
const responseB = await fetch(`https://na1.polyapi.io/functions/api/send-email/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "emailData": {
      "to": "customer@companyB.com",
      "subject": "Welcome to Company B!"
    },
    "apiKey": {
      "type": "PolyVariable",
      "pathIdentifier": "integrations.emailService.credentials",
      "path": "clientB"  // Only injects "SECRET_KEY_FOR_CLIENT_B"
    }
  })
});
```

Python

```
import requests

# Using Client A credentials - extracts only "clientA" from the variable
response_a = requests.post(
    "https://na1.polyapi.io/functions/api/send-email/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "emailData": {
            "to": "customer@companyA.com",
            "subject": "Welcome to Company A!"
        },
        "apiKey": {
            "type": "PolyVariable",
            "pathIdentifier": "integrations.emailService.credentials",
            "path": "clientA"  # Only injects "SECRET_KEY_FOR_CLIENT_A"
        }
    }
)

# Using Client B credentials - extracts only "clientB" from the same variable
response_b = requests.post(
    "https://na1.polyapi.io/functions/api/send-email/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "emailData": {
            "to": "customer@companyB.com",
            "subject": "Welcome to Company B!"
        },
        "apiKey": {
            "type": "PolyVariable",
            "pathIdentifier": "integrations.emailService.credentials",
            "path": "clientB"  # Only injects "SECRET_KEY_FOR_CLIENT_B"
        }
    }
)
```

### Environment-Specific Database Access

Use different database configurations for development vs production:

TypeScript

```
// Development environment
const devResponse = await fetch(`https://na1.polyapi.io/functions/api/get-user-data/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "userId": 12345,
    "includeMetadata": true,
    "dbConfig": {
      "type": "PolyVariable",
      "pathIdentifier": "environments.development.database.config"
    }
  })
});

// Production environment (same code, different variable)
const prodResponse = await fetch(`https://na1.polyapi.io/functions/api/get-user-data/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "userId": 12345,
    "includeMetadata": true,
    "dbConfig": {
      "type": "PolyVariable",
      "pathIdentifier": "environments.production.database.config"
    }
  })
});
```

Python

```
# Development environment
dev_response = requests.post(
    "https://na1.polyapi.io/functions/api/get-user-data/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "userId": 12345,
        "includeMetadata": True,
        "dbConfig": {
            "type": "PolyVariable",
            "pathIdentifier": "environments.development.database.config"
        }
    }
)

# Production environment (same code, different variable)
prod_response = requests.post(
    "https://na1.polyapi.io/functions/api/get-user-data/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "userId": 12345,
        "includeMetadata": True,
        "dbConfig": {
            "type": "PolyVariable",
            "pathIdentifier": "environments.production.database.config"
        }
    }
)
```

### Nested Variable Extraction

Extract specific values from complex JSON variables.

For example, with a variable containing multiple client configurations but using path extraction to inject only one subset:

```
{
  "development": {
    "host": "dev-db.example.com",
    "username": "dev_user",
    "password": "dev_pass"
  },
  "production": {
    "host": "prod-db.example.com",
    "username": "prod_user",
    "password": "prod_pass"
  }
}
```

TypeScript

```
// Extract only the production configuration from the variable
const response = await fetch(`https://na1.polyapi.io/functions/api/get-user-data/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "userId": 12345,
    "includeMetadata": true,
    "dbConfig": {
      "type": "PolyVariable",
      "pathIdentifier": "database.environments.config",
      "path": "production"  // Only injects the production config subset
    }
  })
});
```

Python

```
# Extract only the production configuration from the variable
response = requests.post(
    "https://na1.polyapi.io/functions/api/get-user-data/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "userId": 12345,
        "includeMetadata": True,
        "dbConfig": {
            "type": "PolyVariable",
            "pathIdentifier": "database.environments.config",
            "path": "production"  # Only injects the production config subset
        }
    }
)
```

## Server Function Execute Endpoints

Server functions also support execute endpoints with the same variable injection capabilities:

TypeScript

```
// Execute a custom server function with variable injection
const response = await fetch(`https://na1.polyapi.io/functions/server/process-order/execute`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${polyApiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "orderData": {
      "orderId": "order_12345",
      "customerId": "cust_67890",
      "amount": 99.99
    },
    "integrationSettings": {
      "type": "PolyVariable",
      "pathIdentifier": "integrations.orderProcessing.settings"
    },
    "paymentGatewayCredentials": {
      "type": "PolyVariable",
      "pathIdentifier": "payments.gateway.credentials",
      "path": "production"
    }
  })
});
```

Python

```
# Execute a custom server function with variable injection
response = requests.post(
    "https://na1.polyapi.io/functions/server/process-order/execute",
    headers={"Authorization": f"Bearer {poly_api_key}"},
    json={
        "orderData": {
            "orderId": "order_12345",
            "customerId": "cust_67890",
            "amount": 99.99
        },
        "integrationSettings": {
            "type": "PolyVariable",
            "pathIdentifier": "integrations.orderProcessing.settings"
        },
        "paymentGatewayCredentials": {
            "type": "PolyVariable",
            "pathIdentifier": "payments.gateway.credentials",
            "path": "production"
        }
    }
)
```

Note

Server function execute endpoints support additional features like asynchronous execution and custom response handling via the `polyCustom` object in your function code.

## Execute Endpoints vs Generated SDKs

Use **execute endpoints** for integration platforms, legacy systems, or when SDKs aren’t practical.

Use **generated SDKs** for modern applications where you want type safety and simplified development.

See [Generated SDKs](../generated_sdks/index.html) for SDK documentation.

## Conclusion

That’s it! You’ve now learned how to:

- Create variables for use with execute endpoints
- Make direct HTTP calls to PolyAPI functions
- Inject variables securely using `PolyVariable` objects
