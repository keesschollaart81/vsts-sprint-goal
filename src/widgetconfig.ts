import jscolor = require("jscolor-picker/jscolor");
import moment = require("moment-timezone");
import TFS_Core_Contracts = require("TFS/Core/Contracts");
import Work_Contracts = require("TFS/Work/Contracts");
import Work_Client = require("TFS/Work/RestClient");
import System_Contracts = require("VSS/Common/Contracts/System");
import Service = require("VSS/Service");
import WebApi_Constants = require("VSS/WebApi/Constants");
import { WidgetSettings, IWidgetConfigurationContext, IWidgetConfiguration } from "TFS/Dashboards/WidgetContracts";
import Extension_Data = require("VSS/SDK/Services/ExtensionData");
import { SprintGoalWidgetSettings } from "./settings";
// import   ais = require("./SprintGoalApplicationInsightsWrapper");
import { SprintGoalApplicationInsightsWrapper } from "./SprintGoalApplicationInsightsWrapper";

VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
    WidgetHelpers.IncludeWidgetConfigurationStyles();

    VSS.register("SprintGoalWidget.Configuration", function () {
        return new SprintGoalWidgetConfiguration(WidgetHelpers, new SprintGoalApplicationInsightsWrapper());
    });
    VSS.notifyLoadSucceeded();
});


export class SprintGoalWidgetConfiguration implements IWidgetConfiguration {

    widgetSettings: WidgetSettings;
    constructor(public WidgetHelpers, private ai: SprintGoalApplicationInsightsWrapper) { }

    public load(widgetSettings: WidgetSettings, widgetConfigurationContext: IWidgetConfigurationContext) {
        try {
            this.widgetSettings = widgetSettings;
            var settings = JSON.parse(widgetSettings.customSettings.data) as SprintGoalWidgetSettings;
            settings = this.setDefaultColors(settings);

            $("#foreground-color-input").val(settings.foregroundColor);
            $("#background-color-input").val(settings.backgroundColor);
            $("#font-size-input").val(settings.fontsize);

            $("#foreground-color-input").on("change paste keyup", () => {
                if (this.validateNameTextInput($("#foreground-color-input"), $(".foreground-color-input-validation"))) {
                    this.notifyChange(widgetConfigurationContext);
                }
            });
            $("#background-color-input").on("change paste keyup", () => {
                if (this.validateNameTextInput($("#background-color-input"), $(".background-color-input-validation"))) {
                    this.notifyChange(widgetConfigurationContext);
                }
            });
            $("#font-size-input").on("change paste keyup", () => {
                if (this.validateNameTextInput($("#font-size-input"), $(".font-size-input-validation"))) {
                    this.notifyChange(widgetConfigurationContext);
                }
            });

            return this.WidgetHelpers.WidgetStatusHelper.Success();
        }
        catch (e) {
            this.ai.trackException(e);
        }
    }

    public onSave = () => {
        var customSettings = this.getCustomSettings();
        try {
            this.ai.trackEvent("Save widget settings", {
                foregroundColor: $("#foreground-color-input").val(),
                backgroundColor: $("#background-color-input").val(),
                fontSize: $("#font-size-input").val(),
                cols: this.widgetSettings.size.columnSpan.toString(),
                rows: this.widgetSettings.size.columnSpan.toString(),
                title: this.widgetSettings.name
            });
        }
        catch (e) {
            //swallow
        }
        return this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
    }

    private setDefaultColors = (settings: SprintGoalWidgetSettings) => {
        var defaultSettings = SprintGoalWidgetSettings.DefaultSettings;
        if (!settings)
            settings = defaultSettings

        if (!settings.foregroundColor) settings.foregroundColor = defaultSettings.foregroundColor;
        if (!settings.backgroundColor) settings.backgroundColor = defaultSettings.backgroundColor;
        if (!settings.fontsize) settings.fontsize = defaultSettings.fontsize;

        return settings;
    }

    private notifyChange = (widgetConfigurationContext: IWidgetConfigurationContext) => {
        widgetConfigurationContext.notify(this.WidgetHelpers.WidgetEvent.ConfigurationChange, this.WidgetHelpers.WidgetEvent.Args(this.getCustomSettings()));
    }

    private getCustomSettings = () => {
        var fontSize = parseInt($("#font-size-input").val());

        var customSettings = {
            data: JSON.stringify(new SprintGoalWidgetSettings($("#foreground-color-input").val(), $("#background-color-input").val(), fontSize))
        };
        return customSettings;
    }


    private validateNameTextInput = ($nameInput, $errorSingleLineInput) => {
        if ($nameInput.val() == "") {
            $errorSingleLineInput.text("Please enter a value");
            $errorSingleLineInput.css("visibility", "visible");
            return;
        }
        $errorSingleLineInput.css("visibility", "hidden");
        return true;
    }
} 