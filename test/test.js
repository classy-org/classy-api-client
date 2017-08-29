const ApiClient = require('../index.js')({
  apiUrl: 'https://stagingapi.stayclassy.org/2.0',
  oauthUrl: 'https://stagingapi.stayclassy.org',
  timeout: 10000,
  clientId: process.argv[2],
  clientSecret: process.argv[3]
});

// should fail - /me is user-specific
ApiClient.request(
    'GET', '/me', null, null, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});

// should succeed
ApiClient.request(
    'GET', '/me', null, {
      grant_type: 'password',
      code: null,
      username: process.argv[4],
      password: process.argv[5]
    }, (error, result) => {
  if (error) {
    console.log(error);
  } else {
    console.log(result);
  }
});
