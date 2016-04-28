/**
 * Utility for error messages and status
 */
module.exports = {
  errorMessage: function() {
    return {
      invalidToken: 419,
      internalServer: 500,
      OK: 200,
      Created: 201,
      NoContent: 204,
      BadRequest: 400,
      Unauthorized: 401
    };
  },
  errorStatus: function() {
    return {
      invalidToken: 'Token is invalid',
      internalServer: 'Internal Server Error',
      OK: 'The request was successful, and results may be obtained in the response body',
      Created: 'The POST request was successful, and results may be obtained in the response body.',
      NoContent: 'The request was successful, but the response body is empty as nothing deemed important should be returned.',
      BadRequest: 'The server wasn not able to understand the request. It is possibly missing required parameters or has parameters with values of an invalid type. The response should include an error object with more information.',
      Unauthorized: 'The authentication has failed for the user.'
    };
  }
};
