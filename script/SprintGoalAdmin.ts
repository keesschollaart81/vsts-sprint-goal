import { ExtensionDataService } from "VSS/SDK/Services/ExtensionData";
import * as VSS_Service from "VSS/Service";
import * as Tfs_Core_WebApi from "TFS/Core/RestClient";
import * as Tfs_Work_WebApi from "TFS/Work/RestClient";
import { TcmHttpClient } from "TFS/TestManagement/VSS.Tcm.WebApi";

import * as contract from "TFS/Core/Contracts"
import { Helpers } from "./helpers";
import { SprintGoalDto } from "./sprint-goal";
import { ExportEntry } from "./ExportEntry";

export class SprintGoalAdmin {


    private form: HTMLFormElement = <HTMLFormElement>document.getElementById('payment-form');
    private telemetryCheckbox = <HTMLInputElement>document.getElementById("telemetryCheckbox");
    private exportButton = <HTMLButtonElement>document.getElementById("exportButton");
    private helpers: Helpers;


    constructor() {
        this.helpers = new Helpers();
    }

    public load = async (): Promise<void> => {
        this.telemetryCheckbox.checked = await this.getTelemetryOptOut();
        this.telemetryCheckbox.onchange = (e) => this.setTelemetryOptOut(this.telemetryCheckbox.checked);
        this.form.addEventListener('submit', this.onFormSubmit);
        this.exportButton.onclick = (e) => this.exportButtonClick();
    }

    private onFormSubmit = async (event): Promise<void> => {
        event.preventDefault();
    }

    private getTelemetryOptOut = async (): Promise<boolean> => {
        var dataService = <ExtensionDataService>await VSS.getService(VSS.ServiceIds.ExtensionData);
        var telemetryOptOut = false;
        try {
            telemetryOptOut = await dataService.getValue<boolean>("telemetryOptOut");
        }
        catch{
            // swallow
        }
        return telemetryOptOut;
    }

    private setTelemetryOptOut = async (value: boolean): Promise<void> => {
        var dataService = <ExtensionDataService>await VSS.getService(VSS.ServiceIds.ExtensionData);
        dataService.setValue("telemetryOptOut", !value);
    }

    private exportButtonClick = async (): Promise<void> => {

        this.exportButton.disabled = true;
        this.exportButton.innerText = "Generating file export...";

        var dataService = <ExtensionDataService>await VSS.getService(VSS.ServiceIds.ExtensionData);
        var project = VSS.getWebContext().project;
        var result: ExportEntry[] = [];

        var workApi = Tfs_Work_WebApi.getClient();
        var collectionClient = VSS_Service.getCollectionClient(Tfs_Core_WebApi.CoreHttpClient4);
        var teams = await collectionClient.getTeams(project.id);

        for (var j = 0; j < teams.length; j++) {
            let team = teams[j];
            var teamContext: contract.TeamContext = {
                projectId: project.id,
                teamId: team.id,
                project: "",
                team: ""
            };

            var iterations = await workApi.getTeamIterations(teamContext);
            for (var i = 0; i < iterations.length; i++) {
                var iteration = iterations[i];
                var configKey = this.helpers.getConfigKey(iteration.id, team.id);
                try {
                    var goal = <SprintGoalDto>await dataService.getValue("sprintConfig." + configKey);
                    result.push({
                        details: goal.details,
                        detailsPlain: goal.detailsPlain,
                        goal: goal.goal,
                        goalAchieved: goal.goalAchieved,
                        sprintGoalInTabLabel: goal.sprintGoalInTabLabel,
                        iterationId: iteration.id,
                        iterationName: iteration.name,
                        teamId: team.id,
                        teamName: team.name,
                        projectId: project.id,
                        projectName: project.name
                    });
                }
                catch{
                    console.log(`No goal for team: ${team.id}, iteration: ${iteration.id}`);
                }
            }
        }

        this.download("goals.json", JSON.stringify(result));

        this.exportButton.disabled = false;
        this.exportButton.innerText = "Export";
    }

    private download = (filename, text) => {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}

VSS.ready(function () {
    VSS.require([], () => {
        var licenseAdmin = new SprintGoalAdmin();
        licenseAdmin.load().then(() => {
            VSS.register(VSS.getContribution().id, licenseAdmin);
            VSS.notifyLoadSucceeded();
        });
    });
});

