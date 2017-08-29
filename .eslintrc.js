/*
 * Global boolean meaning:
 *   true - allow the variable to be overwritten
 *   false - disallow overwriting
 *
 * Rules number codes:
 *   0 - rule is disabled
 *   1 - warning (will not affect exit code)
 *   2 - error (will affect exit code).
 */

module.exports = {
  "parserOptions": {
        "ecmaVersion": 8
  },
  "extends": "google",
  "env": {
    "node": true
  },
  "rules": {
    "require-jsdoc": 0, // require JSDoc comments,
    "comma-dangle": 0, // enforce trailing commas,
    "arrow-parens": 0 // enforce parens arround single arg arrow fcts
  }
};
