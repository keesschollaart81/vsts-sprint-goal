import Extension_Data = require("VSS/SDK/Services/ExtensionData");
import Q = require("q");
import VSS_Service = require("VSS/Service");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");
import Controls = require("VSS/Controls");
import Menus = require("VSS/Controls/Menus");
import StatusIndicator = require("VSS/Controls/StatusIndicator");

export class SprintGoal {
    private iterationId: number;
    private waitControl: StatusIndicator.WaitControl;

    constructor() {
        console.log('constructor');
        var waitControlOptions: StatusIndicator.IWaitControlOptions = {
            target: $("#sprint-goal"),
            cancellable: false,
            backgroundColor: "#ffffff"
        };
        this.waitControl = Controls.create(StatusIndicator.WaitControl, $("#sprint-goal"), waitControlOptions);
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

        var menuItems: Menus.IMenuItemSpec[] = [
            { id: "save", text: "Save", icon: "icon-save" }
        ];
        var menubarOptions: Menus.MenuOwnerOptions = {
            items: menuItems,
            executeAction: (args) => {
                var command = args.get_commandName();
                switch (command) {
                    case "save":
                        this.saveSettings();
                        break;
                    default:
                        alert("Unhandled action: " + command);
                        break;
                }
            }
        };

        var menubar = Controls.create(Menus.MenuBar, $(".toolbar"), menubarOptions);
    }

    public getTabTitle = (tabContext) => {
        console.log('getTabTitle');
        if (tabContext && tabContext.iterationId) {
            this.iterationId = tabContext.iterationId;

            var goalText = this.getCookie(this.iterationId + "goalText");
            var sprintGoalInTabLabel = this.getCookie(this.iterationId + "sprintGoalInTabLabel");
            if (sprintGoalInTabLabel == "true" && goalText != null) return "Goal: " + goalText.substr(0, 60) + "";
            else return "Goal";
        } else {
            tabContext
            return "Goal";
        }
    }

    public saveSettings = () => {
        console.log('saveSettings');
        this.waitControl.startWait();
        const sprintConfig = {
            sprintGoalInTabLabel: $("#sprintGoalInTabLabel").prop("checked"),
            goal: $("#goal").val()
        };
        this.setCookie(this.iterationId + "goalText", sprintConfig.goal);
        this.setCookie(this.iterationId + "sprintGoalInTabLabel", sprintConfig.sprintGoalInTabLabel);
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: Extension_Data.ExtensionDataService) => {
            dataService.setValue("sprintConfig." + this.iterationId, sprintConfig).then((value: object) => {
                this.waitControl.endWait();
            });
        });
    }
    public getSettings = () => {
        console.log('getSettings');
        this.waitControl.startWait();
        VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: Extension_Data.ExtensionDataService) => {
            Q.when(dataService.getValue("sprintConfig." + this.iterationId), (object: any) => {
                if (object) {
                    $("#sprintGoalInTabLabel").prop("checked", object.sprintGoalInTabLabel);
                    $("#goal").val(object.goal)
                    this.setCookie(this.iterationId + "goalText", object.goal);
                    this.setCookie(this.iterationId + "sprintGoalInTabLabel", object.sprintGoalInTabLabel);
                }
                this.waitControl.endWait();
            });
        });
    }

    public setCookie(key, value) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }

    public getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }
}

//# sourceMappingURL=extension.js.map