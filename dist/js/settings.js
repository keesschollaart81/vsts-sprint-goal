define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SprintGoalWidgetSettings = /** @class */ (function () {
        function SprintGoalWidgetSettings(foregroundColor, backgroundColor, fontSize) {
            this.backgroundColor = backgroundColor;
            this.fontsize = fontSize;
            this.foregroundColor = foregroundColor;
        }
        SprintGoalWidgetSettings.DefaultSettings = new SprintGoalWidgetSettings("FFFFFF", "191EBF", 13);
        return SprintGoalWidgetSettings;
    }());
    exports.SprintGoalWidgetSettings = SprintGoalWidgetSettings;
});
