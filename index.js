'use strict';

const httpRequest = require('request');
const OAuth2 = require('oauth').OAuth2;
let clientId;
let clientSecret;
let oauthUrl;
let apiUrl;
let timeout;

function parse(body) {
  try {
    return JSON.parse(body);
  } catch (e) {
    console.error(e);
    return {};
  }
}

function generateApiToken(authParams, next) {
  let oauth2 = new OAuth2(clientId, clientSecret, oauthUrl,
    null, '/oauth2/auth', null);
  if (!authParams) {
    authParams = {
      grant_type: 'client_credentials'
    };
  }
  oauth2.getOAuthAccessToken('', authParams, next);
};

function apiRequest(method, resource, payload, authParams, callback) {
  generateApiToken(authParams, function(error, bearer) {
    if (error) {
      callback(error);
      return;
    }
    let options = {
      url: `${apiUrl}${resource}`,
      timeout,
      method,
      headers: {
        'Authorization': `Bearer ${bearer}`,
        'User-Agent': 'ClassyPay Node.JS'
      }
    };
    if (payload) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(payload);
    }
    httpRequest(options, function(error, response, body) {
      callback(error, {
        status: response.statusCode,
        error,
        response,
        body,
        object: parse(body)
      });
    });
  });
}

function request(method, resource, payload, authParams, callback) {
  apiRequest(method, resource, payload, authParams, function(error, result) {
    if (result.status !== 200) {
      callback(error ||
        {
          status: result.status,
          message: `${JSON.stringify(result.response)}`
        });
    } else {
      callback(null, result.body ? JSON.parse(result.body) : {});
    }
  });
}

module.exports = (config) => {
  if (!config || !config.clientId || !config.clientSecret ||
    !config.oauthUrl || !config.apiUrl || !config.timeout) {
    throw new Error(`You must provide clientId, clientSecret, oauthUrl,
      apiUrl and timeout.`);
  }
  clientId = config.clientId;
  clientSecret = config.clientSecret;
  oauthUrl = config.oauthUrl;
  apiUrl = config.apiUrl;
  timeout = config.timeout;
  return {
    request: request
  };
};
