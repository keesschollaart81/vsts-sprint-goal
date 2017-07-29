define(["require", "exports", "q", "VSS/Controls", "VSS/Controls/Menus", "VSS/Controls/StatusIndicator"], function (require, exports, Q, Controls, Menus, StatusIndicator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SprintGoalDto = (function () {
        function SprintGoalDto() {
        }
        return SprintGoalDto;
    }());
    exports.SprintGoalDto = SprintGoalDto;
    var SprintGoal = (function () {
        function SprintGoal() {
            var _this = this;
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
                                    $("#saveMessage").show();
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
            this.getTabTitle = function (tabContext) {
                _this.log('getTabTitle');
                if (!tabContext || !tabContext.iterationId) {
                    _this.log("getTabTitle: tabContext or tabContext.iterationId empty");
                    return "Goal";
                }
                // if (!this.checkCookie()) {
                //     this.log("getTabTitle: no cookie support: simple tab title!");
                //     return "Goal";
                // }
                _this.iterationId = tabContext.iterationId;
                var sprintGoalCookie = _this.getSprintGoalFromCookie();
                if (!sprintGoalCookie) {
                    _this.log("getTabTitle: Sprint goal net yet loaded in cookie, cannot (synchrone) fetch this from storage in 'getTabTitle()' context, call is made anyway");
                    // todo: this call will not return sync. And/but we cannot wait here for the result
                    // because this code run every time the tab is visible (board, capacity, etc.) and we do not want to be blocking and slow down those pages
                    // this way, we at least fetch the values from the server (in the 'background') and persist them in a cookie for the next page view
                    var promise = _this.getSettings(true)
                        .then(function (settings) {
                        // if (settings.sprintGoalInTabLabel && settings.goal != null) {
                        //     return "Goal: " + settings.goal.substr(0, 60);
                        // }
                    });
                    return "Goal";
                }
                if (sprintGoalCookie && sprintGoalCookie.sprintGoalInTabLabel && sprintGoalCookie.goal != null) {
                    _this.log("getTabTitle: loaded title from cookie");
                    return "Goal: " + sprintGoalCookie.goal.substr(0, 60);
                }
                else {
                    _this.log("getTabTitle: Cookie found but empty goal");
                    return "Goal";
                }
            };
            this.getSprintGoalFromCookie = function () {
                var goal = _this.getCookie(_this.iterationId + "goalText");
                var sprintGoalInTabLabel = (_this.getCookie(_this.iterationId + "sprintGoalInTabLabel") == "true");
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
                var sprintConfig = {
                    sprintGoalInTabLabel: $("#sprintGoalInTabLabel").prop("checked"),
                    goal: $("#goal").val()
                };
                _this.setCookie(_this.iterationId + "goalText", sprintConfig.goal);
                _this.setCookie(_this.iterationId + "sprintGoalInTabLabel", sprintConfig.sprintGoalInTabLabel);
                return VSS.getService(VSS.ServiceIds.ExtensionData)
                    .then(function (dataService) {
                    _this.log('saveSettings: ExtensionData Service Loaded');
                    return dataService.setValue("sprintConfig." + _this.iterationId, sprintConfig);
                    ;
                })
                    .then(function (value) {
                    _this.log('saveSettings: settings saved!');
                    if (_this.waitControl)
                        _this.waitControl.endWait();
                });
            };
            this.getSettings = function (forceReload) {
                _this.log('getSettings');
                if (_this.waitControl)
                    _this.waitControl.startWait();
                var currentGoalInCookie = _this.getSprintGoalFromCookie();
                var cookieSupport = _this.checkCookie();
                if (forceReload || !currentGoalInCookie || !cookieSupport) {
                    return VSS.getService(VSS.ServiceIds.ExtensionData)
                        .then(function (dataService) {
                        _this.log('getSettings: ExtensionData Service Loaded');
                        return dataService.getValue("sprintConfig." + _this.iterationId);
                    })
                        .then(function (sprintGoalDto) {
                        _this.log('getSettings: ExtensionData Service fetched data', sprintGoalDto);
                        if (sprintGoalDto) {
                            _this.setCookie(_this.iterationId + "goalText", sprintGoalDto.goal);
                            _this.setCookie(_this.iterationId + "sprintGoalInTabLabel", sprintGoalDto.sprintGoalInTabLabel);
                        }
                        if (_this.waitControl)
                            _this.waitControl.endWait();
                        return sprintGoalDto;
                    });
                }
                else {
                    return Q.fcall(function () {
                        _this.log('getSettings: fetched settings from cookie');
                        return currentGoalInCookie;
                    });
                }
            };
            this.fillForm = function (sprintGoal) {
                if (!_this.checkCookie()) {
                    $("#cookieWarning").show();
                }
                if (!sprintGoal) {
                    $("#sprintGoalInTabLabel").prop("checked", false);
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
                document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
            };
            this.checkCookie = function () {
                _this.setCookie("testcookie", true);
                var success = (_this.getCookie("testcookie") == "true");
                return success;
            };
            this.log = function (message, object) {
                if (object === void 0) { object = null; }
                if (object) {
                    console.log(message, object);
                    return;
                }
                console.log(message);
            };
            var config = VSS.getConfiguration();
            this.log('constructor, foregroundInstance = ' + config.foregroundInstance);
            if (config.foregroundInstance) {
                // this code runs when the form is loaded, otherwise, just load the tab
                this.iterationId = config.iterationId;
                this.buildWaitControl();
                this.getSettings(true).then(function (settings) { return _this.fillForm(settings); });
                this.buildMenuBar();
            }
            // register this 'Sprint Goal' service
            VSS.register(VSS.getContribution().id, {
                pageTitle: this.getTabTitle,
                name: this.getTabTitle,
                isInvisible: function (state) {
                    return false;
                }
            });
        }
        SprintGoal.prototype.getCookie = function (key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        };
        return SprintGoal;
    }());
    exports.SprintGoal = SprintGoal;
});
//# sourceMappingURL=extension.js.map 
