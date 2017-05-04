import Extension_Data = require("VSS/SDK/Services/ExtensionData");
import Q = require("q");
import VSS_Service = require("VSS/Service");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");

export class SprintGoal {
    constructor() {
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
            this.saveSettings(); 
        });

        this.getSettings(); 

    }
    public getTabTitle(tabContext) {
        if (tabContext && tabContext.iterationId) {
            return "Goal " + tabContext.iterationId.substr(0, 5) + "";
        } else {
            tabContext
            return "Goal";
        }
    }
    public saveSettings() {
        const sprintGoalInTabLabel = ;
         const sprintConfig = {
            val1: $("#sprintGoalInTabLabel").prop("checked"),
            val2: $("#goal").val()
        };
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: Extension_Data.ExtensionDataService) => {
            dataService.setValue("booleanValue", boolValue, { scopeType: scope }).then((value: boolean) => {
            });
            dataService.setValue("numberValue", numValue, { scopeType: scope }).then((value: number) => {
            });
            dataService.setValue("objectValue", objValue, { scopeType: scope }).then((value: any) => {
            });
        });
    }
    public getSettings(scope: string, selector: string) {
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: Extension_Data.ExtensionDataService) => {
            const boolPromise = dataService.getValue("booleanValue", { scopeType: scope });
            const numPromise = dataService.getValue("numberValue", { scopeType: scope });
            const objPromise = dataService.getValue("objectValue", { scopeType: scope });
            Q.all([boolPromise, numPromise, objPromise]).spread((boolValue: boolean, numValue: number, objValue: any) => {
                $(selector + " .booleanValue").prop("checked", boolValue);
                $(selector + " .numberValue").val(numValue ? numValue.toString() : "");
                $(selector + " .objectValue1").val(objValue ? objValue.val1 : "");
                $(selector + " .objectValue2").val(objValue ? objValue.val2 : "");
            });
        });
    }
}

//# sourceMappingURL=extension.js.map