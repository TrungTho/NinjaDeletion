import { callAPI } from "./api.helper.js";

/**
 * @typedef APIParams
 * @type {object}
 * @property {string} endpoint - api's endpoint
 * @property {string} method - RESTful's methods: GET, POST, PUT, PATCH, DELETE.
 * @property {object} data - request's body in JSON format
 */
/**
 * @param  {object} body
 */

async function sendMessage(body) {
  const token = await Neutralino.storage.getData("TEST_T");
  const apiParams = {
    method: "POST",
    endpoint: `
    https://api.telegram.org/bot${token}/sendMessage`,
    data: body,
  };
  callAPI(apiParams);
}

export { sendMessage };
