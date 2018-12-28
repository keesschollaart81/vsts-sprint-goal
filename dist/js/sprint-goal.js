var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
define(["require", "exports", "VSS/Controls", "VSS/Controls/Menus", "VSS/Controls/StatusIndicator", "vanilla-emoji-picker"], function (require, exports, Controls, Menus, StatusIndicator, EmojiPicker) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SprintGoal = /** @class */ (function () {
        function SprintGoal(ai) {
            var _this = this;
            this.ai = ai;
            this.buildWaitControl = function () {
                var waitControlOptions = {
                    target: $("#sprint-goal"),
                    cancellable: false,
                    backgroundColor: "#ffffff",
                    message: "Processing your Sprint Goal..",
                    showDelay: 0
                };
                _this.waitControl = Controls.create(StatusIndicator.WaitControl, $("#sprint-goal"), waitControlOptions);
            };
            this.contextUpdated = function (ctx, reloadWhenIterationChanges) {
                if (ctx.iterationId == _this.iterationId)
                    return;
                if (reloadWhenIterationChanges) {
                    VSS.getService(VSS.ServiceIds.Navigation).then(function (hostNavigationService) {
                        //hostNavigationService.setTabTitle("my sprint goal"); // if only this was available
                        hostNavigationService.reload();
                    });
                }
            };
            this.getLocation = function (href) {
                var l = document.createElement("a");
                l.href = href;
                return l;
            };
            this.buildMenuBar = function () {
                var menuItems = [
                    { id: "save", text: "Save", icon: "icon-save" }
                ];
                var menubarOptions = {
                    items: menuItems,
                    executeAction: function (args) {
                        var command = args.get_commandName();
                        switch (command) {
                            case "save":
                                _this.saveSettings().then(function () {
                                    VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                                        navigationService.reload();
                                    });
                                });
                                break;
                            default:
                                alert("Unhandled action: " + command);
                                break;
                        }
                    }
                };
                var menubar = Controls.create(Menus.MenuBar, $(".toolbar"), menubarOptions);
            };
            this.getTabTitle = function (tabContext) { return __awaiter(_this, void 0, void 0, function () {
                var sprintGoalCookie, settings, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.log('getTabTitle');
                            if (!tabContext || !tabContext.iterationId) {
                                this.log("getTabTitle: tabContext or tabContext.iterationId empty");
                                return [2 /*return*/, "Goal"];
                            }
                            this.iterationId = tabContext.iterationId;
                            sprintGoalCookie = this.getSprintGoalFromCookie();
                            if (!!sprintGoalCookie) return [3 /*break*/, 4];
                            this.log("getTabTitle: Sprint goal net yet loaded in cookie, getting it async...");
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.getSettings(true)];
                        case 2:
                            settings = _b.sent();
                            return [2 /*return*/, "Goal: " + settings.goal];
                        case 3:
                            _a = _b.sent();
                            return [2 /*return*/, "Goal"];
                        case 4:
                            if (sprintGoalCookie && sprintGoalCookie.sprintGoalInTabLabel && sprintGoalCookie.goal != null) {
                                this.log("getTabTitle: loaded title from cookie");
                                return [2 /*return*/, "Goal: " + sprintGoalCookie.goal];
                            }
                            else {
                                this.log("getTabTitle: Cookie found but empty goal");
                                return [2 /*return*/, "Goal"];
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            this.getSprintGoalFromCookie = function () {
                var goal = _this.getCookie(_this.getConfigKey(_this.iterationId, _this.teamId) + "goalText");
                var sprintGoalInTabLabel = false;
                if (goal) {
                    sprintGoalInTabLabel = (_this.getCookie(_this.getConfigKey(_this.iterationId, _this.teamId) + "sprintGoalInTabLabel") == "true");
                }
                if (!goal)
                    return undefined;
                return {
                    goal: goal,
                    sprintGoalInTabLabel: sprintGoalInTabLabel
                };
            };
            this.saveSettings = function () {
                _this.log('saveSettings');
                if (_this.waitControl)
                    _this.waitControl.startWait();
                $(".emoji-wysiwyg-editor").blur(); //ie11 hook to force WYIWYG editor to copy value to #goal input field
                var sprintConfig = {
                    sprintGoalInTabLabel: $("#sprintGoalInTabLabel").prop("checked"),
                    goal: $("#goal").val()
                };
                if (_this.ai)
                    _this.ai.trackEvent("SaveSettings", sprintConfig);
                var configIdentifierWithTeam = _this.getConfigKey(_this.iterationId, _this.teamId);
                _this.updateSprintGoalCookie(configIdentifierWithTeam, sprintConfig);
                return VSS.getService(VSS.ServiceIds.ExtensionData)
                    .then(function (dataService) {
                    _this.log('saveSettings: ExtensionData Service Loaded, saving for ' + configIdentifierWithTeam, sprintConfig);
                    return dataService.setValue("sprintConfig." + configIdentifierWithTeam, sprintConfig);
                })
                    .then(function (value) {
                    _this.log('saveSettings: settings saved!', value);
                    if (_this.waitControl)
                        _this.waitControl.endWait();
                });
            };
            this.getSettings = function (forceReload) { return __awaiter(_this, void 0, void 0, function () {
                var currentGoalInCookie, cookieSupport, configIdentifierWithTeam, teamGoal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.log('getSettings');
                            if (this.waitControl)
                                this.waitControl.startWait();
                            currentGoalInCookie = this.getSprintGoalFromCookie();
                            cookieSupport = this.checkCookie();
                            if (!(forceReload || !currentGoalInCookie || !cookieSupport)) return [3 /*break*/, 2];
                            configIdentifierWithTeam = this.getConfigKey(this.iterationId, this.teamId);
                            return [4 /*yield*/, this.fetchSettingsFromExtensionDataService(configIdentifierWithTeam)];
                        case 1:
                            teamGoal = _a.sent();
                            if (teamGoal) {
                                this.updateSprintGoalCookie(configIdentifierWithTeam, teamGoal);
                                return [2 /*return*/, teamGoal];
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            this.log('getSettings: fetched settings from cookie');
                            return [2 /*return*/, currentGoalInCookie];
                        case 3: return [2 /*return*/];
                    }
                });
            }); };
            this.fetchSettingsFromExtensionDataService = function (key) {
                return VSS.getService(VSS.ServiceIds.ExtensionData)
                    .then(function (dataService) {
                    _this.log('getSettings: ExtensionData Service Loaded, get value by key: ' + key);
                    try {
                        return dataService.getValue("sprintConfig." + key);
                    }
                    catch (e) {
                        return null;
                    }
                })
                    .then(function (sprintGoalDto) {
                    _this.log('getSettings: ExtensionData Service fetched data', sprintGoalDto);
                    if (_this.waitControl)
                        _this.waitControl.endWait();
                    return sprintGoalDto;
                });
            };
            this.getConfigKey = function (iterationId, teamId) {
                // https://github.com/Microsoft/vss-web-extension-sdk/issues/75
                return iterationId.toString().substring(0, 15) + teamId.toString().substring(0, 15);
            };
            this.updateSprintGoalCookie = function (key, sprintGoal) {
                _this.setCookie(key + "goalText", sprintGoal.goal);
                _this.setCookie(key + "sprintGoalInTabLabel", sprintGoal.sprintGoalInTabLabel);
            };
            this.fillForm = function (sprintGoal) {
                if (!_this.checkCookie()) {
                    $("#cookieWarning").show();
                }
                if (!sprintGoal) {
                    $("#sprintGoalInTabLabel").prop("checked", true);
                    $("#goal").val("");
                }
                else {
                    $("#sprintGoalInTabLabel").prop("checked", sprintGoal.sprintGoalInTabLabel);
                    $("#goal").val(sprintGoal.goal);
                }
            };
            this.setCookie = function (key, value) {
                var expires = new Date();
                expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
                document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';domain=' + _this.storageUri + ';path=/';
            };
            this.checkCookie = function () {
                _this.setCookie("testcookie", true);
                var success = (_this.getCookie("testcookie") == "true");
                return success;
            };
            this.log = function (message, object) {
                if (object === void 0) { object = null; }
                if (!window.console)
                    return;
                if (_this.storageUri.indexOf('dev') === -1 && _this.storageUri.indexOf('acc') === -1)
                    return;
                if (object) {
                    console.log(message, object);
                    return;
                }
                console.log(message);
            };
            try {
                var context = VSS.getExtensionContext();
                this.storageUri = this.getLocation(context.baseUri).hostname;
                var webContext = VSS.getWebContext();
                this.log('TeamId:' + webContext.team.id);
                this.teamId = webContext.team.id;
                var config = VSS.getConfiguration();
                this.log('constructor, foregroundInstance = ' + config.foregroundInstance);
                var reloadWhenIterationChanges = false;
                if (config.foregroundInstance) { // else: config.host.background == true
                    // this code runs when the form is loaded, otherwise, just load the tab
                    reloadWhenIterationChanges = true;
                    this.iterationId = config.iterationId;
                    this.buildWaitControl();
                    this.getSettings(true).then(function (settings) {
                        new EmojiPicker({});
                        _this.fillForm(settings);
                    });
                    this.buildMenuBar();
                    ai.trackPageView(document.title);
                }
                // register this 'Sprint Goal' service
                VSS.register(VSS.getContribution().id, {
                    pageTitle: this.getTabTitle,
                    uri: undefined,
                    updateContext: function (ctx) { return _this.contextUpdated(ctx, reloadWhenIterationChanges); },
                    name: this.getTabTitle,
                    isInvisible: function (state) { return false; }
                });
            }
            catch (e) {
                if (this.ai)
                    this.ai.trackException(e);
            }
        }
        SprintGoal.prototype.getCookie = function (key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        };
        return SprintGoal;
    }());
    exports.SprintGoal = SprintGoal;
    var SprintGoalDto = /** @class */ (function () {
        function SprintGoalDto() {
        }
        return SprintGoalDto;
    }());
    exports.SprintGoalDto = SprintGoalDto;
});
