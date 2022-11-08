import { ITEM_TYPE } from "./constants.js";

function getListElement() {
  return document.getElementById("listToDel");
}

//get element to input delay time
function getTimerInput() {
  return document.getElementById("inpDelayTime");
}

//create an item in list
function createItemInList(pathVal, itemIdx, isFile) {
  const item = document.createElement("div");
  const btn = document.createElement("button");
  const divId = `item-${itemIdx}`;

  // btn.textContent = "-";

  item.appendChild(btn);
  item.appendChild(document.createTextNode(pathVal));

  item.setAttribute("id", divId);
  item.setAttribute(
    "item-type",
    isFile === true ? ITEM_TYPE.FILE : ITEM_TYPE.FOLDER
  );

  return item;
}

function countItemInList() {
  return getListElement().getElementsByTagName("div").length;
}

function getButtonInItem(item) {
  return item.querySelector("button");
}

function updateTimer() {
  console.debug("tick, time left: ", window.timerVal);

  if (isNaN(window.timerVal)) return;
  if (window.timerVal < 0) return;

  const p = document.getElementById("displayTimer");
  p.innerText = window.timerVal;
  window.timerVal--;
}

function disableStartComponent() {
  document.getElementById("btnStart").disabled = true;
  document.getElementById("inpDelayTime").disabled = true;
  document.getElementById("btnStop").disabled = false;
}

function enableStartComponent() {
  document.getElementById("btnStart").disabled = false;
  document.getElementById("inpDelayTime").disabled = false;
  document.getElementById("btnStop").disabled = true;
}

function resetUI() {
  getListElement().innerHTML = "";
  document.getElementById("inpDelayTime").value = "";
  enableStartComponent();
}

function isCloseWhenFinish() {
  return document.getElementById("checkFinishClose").checked;
}

function isKillProcess() {
  return document.getElementById("checkKillProcess").checked;
}

function isUsePdfTemplate() {
  return document.getElementById("checkPdfTemplate").checked;
}

function isLogWhenFinish() {
  return document.getElementById("checkLogResult").checked;
}

export {
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
};
