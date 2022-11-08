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
exports.syncResultLogs = exports.killProcesses = exports.gatherPath = exports.deleteFile = void 0;
var constants_js_1 = require("./constants.js");
var telegram_helper_js_1 = require("./telegram.helper.js");
/**
 * @typedef {Object} FailedLog
 * @property {string} filePath - full path to file/ folder
 * @property {string} errorMsg - error message
 */
/**
 * @typedef {Object} DeletionStats
 * @property {Array.<File>} detail - total number of files want to delete
 * @property {FailedLog} failedLogs - all failed logs when deleted file
 */
/**
 * @param  {Array.<File>} items
 *
 * @return {DeletionStats} stats
 */
function deleteFile(items) {
    return __awaiter(this, void 0, void 0, function () {
        var failedFiles, _i, items_1, item, e_1, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("i want to delete:");
                    console.debug(items);
                    failedFiles = [];
                    _i = 0, items_1 = items;
                    _a.label = 1;
                case 1:
                    if (!(_i < items_1.length)) return [3 /*break*/, 11];
                    item = items_1[_i];
                    if (!(item.type === constants_js_1.ITEM_TYPE.FILE)) return [3 /*break*/, 6];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, Neutralino.filesystem.removeFile(item.path)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    failedFiles.push({
                        filepath: item.path,
                        errorMsg: e_1,
                    });
                    console.error("failed to delete file:", JSON.stringify(e_1));
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 10];
                case 6:
                    if (!(item.type === constants_js_1.ITEM_TYPE.FOLDER)) return [3 /*break*/, 10];
                    _a.label = 7;
                case 7:
                    _a.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, Neutralino.filesystem.removeDirectory(item.path)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_2 = _a.sent();
                    failedFiles.push({
                        filepath: item.path,
                        errorMsg: e_2,
                    });
                    console.error("failed to delete folder:", JSON.stringify(e_2));
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11: return [2 /*return*/, {
                        failedLogs: failedFiles,
                        detail: items,
                    }];
            }
        });
    });
}
exports.deleteFile = deleteFile;
/**
 * @typedef {Object} File
 * @property {number} type - file/ folder
 * @property {string} path - full path to file/ folder in PC
 */
/**
 * @return {Array.<File>}
 */
function gatherPath() {
    var files = [];
    var divCollection = document
        .getElementById("listToDel")
        .getElementsByTagName("div");
    for (var _i = 0, divCollection_1 = divCollection; _i < divCollection_1.length; _i++) {
        var div = divCollection_1[_i];
        var item = {
            type: div.getAttribute("item-type"),
            path: div.innerText,
        };
        files.push(item);
    }
    return files;
}
exports.gatherPath = gatherPath;
/**
 * @param  {Boolean} isUseTemplate
 * @param  {Array.<String>} customProcesses
 */
function killProcesses(isUseTemplate, customProcesses) {
    return __awaiter(this, void 0, void 0, function () {
        var processesToKill, _i, processesToKill_1, process, info, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.debug("start to kill processes", isUseTemplate, customProcesses);
                    processesToKill = customProcesses || [];
                    if (isUseTemplate === true) {
                        processesToKill = customProcesses.concat(NL_PDF_APPS);
                    }
                    _i = 0, processesToKill_1 = processesToKill;
                    _a.label = 1;
                case 1:
                    if (!(_i < processesToKill_1.length)) return [3 /*break*/, 6];
                    process = processesToKill_1[_i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, Neutralino.os.execCommand("taskkill /IM ".concat(process), {
                        // background: true,
                        })];
                case 3:
                    info = _a.sent();
                    console.debug("kill process info: ", process, info);
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    console.error("error when kill process ", process, e_3);
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.killProcesses = killProcesses;
/**
 * @param  {DeletionStats} stats - stats from deletion process
 */
function syncResultLogs(stats) {
    return __awaiter(this, void 0, void 0, function () {
        var logs, _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    logs = buildLogContent(stats);
                    _a = telegram_helper_js_1.sendMessage;
                    _c = {
                        text: logs
                    };
                    _b = "-".concat;
                    return [4 /*yield*/, Neutralino.storage.getData("TEST_ID")];
                case 1: return [4 /*yield*/, _a.apply(void 0, [(_c.chat_id = _b.apply("-", [_d.sent()]),
                            _c.parse_mode = constants_js_1.TELEGRAM_PARSE_MODE,
                            _c)])];
                case 2:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.syncResultLogs = syncResultLogs;
/**
 * @param  {DeletionStats} stats - stats from deletion process
 *
 * @return {string} logs - final content to send via telegram
 */
function buildLogContent(stats) {
    var formatedDetail = "";
    var formatedFailed = "";
    for (var _i = 0, _a = stats.detail; _i < _a.length; _i++) {
        var item = _a[_i];
        formatedDetail = formatedDetail + JSON.stringify(item) + "\n";
    }
    for (var _b = 0, _c = stats.failedLogs; _b < _c.length; _b++) {
        var item = _c[_b];
        formatedFailed = formatedFailed + JSON.stringify(item) + "\n";
    }
    var logs = "\n  <b>Time:</b> ".concat(new Date(), "  \n  <b>Total files:</b> ").concat(stats.detail.length, "  \n  <b>Success:</b> ").concat(stats.detail.length - stats.failedLogs.length, "  \n\n  ---\n\n  <b>Details:</b> \n  ").concat(formatedDetail, "\n\n  ---\n\n  <b>Failed logs:</b>\n  ").concat(formatedFailed, "\n  ");
    console.debug("formated logs:", logs);
    return logs;
}
