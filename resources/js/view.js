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
  const leftSection = document.createElement("div");
  leftSection.classList.add("main__item-left");
  const btnRemove = document.createElement("button");
  btnRemove.classList.add("main__item-btn-remove");
  btnRemove.innerHTML = `
  <i class="fa-regular fa-trash-can"></i> 
  `;
  const pFileName = document.createElement("p");
  pFileName.classList.add("main__item-file-path");
  pFileName.innerText = pathVal;
  const pFileType = document.createElement("p");
  pFileType.classList.add("main__item-type");
  pFileType.innerText = isFile === true ? "FILE" : "FOLDER";

  const divId = `item-${itemIdx}`;

  leftSection.appendChild(btnRemove);
  leftSection.appendChild(pFileName);
  item.appendChild(leftSection);
  item.appendChild(pFileType);

  item.setAttribute("id", divId);
  item.setAttribute(
    "item-type",
    isFile === true ? ITEM_TYPE.FILE : ITEM_TYPE.FOLDER
  );
  item.classList.add(
    "main__item",
    isFile === true ? "main__item--file" : "main__item--folder"
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

  const p = document.getElementById("inpDelayTime");
  p.value = window.timerVal;
  window.timerVal--;
}

function disableStartComponent() {
  document.getElementById("btnStart").disabled = true;
  document.getElementById("inpDelayTime").disabled = true;
  document.getElementById("btnStop").disabled = false;
  document.getElementById("btnStart").classList.add("button--hide");
  document.getElementById("btnStop").classList.remove("button--hide");
}

function enableStartComponent() {
  document.getElementById("btnStart").disabled = false;
  document.getElementById("inpDelayTime").disabled = false;
  document.getElementById("btnStop").disabled = true;
  document.getElementById("btnStop").classList.add("button--hide");
  document.getElementById("btnStart").classList.remove("button--hide");
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

function getBtnStart() {
  return document.getElementById("btnStart");
}
function getBtnStop() {
  return document.getElementById("btnStop");
}

/**
 * @param  {HTMLDivElement} item
 *
 * @return {string} filepath
 */
function getFilePathFromItem(item) {
  let itemContent = item.innerText;

  return itemContent.substring(0, itemContent.indexOf("\n\n"));
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
  getBtnStart,
  getBtnStop,
  getFilePathFromItem,
};
