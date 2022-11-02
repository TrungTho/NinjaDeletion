import { gatherPath, deleteFile, killProcesses } from "./file.controller.js";
import {
  getListElement,
  getTimerInput,
  createItemInList,
  countItemInList,
  getButtonInItem,
  updateTimer,
  resetUI,
  disableStartComponent,
  enableStartComponent,
  isCloseWhenFinish,
  isKillProcess,
  isUsePdfTemplate,
} from "./view.js";

import {
  scheduleTimeout,
  startInteval,
  stopInterval,
  stopScheduleTimeout,
} from "./schedule.helper.js";
import { SECOND } from "./constants.js";

window.timerVal = 0;

async function setTray() {
  if (NL_MODE != "window") {
    console.debug("INFO: Tray menu is only available in the window mode.");
    return;
  }
  let tray = {
    icon: "/resources/icons/ninjaIcon.png",
    menuItems: [
      { id: "VERSION", text: "Get version" },
      { id: "SEP", text: "-" },
      {
        id: "QUIT",
        text: "Quit",
      },
      {
        id: "SHOW",
        text: "Show",
        isDisabled: await Neutralino.window.isVisible(),
      },
    ],
  };
  Neutralino.os.setTray(tray);
}

async function onTrayMenuItemClicked(event) {
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
    case "SHOW":
      await Neutralino.window.show();
      setTray();
      break;
  }
}

function onWindowClose() {
  Neutralino.app.exit();
}

Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

function initButtonEvent() {
  document
    .getElementById("btnReset")
    .addEventListener("click", onClickBtnReset);
  document
    .getElementById("btnChoose")
    .addEventListener("click", onClickBtnChoose);
  document
    .getElementById("btnChooseFolder")
    .addEventListener("click", onClickBtnChooseFolder);
  document
    .getElementById("btnStart")
    .addEventListener("click", onClickBtnStart);
  document.getElementById("btnStop").addEventListener("click", onClickBtnStop);
  document.getElementById("btnHide").addEventListener("click", onClickBtnHide);
  enableStartComponent();
}
initButtonEvent();

if (NL_OS != "Darwin") {
  // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}

function onClickBtnReset() {
  onClickBtnStop();
  console.debug("btnReset clicked");
  resetUI();
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

  const ul = getListElement();
  const existingAmount = countItemInList(); //elements that already existing in ul
  let idx = 0;

  for (let e of list) {
    const item = createItemInList(e, idx + existingAmount, isFile);
    idx++;
    const btn = getButtonInItem(item);
    btn.addEventListener("click", onClickBtnRemoveItem.bind(null, item.id));

    ul.appendChild(item);
  }
}

//debug
{
  addToList(["hehe", "hoho", "huhu"]);
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

let intervalTimer;
let timeroutTimer;

function startCountDown() {
  disableStartComponent(); //disable btnStart & delay time input
  const delayTimeStr = getTimerInput().value;
  let delayTime = 0;
  if (!isNaN(delayTimeStr)) {
    delayTime = parseInt(delayTimeStr) || 0; //|| 0 is for "" because !isNaN("") = true
  }

  //display count down timer
  window.timerVal = delayTime - 1;
  intervalTimer = startInteval(updateTimer, 1 * SECOND);

  //shedule time to call func delete files
  console.debug(`btnStart clicked! ${delayTime} second(s)`);
  const allFileToDel = gatherPath();

  timeroutTimer = scheduleTimeout(async () => {
    processDeletion(allFileToDel);
  }, delayTime * SECOND);
}

async function processDeletion(allFileToDel) {
  if (isKillProcess() === true) {
    await killProcesses(isUsePdfTemplate(), [""]);
  }

  await deleteFile(allFileToDel);
  onClickBtnReset();
  if (isCloseWhenFinish() === true) {
    Neutralino.app.exit();
  }
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
async function onClickBtnStop() {
  console.debug("btnStop clicked");
  stopInterval(intervalTimer);
  stopScheduleTimeout(timeroutTimer);
  window.timerVal = 0;
  updateTimer();
  enableStartComponent();
}

async function onClickBtnHide() {
  console.debug("btnHide clicked");
  await Neutralino.window.hide();
  setTray();
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
