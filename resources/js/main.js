// This is just a sample app. You can structure your Neutralinojs app code as you wish.
// This example app is written with vanilla JavaScript and HTML.
// Feel free to use any frontend framework you like :)
// See more details: https://neutralino.js.org/docs/how-to/use-a-frontend-library
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

if (NL_OS != "Darwin") {
  // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
  setTray();
}

function resetList() {
  console.debug("btnReset clicked");
  document.getElementById("listToDel").innerHTML = "";
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
  for (let e of list) {
    const item = document.createElement("div");
    item.appendChild(document.createTextNode(e));
    item.setAttribute(
      "item-type",
      isFile === true ? ITEM_TYPE.FILE : ITEM_TYPE.FOLDER
    );
    ul.appendChild(item);
  }
}

async function openDialog() {
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

async function openFolderDialog() {
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
  resetList();
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

async function onClickBtnStart() {
  if (
    document.getElementById("listToDel").getElementsByTagName("div").length ===
    0
  ) {
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

function startCountDown() {
  const delayTimeStr = document.getElementById("inpDelayTime").value;
  let delayTime = 0;
  if (!isNaN(delayTimeStr)) {
    delayTime = parseInt(delayTimeStr) || 0; //|| 0 is for "" because !isNaN("") = true
  }

  console.debug(`btnStart clicked! ${delayTime} second(s)`);
  const allFileToDel = gatherPath();
  setTimeout(() => {
    deleteFile(allFileToDel);
  }, delayTime * 1000);
}

function hideApp() {
  console.debug("btnHide clicked");
}
