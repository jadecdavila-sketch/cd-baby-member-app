/* istanbul ignore file */
export function createMockAxiosError({
  message = 'Request failed',
  code = 'ERR_BAD_REQUEST',
  status = 400,
  responseData = null,
} = {}) {
  // Mock response object (if the error is due to a server response)
  const response = {
    status,
    statusText: 'Bad Request',
    data: responseData ?? { error: message },
    headers: {},
    config: {},
  };

  // Create the AxiosError-like object
  const axiosError = {
    isAxiosError: true,
    name: 'AxiosError',
    message,
    code,
    config: {
      url: 'https://example.com/api',
      method: 'get',
      headers: {},
    },
    response, // Include response for HTTP errors (e.g., 400, 404, 500)
    // request: {}, // Uncomment and populate for network errors (e.g., ECONNABORTED)
    stack: new Error().stack, // Optional: Add a stack trace
  };

  // Optionally, set the prototype to Error for instanceof checks
  Object.setPrototypeOf(axiosError, Error.prototype);

  return axiosError;
}
