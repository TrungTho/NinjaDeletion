import { ITEM_TYPE, TELEGRAM_PARSE_MODE } from "./constants.js";
import { sendMessage } from "./telegram.helper.js";

/**
 * @typedef {Object} FailedLog
 * @property {string} filePath - full path to file/ folder
 * @property {string} errorMsg - error message
 */

/**
 * @typedef {Object} DeletionStats
 * @property {Array.<File>} detail - total number of files want to delete
 * @property {FailedLog} failedLogs - all failed logs when deleted file
 */

/**
 * @param  {Array.<File>} items
 *
 * @return {DeletionStats} stats
 */
async function deleteFile(items) {
  console.debug("i want to delete:");
  console.debug(items);

  let failedFiles = [];

  for (let item of items) {
    if (item.type === ITEM_TYPE.FILE) {
      try {
        await Neutralino.filesystem.removeFile(item.path);
      } catch (e) {
        failedFiles.push({
          filepath: item.path,
          errorMsg: e,
        });
        console.error("failed to delete file:", JSON.stringify(e));
      }
    } else if (item.type === ITEM_TYPE.FOLDER) {
      try {
        await Neutralino.filesystem.removeDirectory(item.path);
      } catch (e) {
        failedFiles.push({
          filepath: item.path,
          errorMsg: e,
        });
        console.error("failed to delete folder:", JSON.stringify(e));
      }
    }
  }

  return {
    failedLogs: failedFiles,
    detail: items,
  };
}

/**
 * @typedef {Object} File
 * @property {number} type - file/ folder
 * @property {string} path - full path to file/ folder in PC
 */

/**
 * @return {Array.<File>}
 */
function gatherPath() {
  let files = [];
  let divCollection = document
    .getElementById("listToDel")
    .getElementsByTagName("div");

  for (let div of divCollection) {
    const item = {
      type: div.getAttribute("item-type"),
      path: div.innerText,
    };
    files.push(item);
  }

  return files;
}
/**
 * @param  {Boolean} isUseTemplate
 * @param  {Array.<String>} customProcesses
 */
async function killProcesses(isUseTemplate, customProcesses) {
  console.debug("start to kill processes", isUseTemplate, customProcesses);

  let processesToKill = customProcesses || [];
  if (isUseTemplate === true) {
    processesToKill = customProcesses.concat(NL_PDF_APPS);
  }

  for (const process of processesToKill) {
    try {
      const info = await Neutralino.os.execCommand(`taskkill /IM ${process}`, {
        // background: true,
      });
      console.debug("kill process info: ", process, info);
    } catch (e) {
      console.error("error when kill process ", process, e);
    }
  }
}

/**
 * @param  {DeletionStats} stats - stats from deletion process
 */
async function syncResultLogs(stats) {
  const logs = buildLogContent(stats);

  await sendMessage({
    text: logs,
    chat_id: `-${await Neutralino.storage.getData("TEST_ID")}`,
    parse_mode: TELEGRAM_PARSE_MODE,
  });
}
/**
 * @param  {DeletionStats} stats - stats from deletion process
 *
 * @return {string} logs - final content to send via telegram
 */
function buildLogContent(stats) {
  const logs = ` * Total files: ${stats.detail.length}  
  * Success: ${stats.detail.length - stats.failedLogs.length}  

  ---

  * Details: 
  ${JSON.stringify(stats.detail)}

  ---

  * Failed logs: 
  ${JSON.stringify(stats.failedLogs)}`;
  return logs;
}

export { deleteFile, gatherPath, killProcesses, syncResultLogs };
