import { gatherPath, deleteFile } from "./file.controller.js";
import { ITEM_TYPE } from "./constants.js";

function setTray() {
  if (NL_MODE != "window") {
    console.debug("INFO: Tray menu is only available in the window mode.");
    return;
  }
  let tray = {
    icon: "/resources/icons/ninjaIcon.png",
    menuItems: [
      { id: "VERSION", text: "Get version" },
      { id: "SEP", text: "-" },
      { id: "QUIT", text: "Quit" },
    ],
  };
  Neutralino.os.setTray(tray);
}

function onTrayMenuItemClicked(event) {
  switch (event.detail.id) {
    case "VERSION":
      Neutralino.os.showMessageBox(
        "Version information",
        `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`
      );
      break;
    case "QUIT":
      Neutralino.app.exit();
      break;
  }
}

function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

document.getElementById("btnReset").addEventListener("click", onClickBtnReset);
document
  .getElementById("btnChoose")
  .addEventListener("click", onClickBtnChoose);
document
  .getElementById("btnChooseFolder")
  .addEventListener("click", onClickBtnChooseFolder);
document.getElementById("btnStart").addEventListener("click", onClickBtnStart);
document.getElementById("btnHide").addEventListener("click", onClickBtnHide);
function getListElement() {
  return document.getElementById("listToDel");
}

if (NL_OS != "Darwin") {
  // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}

function onClickBtnReset() {
  console.debug("btnReset clicked");
  getListElement().innerHTML = "";
}

function addToList(elements) {
  let list = [];
  let isFile = false;
  switch (typeof elements) {
    case "string": {
      console.debug("input from pick folder");
      list.push(elements);
      break;
    }

    case "object": {
      console.debug("input from pick files");
      list = elements;
      isFile = true;
      break;
    }
  }

  const ul = document.getElementById("listToDel");
  const existingAmount = ul.getElementsByTagName("div").length; //elements that already existing in ul
  let idx = 0;

  for (let e of list) {
    const item = document.createElement("div");
    const btn = document.createElement("button");
    const divId = `item-${idx + existingAmount}`;
    idx++;

    // btn.textContent = "-";

    item.appendChild(btn);
    item.appendChild(document.createTextNode(e));

    item.setAttribute("id", divId);
    item.setAttribute(
      "item-type",
      isFile === true ? ITEM_TYPE.FILE : ITEM_TYPE.FOLDER
    );
    btn.addEventListener("click", onClickBtnRemoveItem.bind(null, divId));

    ul.appendChild(item);
  }
}

async function onClickBtnChoose() {
  console.debug("btnChoose clicked");
  let entries = await Neutralino.os.showOpenDialog(
    "You choose file, I will do the rest",
    {
      defaultPath: "./",
      filters: [{ name: "All files", extensions: ["*"] }],
      multiSelections: true,
    }
  );
  console.debug("You have selected:", entries);
  addToList(entries);
}

async function onClickBtnChooseFolder() {
  console.debug("btnChooseFolder clicked");
  let entry = await Neutralino.os.showFolderDialog(
    "You choose folder, I will take the rest",
    {
      defaultPath: "./",
    }
  );
  console.debug("You have selected:", entry);
  addToList(entry);
}

function startCountDown() {
  const delayTimeStr = document.getElementById("inpDelayTime").value;
  let delayTime = 0;
  if (!isNaN(delayTimeStr)) {
    delayTime = parseInt(delayTimeStr) || 0; //|| 0 is for "" because !isNaN("") = true
  }

  console.debug(`btnStart clicked! ${delayTime} second(s)`);
  const allFileToDel = gatherPath();
  setTimeout(async () => {
    await deleteFile(allFileToDel);
    onClickBtnReset();
  }, delayTime * 1000);
}

async function onClickBtnStart() {
  if (getListElement().getElementsByTagName("div").length === 0) {
    return;
  }

  let button = await Neutralino.os.showMessageBox(
    "Confirm",
    "Do you want to start deletion?",
    "YES_NO",
    "QUESTION"
  );

  if (button === "YES") {
    startCountDown();
  }
}

function onClickBtnHide() {
  console.debug("btnHide clicked");
}

function onClickBtnRemoveItem(itemId) {
  console.debug("remove item", itemId);
  try {
    const ul = getListElement();
    ul.querySelector(`#${itemId}`).remove();
  } catch (e) {
    console.debug("failed to remove item from list", e);
  }
}
