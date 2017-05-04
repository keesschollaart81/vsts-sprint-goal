define(["require", "exports", "q"], function (require, exports, Q) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SprintGoal = (function () {
        function SprintGoal() {
            var _this = this;
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
                _this.saveSettings("User", ".user");
                _this.saveSettings("Default", ".default");
            });
            this.getSettings("User", ".user");
            this.getSettings("Default", ".default");
        }
        SprintGoal.prototype.getTabTitle = function (tabContext) {
            if (tabContext && tabContext.iterationId) {
                return "Goal " + tabContext.iterationId.substr(0, 5) + "";
            }
            else {
                tabContext;
                return "Goal";
            }
        };
        SprintGoal.prototype.saveSettings = function (scope, selector) {
            var boolValue = $(selector + " .booleanValue").prop("checked");
            var numValue = parseInt($(selector + " .numberValue").val());
            var objValue = {
                val1: $(selector + " .objectValue1").val(),
                val2: $(selector + " .objectValue2").val()
            };
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                dataService.setValue("booleanValue", boolValue, { scopeType: scope }).then(function (value) {
                });
                dataService.setValue("numberValue", numValue, { scopeType: scope }).then(function (value) {
                });
                dataService.setValue("objectValue", objValue, { scopeType: scope }).then(function (value) {
                });
            });
        };
        SprintGoal.prototype.getSettings = function (scope, selector) {
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                var boolPromise = dataService.getValue("booleanValue", { scopeType: scope });
                var numPromise = dataService.getValue("numberValue", { scopeType: scope });
                var objPromise = dataService.getValue("objectValue", { scopeType: scope });
                Q.all([boolPromise, numPromise, objPromise]).spread(function (boolValue, numValue, objValue) {
                    $(selector + " .booleanValue").prop("checked", boolValue);
                    $(selector + " .numberValue").val(numValue ? numValue.toString() : "");
                    $(selector + " .objectValue1").val(objValue ? objValue.val1 : "");
                    $(selector + " .objectValue2").val(objValue ? objValue.val2 : "");
                });
            });
        };
        return SprintGoal;
    }());
    exports.SprintGoal = SprintGoal;
});
//# sourceMappingURL=extension.js.map 
