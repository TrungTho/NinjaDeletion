"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var file_controller_js_1 = require("./file.controller.js");
var view_js_1 = require("./view.js");
var schedule_helper_js_1 = require("./schedule.helper.js");
var constants_js_1 = require("./constants.js");
window.timerVal = 0;
function setTray() {
    return __awaiter(this, void 0, void 0, function () {
        var tray, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (NL_MODE != "window") {
                        console.debug("INFO: Tray menu is only available in the window mode.");
                        return [2 /*return*/];
                    }
                    _b = {
                        icon: "/resources/icons/ninjaIcon.png"
                    };
                    _a = [{ id: "VERSION", text: "Get version" },
                        { id: "SEP", text: "-" },
                        {
                            id: "QUIT",
                            text: "Quit",
                        }];
                    _c = {
                        id: "SHOW",
                        text: "Show"
                    };
                    return [4 /*yield*/, Neutralino.window.isVisible()];
                case 1:
                    tray = (_b.menuItems = _a.concat([
                        (_c.isDisabled = _d.sent(),
                            _c)
                    ]),
                        _b);
                    Neutralino.os.setTray(tray);
                    return [2 /*return*/];
            }
        });
    });
}
function onTrayMenuItemClicked(event) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = event.detail.id;
                    switch (_a) {
                        case "VERSION": return [3 /*break*/, 1];
                        case "QUIT": return [3 /*break*/, 2];
                        case "SHOW": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1:
                    Neutralino.os.showMessageBox("Version information", "Neutralinojs server: v".concat(NL_VERSION, " | Neutralinojs client: v").concat(NL_CVERSION));
                    return [3 /*break*/, 5];
                case 2:
                    Neutralino.app.exit();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, Neutralino.window.show()];
                case 4:
                    _b.sent();
                    setTray();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
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
    (0, view_js_1.enableStartComponent)();
}
initButtonEvent();
if (NL_OS != "Darwin") {
    // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}
function onClickBtnReset() {
    onClickBtnStop();
    console.debug("btnReset clicked");
    (0, view_js_1.resetUI)();
}
function addToList(elements) {
    var list = [];
    var isFile = false;
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
    var ul = (0, view_js_1.getListElement)();
    var existingAmount = (0, view_js_1.countItemInList)(); //elements that already existing in ul
    var idx = 0;
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var e = list_1[_i];
        var item = (0, view_js_1.createItemInList)(e, idx + existingAmount, isFile);
        idx++;
        var btn = (0, view_js_1.getButtonInItem)(item);
        btn.addEventListener("click", onClickBtnRemoveItem.bind(null, item.id));
        ul.appendChild(item);
    }
}
//debug
function mockSection() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            {
                addToList(["hehe", "hoho", "huhu"]);
            }
            return [2 /*return*/];
        });
    });
}
function onClickBtnChoose() {
    return __awaiter(this, void 0, void 0, function () {
        var entries;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("btnChoose clicked");
                    return [4 /*yield*/, Neutralino.os.showOpenDialog("You choose file, I will do the rest", {
                            defaultPath: "./",
                            filters: [{ name: "All files", extensions: ["*"] }],
                            multiSelections: true,
                        })];
                case 1:
                    entries = _a.sent();
                    console.debug("You have selected:", entries);
                    addToList(entries);
                    return [2 /*return*/];
            }
        });
    });
}
mockSection();
function onClickBtnChooseFolder() {
    return __awaiter(this, void 0, void 0, function () {
        var entry;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("btnChooseFolder clicked");
                    return [4 /*yield*/, Neutralino.os.showFolderDialog("You choose folder, I will take the rest", {
                            defaultPath: "./",
                        })];
                case 1:
                    entry = _a.sent();
                    console.debug("You have selected:", entry);
                    addToList(entry);
                    return [2 /*return*/];
            }
        });
    });
}
var intervalTimer;
var timeroutTimer;
function startCountDown() {
    var _this = this;
    (0, view_js_1.disableStartComponent)(); //disable btnStart & delay time input
    var delayTimeStr = (0, view_js_1.getTimerInput)().value;
    var delayTime = 0;
    if (!isNaN(delayTimeStr)) {
        delayTime = parseInt(delayTimeStr) || 0; //|| 0 is for "" because !isNaN("") = true
    }
    //display count down timer
    window.timerVal = delayTime - 1;
    intervalTimer = (0, schedule_helper_js_1.startInteval)(view_js_1.updateTimer, 1 * constants_js_1.SECOND);
    //shedule time to call func delete files
    console.debug("btnStart clicked! ".concat(delayTime, " second(s)"));
    var allFileToDel = (0, file_controller_js_1.gatherPath)();
    timeroutTimer = (0, schedule_helper_js_1.scheduleTimeout)(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            processDeletion(allFileToDel);
            return [2 /*return*/];
        });
    }); }, delayTime * constants_js_1.SECOND);
}
/**
 * @param  {Array<import("./file.controller.js").File} allFileToDel
 */
function processDeletion(allFileToDel) {
    return __awaiter(this, void 0, void 0, function () {
        var stats;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!((0, view_js_1.isKillProcess)() === true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, file_controller_js_1.killProcesses)((0, view_js_1.isUsePdfTemplate)(), [""])];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    onClickBtnReset();
                    return [4 /*yield*/, (0, file_controller_js_1.deleteFile)(allFileToDel)];
                case 3:
                    stats = _a.sent();
                    console.debug("deletion stats:", JSON.stringify(stats));
                    if (!((0, view_js_1.isLogWhenFinish)() == true)) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, file_controller_js_1.syncResultLogs)(stats)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if ((0, view_js_1.isCloseWhenFinish)() === true) {
                        Neutralino.app.exit();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function onClickBtnStart() {
    return __awaiter(this, void 0, void 0, function () {
        var button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((0, view_js_1.getListElement)().getElementsByTagName("div").length === 0) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, Neutralino.os.showMessageBox("Confirm", "Do you want to start deletion?", "YES_NO", "QUESTION")];
                case 1:
                    button = _a.sent();
                    if (button === "YES") {
                        startCountDown();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function onClickBtnStop() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.debug("btnStop clicked");
            (0, schedule_helper_js_1.stopInterval)(intervalTimer);
            (0, schedule_helper_js_1.stopScheduleTimeout)(timeroutTimer);
            window.timerVal = 0;
            (0, view_js_1.updateTimer)();
            (0, view_js_1.enableStartComponent)();
            return [2 /*return*/];
        });
    });
}
function onClickBtnHide() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("btnHide clicked");
                    return [4 /*yield*/, Neutralino.window.hide()];
                case 1:
                    _a.sent();
                    setTray();
                    return [2 /*return*/];
            }
        });
    });
}
function onClickBtnRemoveItem(itemId) {
    console.debug("remove item", itemId);
    try {
        var ul = (0, view_js_1.getListElement)();
        ul.querySelector("#".concat(itemId)).remove();
    }
    catch (e) {
        console.debug("failed to remove item from list", e);
    }
}
