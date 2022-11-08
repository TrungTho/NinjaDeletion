"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogWhenFinish = exports.isUsePdfTemplate = exports.isKillProcess = exports.isCloseWhenFinish = exports.enableStartComponent = exports.disableStartComponent = exports.resetUI = exports.updateTimer = exports.getButtonInItem = exports.countItemInList = exports.createItemInList = exports.getTimerInput = exports.getListElement = void 0;
var constants_js_1 = require("./constants.js");
function getListElement() {
    return document.getElementById("listToDel");
}
exports.getListElement = getListElement;
//get element to input delay time
function getTimerInput() {
    return document.getElementById("inpDelayTime");
}
exports.getTimerInput = getTimerInput;
//create an item in list
function createItemInList(pathVal, itemIdx, isFile) {
    var item = document.createElement("div");
    var btn = document.createElement("button");
    var divId = "item-".concat(itemIdx);
    // btn.textContent = "-";
    item.appendChild(btn);
    item.appendChild(document.createTextNode(pathVal));
    item.setAttribute("id", divId);
    item.setAttribute("item-type", isFile === true ? constants_js_1.ITEM_TYPE.FILE : constants_js_1.ITEM_TYPE.FOLDER);
    return item;
}
exports.createItemInList = createItemInList;
function countItemInList() {
    return getListElement().getElementsByTagName("div").length;
}
exports.countItemInList = countItemInList;
function getButtonInItem(item) {
    return item.querySelector("button");
}
exports.getButtonInItem = getButtonInItem;
function updateTimer() {
    console.debug("tick, time left: ", window.timerVal);
    if (isNaN(window.timerVal))
        return;
    if (window.timerVal < 0)
        return;
    var p = document.getElementById("displayTimer");
    p.innerText = window.timerVal;
    window.timerVal--;
}
exports.updateTimer = updateTimer;
function disableStartComponent() {
    document.getElementById("btnStart").disabled = true;
    document.getElementById("inpDelayTime").disabled = true;
    document.getElementById("btnStop").disabled = false;
}
exports.disableStartComponent = disableStartComponent;
function enableStartComponent() {
    document.getElementById("btnStart").disabled = false;
    document.getElementById("inpDelayTime").disabled = false;
    document.getElementById("btnStop").disabled = true;
}
exports.enableStartComponent = enableStartComponent;
function resetUI() {
    getListElement().innerHTML = "";
    document.getElementById("inpDelayTime").value = "";
    enableStartComponent();
}
exports.resetUI = resetUI;
function isCloseWhenFinish() {
    return document.getElementById("checkFinishClose").checked;
}
exports.isCloseWhenFinish = isCloseWhenFinish;
function isKillProcess() {
    return document.getElementById("checkKillProcess").checked;
}
exports.isKillProcess = isKillProcess;
function isUsePdfTemplate() {
    return document.getElementById("checkPdfTemplate").checked;
}
exports.isUsePdfTemplate = isUsePdfTemplate;
function isLogWhenFinish() {
    return document.getElementById("checkLogResult").checked;
}
exports.isLogWhenFinish = isLogWhenFinish;
