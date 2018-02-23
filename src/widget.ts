import moment = require("moment-timezone");
import TFS_Core_Contracts = require("TFS/Core/Contracts");
import Work_Contracts = require("TFS/Work/Contracts");
import Work_Client = require("TFS/Work/RestClient");
import System_Contracts = require("VSS/Common/Contracts/System");
import Service = require("VSS/Service");
import WebApi_Constants = require("VSS/WebApi/Constants");
import { WidgetSettings } from "TFS/Dashboards/WidgetContracts";
import Extension_Data = require("VSS/SDK/Services/ExtensionData");  

declare var tinycolor: any;

VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
    WidgetHelpers.IncludeWidgetStyles();

    VSS.register("SprintGoalWidget", function () {
        return new SprintGoalWidget(WidgetHelpers);
    });
    VSS.notifyLoadSucceeded();
});


export class SprintGoalWidget {
    constructor(
        public WidgetHelpers) { }

    public load(widgetSettings: WidgetSettings) {
        return this.loadSprintGoal(widgetSettings);
    }

    public reload(widgetSettings: WidgetSettings) {
        return this.loadSprintGoal(widgetSettings);
    }


    public loadSprintGoal(widgetSettings: WidgetSettings) {
        const workClient: Work_Client.WorkHttpClient = Service.VssConnection
            .getConnection()
            .getHttpClient(Work_Client.WorkHttpClient, WebApi_Constants.ServiceInstanceTypes.TFS);

        var webContext = VSS.getWebContext();
        var projectId = webContext.project.id;
        var teamId = webContext.team.id;

        const teamContext: TFS_Core_Contracts.TeamContext = {
            project: "",
            projectId: webContext.project.id,
            team: "",
            teamId: webContext.team.id,
        };
        var settings = JSON.parse(widgetSettings.customSettings.data);

        var isLight = true;

        if (settings) {
            $("#sprint-goal").css("color", settings.foregroundColor);
            $("#sprint-goal").css("background-color", settings.backgroundColor);
            $("#sprint-goal").css("font-size", settings.fontSize + "pt");
            isLight = tinycolor(settings.backgroundColor).isLight();
        }
        var bgImage =  (isLight) ? "../images/dist/flag-black.png" : "../images/dist/flag-white.png";
        console.log(bgImage);

        workClient.getTeamIterations(teamContext, "current").then((teamIterations) => {
            var iterationId = teamIterations[0].id;
            var configIdentifier = iterationId;
            var configIdentifierWithTeam = iterationId + teamId;

            this.fetchSettingsFromExtensionDataService(configIdentifierWithTeam).then((teamGoal: SprintGoalDto) => {
                if (teamGoal) {
                    $('#sprint-goal').html(teamGoal.goal);
                }
                else {
                    // fallback, also for backward compatibility: project/iteration level settings
                    this.fetchSettingsFromExtensionDataService(configIdentifier).then((iterationGoal) => {
                        if (iterationGoal) {
                            $('#sprint-goal').html(iterationGoal.goal);
                        }
                        else {
                            $('#sprint-goal').html("No sprint goal yet, <a href=''>set one</a>!");
                        }
                    });
                }
            });
        });
        return this.WidgetHelpers.WidgetStatusHelper.Success();
    } 

    private fetchSettingsFromExtensionDataService = (key: string): IPromise<SprintGoalDto> => {
        return VSS.getService(VSS.ServiceIds.ExtensionData)
            .then((dataService: Extension_Data.ExtensionDataService) => {
                return dataService.getValue("sprintConfig." + key);
            });
    }
}
export class SprintGoalDto {
    public goal: string;
    public sprintGoalInTabLabel: boolean;
}