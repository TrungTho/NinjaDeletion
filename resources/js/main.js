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
    icon: "/resources/icons/ninja.png",
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
}

function addToList(elements) {
  let list = [];
  switch (typeof elements) {
    case "string": {
      console.debug("input from pick folder");
      list.push(elements);
      break;
    }

    case "object": {
      console.debug("input from pick files");
      list = elements;
      break;
    }
  }

  const ul = document.getElementById("listToDel");
  for (let e of list) {
    const item = document.createElement("div");
    item.appendChild(document.createTextNode(e));
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

function startCountDown() {
  console.debug("btnStart clicked!");
}

function hideApp() {
  console.debug("btnHide clicked");
}
