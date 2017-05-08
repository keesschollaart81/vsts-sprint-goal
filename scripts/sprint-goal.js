define(["require", "exports", "q"], function (require, exports, Q) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SprintGoal = (function () {
        function SprintGoal() {
            var _this = this;
            console.log('constructor');
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
                _this.saveSettings(_this.iterationId);
            });
            this.getSettings(this.iterationId);
        }
        SprintGoal.prototype.getTabTitle = function (tabContext) {
            console.log('getTabTitle');
            if (tabContext && tabContext.iterationId) {
                return "Goal " + tabContext.iterationId.substr(0, 5) + "";
            }
            else {
                tabContext;
                return "Goal";
            }
        };
        SprintGoal.prototype.saveSettings = function (iterationId) {
            console.log('saveSettings');
            var sprintConfig = {
                sprintGoalInTabLabel: $("#sprintGoalInTabLabel").prop("checked"),
                goal: $("#goal").val()
            };
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                dataService.setValue("sprintConfig." + iterationId, sprintConfig).then(function (value) {
                });
            });
        };
        SprintGoal.prototype.getSettings = function (iterationId) {
            console.log('getSettings');
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                Q.when(dataService.getValue("sprintConfig." + iterationId), function (object) {
                    $("#sprintGoalInTabLabel").prop("checked", object.sprintGoalInTabLabel);
                    $("#goal").val(object.goal);
                });
            });
        };
        return SprintGoal;
    }());
    exports.SprintGoal = SprintGoal;
});
//# sourceMappingURL=extension.js.map 
