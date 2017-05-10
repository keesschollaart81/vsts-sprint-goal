define(["require", "exports", "q", "VSS/Controls", "VSS/Controls/Menus", "VSS/Controls/StatusIndicator"], function (require, exports, Q, Controls, Menus, StatusIndicator) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SprintGoal = (function () {
        function SprintGoal() {
            var _this = this;
            this.getTabTitle = function (tabContext) {
                console.log('getTabTitle');
                if (tabContext && tabContext.iterationId) {
                    _this.iterationId = tabContext.iterationId;
                    var goalText = _this.getCookie(_this.iterationId + "goalText");
                    var sprintGoalInTabLabel = _this.getCookie(_this.iterationId + "sprintGoalInTabLabel");
                    if (sprintGoalInTabLabel == "true" && goalText != null)
                        return "Goal: " + goalText.substr(0, 60) + "";
                    else
                        return "Goal";
                }
                else {
                    tabContext;
                    return "Goal";
                }
            };
            this.saveSettings = function () {
                console.log('saveSettings');
                _this.waitControl.startWait();
                var sprintConfig = {
                    sprintGoalInTabLabel: $("#sprintGoalInTabLabel").prop("checked"),
                    goal: $("#goal").val()
                };
                _this.setCookie(_this.iterationId + "goalText", sprintConfig.goal);
                _this.setCookie(_this.iterationId + "sprintGoalInTabLabel", sprintConfig.sprintGoalInTabLabel);
                VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                    dataService.setValue("sprintConfig." + _this.iterationId, sprintConfig).then(function (value) {
                        _this.waitControl.endWait();
                    });
                });
            };
            this.getSettings = function () {
                console.log('getSettings');
                _this.waitControl.startWait();
                VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                    Q.when(dataService.getValue("sprintConfig." + _this.iterationId), function (object) {
                        if (object) {
                            $("#sprintGoalInTabLabel").prop("checked", object.sprintGoalInTabLabel);
                            $("#goal").val(object.goal);
                            _this.setCookie(_this.iterationId + "goalText", object.goal);
                            _this.setCookie(_this.iterationId + "sprintGoalInTabLabel", object.sprintGoalInTabLabel);
                        }
                        _this.waitControl.endWait();
                    });
                });
            };
            console.log('constructor');
            var waitControlOptions = {
                target: $("#sprint-goal"),
                cancellable: false,
                backgroundColor: "#ffffff"
            };
            this.waitControl = Controls.create(StatusIndicator.WaitControl, $("#sprint-goal"), waitControlOptions);
            if (VSS.getContribution().type === "ms.vss-web.tab") {
                VSS.register(VSS.getContribution().id, {
                    pageTitle: this.getTabTitle,
                    name: this.getTabTitle,
                    isInvisible: function (state) {
                        return false;
                    }
                });
            }
            $('.saveButton').on('click', function (eventObject) {
                _this.saveSettings();
            });
            this.getSettings();
            var menuItems = [
                { id: "save", text: "Save", icon: "icon-save" }
            ];
            var menubarOptions = {
                items: menuItems,
                executeAction: function (args) {
                    var command = args.get_commandName();
                    switch (command) {
                        case "save":
                            _this.saveSettings();
                            break;
                        default:
                            alert("Unhandled action: " + command);
                            break;
                    }
                }
            };
            var menubar = Controls.create(Menus.MenuBar, $(".toolbar"), menubarOptions);
        }
        SprintGoal.prototype.setCookie = function (key, value) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
        };
        SprintGoal.prototype.getCookie = function (key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        };
        return SprintGoal;
    }());
    exports.SprintGoal = SprintGoal;
});
//# sourceMappingURL=extension.js.map 
