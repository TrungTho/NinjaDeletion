import { ITEM_TYPE } from "./constants.js";

async function deleteFile(items) {
  console.debug("i want to delete:");
  console.debug(items);

  for (let item of items) {
    if (item.type === ITEM_TYPE.FILE) {
      try {
        await Neutralino.filesystem.removeFile(item.path);
      } catch (e) {
        console.error("failed to delete file:", JSON.stringify(e));
      }
    } else if (item.type === ITEM_TYPE.FOLDER) {
      try {
        await Neutralino.filesystem.removeDirectory(item.path);
      } catch (e) {
        console.error("failed to delete folder:", JSON.stringify(e));
      }
    }
  }
}

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
export { deleteFile, gatherPath, killProcesses };
