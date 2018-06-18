'use strict';

const request = require('request');
const OAuth2 = require('oauth').OAuth2;
let clientId;
let clientSecret;
let oauthUrl;
let apiUrl;
let timeout;
let jsonParse = JSON.parse;

function parse(body) {
  try {
    return jsonParse(body);
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
    request(options, function(error, response, body) {
      if (error || response.statusCode !== 200) {
        callback(error ||
          {
            status: response.statusCode,
            error,
            response,
            body,
            object: parse(body)
          }
        );
      } else {
        callback(null, body ? jsonParse(body) : {});
      }
    });
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
  if (config.bigIntsToStrings) {
    jsonParse = require('json-bigint')({'storeAsString': true}).parse;
  }
  return {
    request: apiRequest
  };
};
