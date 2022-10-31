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

export {
  getListElement,
  getTimerInput,
  createItemInList,
  countItemInList,
  getButtonInItem,
};
