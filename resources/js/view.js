import { ITEM_TYPE } from "./constants.js";

/**
 * @return {HTMLUListElement} listToDel - the main list that contains files, folders user wants to delete
 */
function getListElement() {
  return document.getElementById("listToDel");
}

//get element to input delay time
function getTimerInput() {
  return document.getElementById("inpDelayTime");
}

//create an item in list
/**
 * @param  {string} pathVal - absolute path to file/ folder to delete
 * @param  {number} itemIdx - index of item in list (for deletion)
 * @param  {boolean} isFile - file / folder
 *
 * @return {HTMLDivElement} item - created item to add to list
 */
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
/**
 * @return {number} total - total item in the main list
 */
function countItemInList() {
  return getListElement().getElementsByTagName("div").length;
}

/**
 * @param  {HTMLDivElement} item - main item in the list
 * @return  {HTMLButtonElement} button - delete button in an item
 */
function getButtonInItem(item) {
  return item.querySelector("button");
}
/**
 * function to update count-down timer UI
 */
function updateTimer() {
  console.debug("tick, time left: ", window.timerVal);

  if (isNaN(window.timerVal)) return;
  if (window.timerVal < 0) return;

  const p = document.getElementById("inpDelayTime");
  p.value = window.timerVal;
  window.timerVal--;
}

/**
 * function to disable/ hide all start's components
 */
function disableStartComponent() {
  document.getElementById("btnStart").disabled = true;
  document.getElementById("inpDelayTime").disabled = true;
  document.getElementById("btnStop").disabled = false;
  document.getElementById("btnStart").classList.add("button--hide");
  document.getElementById("btnStop").classList.remove("button--hide");
}

/**
 * function to disable/ hide all stop's components
 */
function enableStartComponent() {
  document.getElementById("btnStart").disabled = false;
  document.getElementById("inpDelayTime").disabled = false;
  document.getElementById("btnStop").disabled = true;
  document.getElementById("btnStop").classList.add("button--hide");
  document.getElementById("btnStart").classList.remove("button--hide");
}

/**
 * function to reset list to empty, reset timer & enable start's components
 */
function resetUI() {
  getListElement().innerHTML = "";
  document.getElementById("inpDelayTime").value = "";
  enableStartComponent();
}

/**
 * function to check if user wants to close app when deletion finish
 * @return {boolean} isClose - checkbox value
 */
function isCloseWhenFinish() {
  return document.getElementById("checkFinishClose").checked;
}

/**
 * function to check if user wants to exec cmd and kills some processes before start the deletion
 * (there are other apps that prevent os to delete files when still opening (pdf viewer such as foxitreader))
 * @return {boolean} isKillProcess - checkbox value
 */
function isKillProcess() {
  return document.getElementById("checkKillProcess").checked;
}

/**
 * function to apply some default templates to kill processes
 * (for now: foxitreader, javelin, acrobat, pdfviewer)
 * @return {boolean} isUsingTemplate - checkbox value
 */
function isUsePdfTemplate() {
  return document.getElementById("checkPdfTemplate").checked;
}

/**
 * function to check if user wants to send result logs after the whole process
 * @return {boolean} isSyncLog - checkbox value
 */
function isLogWhenFinish() {
  return document.getElementById("checkLogResult").checked;
}
/**
 * @return {HTMLButtonElement} btnStart - start button in the timer section
 */
function getBtnStart() {
  return document.getElementById("btnStart");
}

/**
 * @return {HTMLButtonElement} btnStop - stop button in the timer section
 */
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
