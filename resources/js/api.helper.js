/**
 * @typedef APIParams
 * @type {object}
 * @property {string} endpoint - api's endpoint
 * @property {string} method - RESTful's methods: GET, POST, PUT, PATCH, DELETE.
 */

/**
 * @param  {APIParams} params
 */
async function callAPI(params) {
  params.endpoint = params.endpoint || "GET";
  const resp = await fetch(params.endpoint, {
    method: params.method,
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
    });

  return resp;
}

export { callAPI };
