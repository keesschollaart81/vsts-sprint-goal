import Extension_Data = require("VSS/SDK/Services/ExtensionData");
import Q = require("q");
import VSS_Service = require("VSS/Service");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");

export class SprintGoal {
    private iterationId: number;

    constructor() {
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

        $('.saveButton').on('click', (eventObject) => {
            this.saveSettings(this.iterationId);
        });

        this.getSettings(this.iterationId);

    }
    public getTabTitle(tabContext) {
        console.log('getTabTitle');
        if (tabContext && tabContext.iterationId) {
            return "Goal " + tabContext.iterationId.substr(0, 5) + "";
        } else {
            tabContext
            return "Goal";
        }
    }
    public saveSettings(iterationId: number) {
        console.log('saveSettings');
        const sprintConfig = {
            sprintGoalInTabLabel: $("#sprintGoalInTabLabel").prop("checked"),
            goal: $("#goal").val()
        };
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: Extension_Data.ExtensionDataService) => {
            dataService.setValue("sprintConfig." + iterationId, sprintConfig).then((value: object) => {
            });
        });
    }
    public getSettings(iterationId: number) {
        console.log('getSettings');
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: Extension_Data.ExtensionDataService) => {
            Q.when(dataService.getValue("sprintConfig." + iterationId), (object: any) => {
                $("#sprintGoalInTabLabel").prop("checked", object.sprintGoalInTabLabel);
                    $("#goal").val(object.goal)
            });
        });
    }
}

//# sourceMappingURL=extension.js.map