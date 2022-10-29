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

export { deleteFile, gatherPath };
