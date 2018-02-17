import moment = require("moment-timezone");
import TFS_Core_Contracts = require("TFS/Core/Contracts");
import Work_Contracts = require("TFS/Work/Contracts");
import Work_Client = require("TFS/Work/RestClient");
import System_Contracts = require("VSS/Common/Contracts/System");
import Service = require("VSS/Service");
import WebApi_Constants = require("VSS/WebApi/Constants");
import { WidgetSettings } from "TFS/Dashboards/WidgetContracts";
import Extension_Data = require("VSS/SDK/Services/ExtensionData");

VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
    VSS.register("SprintGoalWidget.Configuration", function () {
        return new SprintGoalWidgetConfiguration(WidgetHelpers);
    });
    VSS.notifyLoadSucceeded();
});


export class SprintGoalWidgetConfiguration {
    constructor(
        public WidgetHelpers) { }

    public load(widgetSettings: WidgetSettings) {
        var settings = JSON.parse(widgetSettings.customSettings.data);
        if (settings && settings.foregroundColor) {
             $("#foreground-color-input").val(settings.foregroundColor);

             return this.WidgetHelpers.WidgetStatusHelper.Success();
         }
    }

    public onSave() { 
        var customSettings = {
            data: JSON.stringify({
                foregroundColor: $("#foreground-color-input").val()
                })
        };
        return this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings); 

    }
 
} 