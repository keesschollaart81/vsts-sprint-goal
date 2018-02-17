import moment = require("moment-timezone");
import TFS_Core_Contracts = require("TFS/Core/Contracts");
import Work_Contracts = require("TFS/Work/Contracts");
import Work_Client = require("TFS/Work/RestClient");
import System_Contracts = require("VSS/Common/Contracts/System");
import Service = require("VSS/Service");
import WebApi_Constants = require("VSS/WebApi/Constants");
import { WidgetSettings } from "TFS/Dashboards/WidgetContracts";

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
        return this.kees();
    }

    public reload(widgetSettings: WidgetSettings) {
        this.kees();
    }


    public kees() {
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

        return workClient.getTeamIterations(teamContext).then((iterations) => {
            $('h2.projectid').text(projectId);
            $('h2.teamid').text(teamId);
            $('h2.iterationid').text("loading...");
            if (iterations.length > 0) {
                return workClient.getTeamIterations(teamContext, "current").then((teamIterations) => {
                    var iterationId = teamIterations[0].id;
                    $('h2.iterationid').text(iterationId);
                });
            } else {
                $('h2.iterationid').text("none");
            }
            return this.WidgetHelpers.WidgetStatusHelper.Success();
        });
    }
}