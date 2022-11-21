import {
  gatherPath,
  deleteFile,
  killProcesses,
  syncResultLogs,
} from "./file.controller.js";
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
  isLogWhenFinish,
  getBtnStart,
  getBtnStop,
  getBtnConfigTelegram,
  toggleTelegramConfigPopup,
  getTelegramConfigData,
  showNotification,
  fillTelegramConfigData,
  getCustomProcesses,
} from "./view.js";

import {
  scheduleTimeout,
  startInteval,
  stopInterval,
  stopScheduleTimeout,
} from "./schedule.helper.js";
import { NOTIFICATION_TYPE, SECOND } from "./constants.js";
import { sendMessage } from "./telegram.helper.js";

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

(function initButtonEvent() {
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
  getBtnConfigTelegram().addEventListener(
    "click",
    onClickBtnShowTelegramConfig
  );
  document
    .getElementById("btnCancelTelegramConfig")
    .addEventListener("click", onClickBtnShowTelegramConfig);
  document
    .getElementById("btnTestTelegramAccount")
    .addEventListener("click", onClickBtnTestTelegram);
  document
    .getElementById("btnSaveTelegramConfig")
    .addEventListener("click", onClickSaveTelegramConfig);
  enableStartComponent();
})();

(async function initTelegramConfig() {
  let botToken = "",
    chatId = "";
  try {
    botToken = await Neutralino.storage.getData("TEST_T");
    chatId = await Neutralino.storage.getData("TEST_ID");
  } catch (e) {}

  if (botToken.length * chatId.length === 0) {
    showNotification(
      NOTIFICATION_TYPE.ERROR,
      "Telegram Account does not exist"
    );
  } else {
    fillTelegramConfigData({
      botToken,
      chatID: chatId,
    });

    showNotification(
      NOTIFICATION_TYPE.SUCCESS,
      "Telegram Account loaded successfully!"
    );
  }
})();

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
async function mockSection() {
  return;
  {
    addToList(["hehe", "hoho", "huhu"]);
  }
  // await Neutralino.storage.setData("TEST_VAL", "");
  // let envs = await Neutralino.storage.getKeys();
  // console.log("keys:", envs);
  // let config = await Neutralino.app.getConfig();
  // console.log("configs = ", config);
  // // await callAPI({ endpoint: "" });
  // const resp = await callAPI({
  //   endpoint: "http://httpbin.org/user-agent",
  //   method: "GET",
  //   // data: { text: "hello", name: "myName" },
  // });
  // console.debug("resp: ", JSON.stringify(resp));
  // await sendMessage({
  //   text: "hello from neutralino",
  //   chat_id: `-${await Neutralino.storage.getData("TEST_ID")}`,
  // });
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

mockSection();

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

/**
 * @param  {Array<File} allFileToDel
 */
async function processDeletion(allFileToDel) {
  if (isKillProcess() === true) {
    await killProcesses(isUsePdfTemplate(), getCustomProcesses());
  }
  onClickBtnReset();

  const stats = await deleteFile(allFileToDel);
  console.debug("deletion stats:", JSON.stringify(stats));

  if (isLogWhenFinish() == true) {
    await syncResultLogs(stats);
  }

  if (isCloseWhenFinish() === true) {
    Neutralino.app.exit();
  }
}

async function onClickBtnStart() {
  getBtnStart().classList.add("main__timer-button--click");
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
  getBtnStop().classList.add("main__timer-button--click");
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

async function onClickBtnShowTelegramConfig() {
  console.debug("open new window");
  toggleTelegramConfigPopup();
}

async function onClickSaveTelegramConfig() {
  let userInput = getTelegramConfigData();
  if (!userInput) {
    //show error toast
    showNotification(NOTIFICATION_TYPE.ERROR, "Missing Data");
    return;
  }

  try {
    await Neutralino.storage.setData("TEST_T", userInput.botToken);
    await Neutralino.storage.setData("TEST_ID", userInput.chatID);
    showNotification(NOTIFICATION_TYPE.SUCCESS, "Data was saved successfully!");
    toggleTelegramConfigPopup();
  } catch (e) {
    showNotification(NOTIFICATION_TYPE.ERROR, JSON.stringify(e));
  }
}

async function onClickBtnTestTelegram() {
  let userInput = getTelegramConfigData();
  if (!userInput) {
    //show error toast
    showNotification(NOTIFICATION_TYPE.ERROR, "Missing Data");
    return;
  }
  try {
    const res = await sendMessage(
      {
        chat_id: userInput.chatID,
        text: `Test Msg from Ninja Deletion: ${new Date()}`,
      },
      userInput.botToken
    );
    if (res) {
      showNotification(
        NOTIFICATION_TYPE.SUCCESS,
        "Test message was sent successfully!"
      );
    }
  } catch (e) {
    showNotification(
      NOTIFICATION_TYPE.ERROR,
      "Failed!!! Please check your data again!"
    );
  }
}
