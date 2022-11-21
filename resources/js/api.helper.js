/**
 * @typedef APIParams
 * @type {object}
 * @property {string} endpoint - api's endpoint
 * @property {string} method - RESTful's methods: GET, POST, PUT, PATCH, DELETE.
 * @property {object} data - request's body in JSON format
 */

/**
 * @param  {APIParams} params
 *
 * @return {JSON|Promise} response - success response from server or a rejected promise
 */
async function callAPI(params) {
  params.endpoint = params.endpoint || "GET";
  const resp = await fetch(params.endpoint, {
    method: params.method,
    body: JSON.stringify(params.data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      // The API call was successful!
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function (data) {
      return data;
    })
    .catch(function (err) {
      console.warn("failed to call api", params, err);
      return Promise.reject(err);
    });

  return resp;
}

export { callAPI };
