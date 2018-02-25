import moment = require("moment-timezone");
import TFS_Core_Contracts = require("TFS/Core/Contracts");
import Work_Contracts = require("TFS/Work/Contracts");
import Work_Client = require("TFS/Work/RestClient");
import System_Contracts = require("VSS/Common/Contracts/System");
import Service = require("VSS/Service");
import WebApi_Constants = require("VSS/WebApi/Constants");
import { WidgetSettings } from "TFS/Dashboards/WidgetContracts";
import Extension_Data = require("VSS/SDK/Services/ExtensionData");
import { SprintGoalWidgetSettings } from "./settings";

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
        let settings: SprintGoalWidgetSettings = JSON.parse(widgetSettings.customSettings.data);
        if (!settings) settings = SprintGoalWidgetSettings.DefaultSettings;

        return workClient.getTeamIterations(teamContext).then((i) => {
            if (i.length == 0)
                return this.display(widgetSettings.name, "No sprint goal yet!", widgetSettings.size.columnSpan, settings)

            workClient.getTeamIterations(teamContext, "current").then((teamIterations) => {
                var iterationId = teamIterations[0].id;
                var configIdentifier = iterationId;
                var configIdentifierWithTeam = iterationId + teamId;

                return this.fetchSettingsFromExtensionDataService(configIdentifierWithTeam).then((teamGoal: SprintGoalDto) => {
                    var title = (widgetSettings.size.columnSpan == 1) ? widgetSettings.name : widgetSettings.name + " - " + teamIterations[0].name;

                    if (teamGoal) {
                        return this.display(title, teamGoal.goal, widgetSettings.size.columnSpan, settings)
                    }
                    else {
                        // fallback, also for backward compatibility: project/iteration level settings
                        this.fetchSettingsFromExtensionDataService(configIdentifier).then((iterationGoal) => {
                            if (iterationGoal) {
                                return this.display(title, iterationGoal.goal, widgetSettings.size.columnSpan, settings)
                            }
                            else {
                                return this.display(title, "No sprint goal yet", widgetSettings.size.columnSpan, settings)
                            }
                        });
                    }
                });
            });
        });

    }

    private display = (title: string, text: string, columns:number, settings: SprintGoalWidgetSettings) => {
        var isLight = true;

        $("#widgetcontainer").css("background-color", settings.BackgroundColor);
        $("#sprint-goal").css("color", settings.ForegroundColor);
        $("#sprint-goal").css("font-size", settings.Fontsize + "pt");
        isLight = tinycolor(settings.BackgroundColor).isLight();

        $(".widget").css("background-image", this.getFlagFilename(columns, isLight));

        $("#widgetcontainer h2").css("color", (isLight) ? "black" : "white");
        $("#widgetcontainer h2").text(title);

        return this.WidgetHelpers.WidgetStatusHelper.Success();
    }

    private fetchSettingsFromExtensionDataService = (key: string): IPromise<SprintGoalDto> => {
        return VSS.getService(VSS.ServiceIds.ExtensionData)
            .then((dataService: Extension_Data.ExtensionDataService) => {
                return dataService.getValue("sprintConfig." + key);
            });
    }

    private getFlagFilename = (cols: number, isLight: boolean) => {
        var file = "";
        if (cols == 1)
            file = (isLight) ? "flag-black.png" : "flag-white.png";
        else
            file = (isLight) ? "flag-black-big.png" : "flag-white-big.png";

        return "url('../images/dist/" + file + "')";
    }
}
export class SprintGoalDto {
    public goal: string;
    public sprintGoalInTabLabel: boolean;
}