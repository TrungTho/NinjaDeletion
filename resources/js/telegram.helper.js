import { callAPI } from "./api.helper.js";

/**
 * @typedef TelegramBotAPIConfig
 * @type {object}
 * @property {string} botToken - token of telegram bot
 * @property {string} chatID - group chat that want to get result logs
 */

/**
 * @typedef APIParams
 * @type {object}
 * @property {string} endpoint - api's endpoint
 * @property {string} method - RESTful's methods: GET, POST, PUT, PATCH, DELETE.
 * @property {object} data - request's body in JSON format
 */

/**
 * @typedef TelegramSendMessageBody
 * @type {object}
 * @property {string} chat_id - (required) id of chat box
 * @property {string} text - (required) message to send
 * @property {string} parse_mode - NULL/HTML/Markdown
 * @property {boolean} disable_web_page_preview - request's body in JSON format
 * @property {boolean} disable_notification - request's body in JSON format
 * @property {number} reply_to_message_id - If the message is a reply, ID of the original message
 * @property {object} reply_markup - Additional interface options. A JSON-serialized object for a custom reply keyboard, instructions to hide keyboard or to force a reply from the user.
 */

/**
 * @param  {TelegramSendMessageBody} body
 */

async function sendMessage(body) {
  const token = await Neutralino.storage.getData("TEST_T");
  const apiParams = {
    method: "POST",
    endpoint: `https://api.telegram.org/bot${token}/sendMessage`,
    data: body,
  };
  await callAPI(apiParams);
}

export { sendMessage };
