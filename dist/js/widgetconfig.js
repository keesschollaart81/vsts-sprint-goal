define(["require", "exports", "./settings", "./SprintGoalApplicationInsightsWrapper", "jscolor-picker"], function (require, exports, settings_1, SprintGoalApplicationInsightsWrapper_1, jscolor) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetConfigurationStyles();
        VSS.register("SprintGoalWidget.Configuration", function () {
            return new SprintGoalWidgetConfiguration(WidgetHelpers, new SprintGoalApplicationInsightsWrapper_1.SprintGoalApplicationInsightsWrapper());
        });
        VSS.notifyLoadSucceeded();
    });
    var SprintGoalWidgetConfiguration = /** @class */ (function () {
        function SprintGoalWidgetConfiguration(WidgetHelpers, ai) {
            var _this = this;
            this.WidgetHelpers = WidgetHelpers;
            this.ai = ai;
            this.onSave = function () {
                var customSettings = _this.getCustomSettings();
                try {
                    _this.ai.trackEvent("Save widget settings", {
                        foregroundColor: $("#foreground-color-input").val(),
                        backgroundColor: $("#background-color-input").val(),
                        fontSize: $("#font-size-input").val(),
                        cols: _this.widgetSettings.size.columnSpan.toString(),
                        rows: _this.widgetSettings.size.columnSpan.toString(),
                        title: _this.widgetSettings.name
                    });
                }
                catch (e) {
                    //swallow
                }
                return _this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
            };
            this.setDefaultColors = function (settings) {
                var defaultSettings = settings_1.SprintGoalWidgetSettings.DefaultSettings;
                if (!settings)
                    settings = defaultSettings;
                if (!settings.foregroundColor)
                    settings.foregroundColor = defaultSettings.foregroundColor;
                if (!settings.backgroundColor)
                    settings.backgroundColor = defaultSettings.backgroundColor;
                if (!settings.fontsize)
                    settings.fontsize = defaultSettings.fontsize;
                return settings;
            };
            this.notifyChange = function (widgetConfigurationContext) {
                widgetConfigurationContext.notify(_this.WidgetHelpers.WidgetEvent.ConfigurationChange, _this.WidgetHelpers.WidgetEvent.Args(_this.getCustomSettings()));
            };
            this.getCustomSettings = function () {
                var fontSize = parseInt($("#font-size-input").val());
                var customSettings = {
                    data: JSON.stringify(new settings_1.SprintGoalWidgetSettings($("#foreground-color-input").val(), $("#background-color-input").val(), fontSize))
                };
                return customSettings;
            };
            this.validateNameTextInput = function ($nameInput, $errorSingleLineInput) {
                if ($nameInput.val() == "") {
                    $errorSingleLineInput.text("Please enter a value");
                    $errorSingleLineInput.css("visibility", "visible");
                    return;
                }
                $errorSingleLineInput.css("visibility", "hidden");
                return true;
            };
        }
        SprintGoalWidgetConfiguration.prototype.load = function (widgetSettings, widgetConfigurationContext) {
            var _this = this;
            try {
                this.widgetSettings = widgetSettings;
                var settings = JSON.parse(widgetSettings.customSettings.data);
                settings = this.setDefaultColors(settings);
                $("#foreground-color-input").val(settings.foregroundColor);
                $("#background-color-input").val(settings.backgroundColor);
                $("#font-size-input").val(settings.fontsize);
                $("#foreground-color-input").on("change paste keyup", function () {
                    if (_this.validateNameTextInput($("#foreground-color-input"), $(".foreground-color-input-validation"))) {
                        _this.notifyChange(widgetConfigurationContext);
                    }
                });
                $("#background-color-input").on("change paste keyup", function () {
                    if (_this.validateNameTextInput($("#background-color-input"), $(".background-color-input-validation"))) {
                        _this.notifyChange(widgetConfigurationContext);
                    }
                });
                $("#font-size-input").on("change paste keyup", function () {
                    if (_this.validateNameTextInput($("#font-size-input"), $(".font-size-input-validation"))) {
                        _this.notifyChange(widgetConfigurationContext);
                    }
                });
                jscolor.installByClassName("jscolor");
                return this.WidgetHelpers.WidgetStatusHelper.Success();
            }
            catch (e) {
                this.ai.trackException(e);
            }
        };
        return SprintGoalWidgetConfiguration;
    }());
    exports.SprintGoalWidgetConfiguration = SprintGoalWidgetConfiguration;
});
