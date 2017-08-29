# classy-api-client
Simple client for Classy API v2.

# installation

 $ npm install --save classy-api-client

# usage

ApiClient.request(method, resource, postBody, authParams, callback)

```javascript
const ApiClient = require('classy-api-client')({
  apiUrl: 'https://api.classy.org/2.0',
  oauthUrl: 'https://api.classy.org/',
  timeout: 10000,
  clientId: 'YOUR_ID'
  clientSecret: 'YOUR_SECRET'
});

// These keys are required for user-specific requests
const authParams = {
  grant_credentials: 'password',
  code: null,
  username: 'YOUR_USERNAME',
  password: 'YOUR_PASSWORD'
};

ApiClient.request('GET', '/me', null, authParams, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});

```

For non-user-specific requests, set authParams to null.
