import Extension_Data = require("VSS/SDK/Services/ExtensionData");
import Q = require("q");
import VSS_Service = require("VSS/Service");
import TFS_Build_Contracts = require("TFS/Build/Contracts");
import TFS_Build_Extension_Contracts = require("TFS/Build/ExtensionContracts");
import Controls = require("VSS/Controls");
import Menus = require("VSS/Controls/Menus");
import StatusIndicator = require("VSS/Controls/StatusIndicator");

export class SprintGoalDto {
    public goal: string;
    public sprintGoalInTabLabel: boolean;
}

export class SprintGoal {
    private iterationId: number;
    private teamId: string;
    private storageUri: string;
    private waitControl: StatusIndicator.WaitControl;

    constructor() {
        var context = VSS.getExtensionContext();
        this.storageUri = this.getLocation(context.baseUri).hostname;
        this.teamId = VSS.getWebContext().team.id;

        var config = VSS.getConfiguration();
        this.log('constructor, foregroundInstance = ' + config.foregroundInstance);

        if (config.foregroundInstance) { // else: config.host.background == true

            // this code runs when the form is loaded, otherwise, just load the tab

            this.iterationId = config.iterationId;
            this.buildWaitControl();
            this.getSettings(true).then((settings) => this.fillForm(settings));
            this.buildMenuBar();
        }

        // register this 'Sprint Goal' service
        VSS.register(VSS.getContribution().id, {
            pageTitle: this.getTabTitle,
            name: this.getTabTitle,
            isInvisible: function (state) {
                return false;
            }
        });
    }

    private buildWaitControl = () => {
        var waitControlOptions: StatusIndicator.IWaitControlOptions = {
            target: $("#sprint-goal"),
            cancellable: false,
            backgroundColor: "#ffffff",
            message: "Processing your Sprint Goal..",
            showDelay: 0
        };
        this.waitControl = Controls.create(StatusIndicator.WaitControl, $("#sprint-goal"), waitControlOptions);
    }

    private getLocation = (href: string): HTMLAnchorElement => {
        var l = document.createElement("a");
        l.href = href;
        return l;
    }

    private buildMenuBar = () => {
        var menuItems: Menus.IMenuItemSpec[] = [
            { id: "save", text: "Save", icon: "icon-save" }
        ];
        var menubarOptions: Menus.MenuOwnerOptions = {
            items: menuItems,
            executeAction: (args) => {
                var command = args.get_commandName();
                switch (command) {
                    case "save":
                        this.saveSettings().then(() => {
                            VSS.getService(VSS.ServiceIds.Navigation).then((navigationService: IHostNavigationService) => {
                                navigationService.reload();
                            });
                        });
                        break;
                    default:
                        alert("Unhandled action: " + command);
                        break;
                }
            }
        };

        var menubar = Controls.create(Menus.MenuBar, $(".toolbar"), menubarOptions);
    }

    public getTabTitle = (tabContext): string => {
        this.log('getTabTitle');
        if (!tabContext || !tabContext.iterationId) {
            this.log("getTabTitle: tabContext or tabContext.iterationId empty");
            return "Goal";
        }

        this.iterationId = tabContext.iterationId;
        var sprintGoalCookie = this.getSprintGoalFromCookie();

        if (!sprintGoalCookie) {
            this.log("getTabTitle: Sprint goal net yet loaded in cookie, cannot (synchrone) fetch this from storage in 'getTabTitle()' context, call is made anyway")
            // todo: this call will not return sync. And/but we cannot wait here for the result
            // because this code run every time the tab is visible (board, capacity, etc.) and we do not want to be blocking and slow down those pages
            // this way, we at least fetch the values from the server (in the 'background') and persist them in a cookie for the next page view

            var promise = this.getSettings(true)
                .then((settings) => {
                    // if (settings.sprintGoalInTabLabel && settings.goal != null) {
                    //     return "Goal: " + settings.goal.substr(0, 60);
                    // }
                });
            return "Goal";
        }

        if (sprintGoalCookie && sprintGoalCookie.sprintGoalInTabLabel && sprintGoalCookie.goal != null) {
            this.log("getTabTitle: loaded title from cookie");
            return "Goal: " + sprintGoalCookie.goal.substr(0, 60);
        }
        else {
            this.log("getTabTitle: Cookie found but empty goal");
            return "Goal";
        }
    }

    public getSprintGoalFromCookie = (): SprintGoalDto => {
        var goal = this.getCookie(this.iterationId + this.teamId + "goalText");
        var sprintGoalInTabLabel = false;
        if (!goal) {
            //for backwards compatibility (older release were saved without team identifier)
            goal = this.getCookie(this.iterationId + "goalText");
            sprintGoalInTabLabel = (this.getCookie(this.iterationId + "sprintGoalInTabLabel") == "true");
        }
        else {
            sprintGoalInTabLabel = (this.getCookie(this.iterationId + this.teamId + "sprintGoalInTabLabel") == "true");
        }

        if (!goal) return undefined;

        return {
            goal: goal,
            sprintGoalInTabLabel: sprintGoalInTabLabel
        };
    }

    public saveSettings = (): IPromise<any> => {
        this.log('saveSettings');
        if (this.waitControl) this.waitControl.startWait();
        const sprintConfig = {
            sprintGoalInTabLabel: $("#sprintGoalInTabLabel").prop("checked"),
            goal: $("#goal").val()
        };

        var configIdentifier: string = this.iterationId.toString() + this.teamId;

        this.setCookie(configIdentifier + "goalText", sprintConfig.goal);
        this.setCookie(configIdentifier + "sprintGoalInTabLabel", sprintConfig.sprintGoalInTabLabel);

        return VSS.getService(VSS.ServiceIds.ExtensionData)
            .then((dataService: Extension_Data.ExtensionDataService) => {
                this.log('saveSettings: ExtensionData Service Loaded');
                return dataService.setValue("sprintConfig." + configIdentifier, sprintConfig);;
            })
            .then((value: object) => {
                this.log('saveSettings: settings saved!');
                if (this.waitControl) this.waitControl.endWait();
            });
    }

    public getSettings = (forceReload: boolean): IPromise<SprintGoalDto> => {
        this.log('getSettings');
        if (this.waitControl) this.waitControl.startWait();
        var currentGoalInCookie = this.getSprintGoalFromCookie();

        var cookieSupport = this.checkCookie();

        if (forceReload || !currentGoalInCookie || !cookieSupport) {
            return this.fetchSettingsFromExtensionDataService(this.iterationId.toString() + this.teamId).then((teamSettings: SprintGoalDto): IPromise<SprintGoalDto> => {
                if (teamSettings) {
                    return Q.fcall((): SprintGoalDto => {
                        // team settings
                        return teamSettings;
                    });
                }
                else {
                    // project settings
                    return this.fetchSettingsFromExtensionDataService(this.iterationId.toString());
                }
            });
        }
        else {
            return Q.fcall((): SprintGoalDto => {
                this.log('getSettings: fetched settings from cookie');
                return currentGoalInCookie;
            });

        }
    }
    private fetchSettingsFromExtensionDataService = (key: string): IPromise<SprintGoalDto> => {
        return VSS.getService(VSS.ServiceIds.ExtensionData)
            .then((dataService: Extension_Data.ExtensionDataService) => {
                this.log('getSettings: ExtensionData Service Loaded, get value by key: '+ key);
                return dataService.getValue("sprintConfig." + key);
            })
            .then((sprintGoalDto: SprintGoalDto): SprintGoalDto => {
                this.log('getSettings: ExtensionData Service fetched data', sprintGoalDto);
                if (sprintGoalDto) {
                    this.setCookie(key + "goalText", sprintGoalDto.goal);
                    this.setCookie(key + "sprintGoalInTabLabel", sprintGoalDto.sprintGoalInTabLabel);
                }
                if (this.waitControl) this.waitControl.endWait();
                return sprintGoalDto;
            });
    }

    public fillForm = (sprintGoal: SprintGoalDto) => {
        if (!this.checkCookie()) {
            $("#cookieWarning").show();
        }
        if (!sprintGoal) {
            $("#sprintGoalInTabLabel").prop("checked", false);
            $("#goal").val("")
        }
        else {
            $("#sprintGoalInTabLabel").prop("checked", sprintGoal.sprintGoalInTabLabel);
            $("#goal").val(sprintGoal.goal)

        }
    }

    public setCookie = (key, value) => {
        var expires = new Date();
        expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';domain=' + this.storageUri + ';path=/';
    }

    public getCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

    public checkCookie = (): boolean => {
        this.setCookie("testcookie", true);
        var success = (this.getCookie("testcookie") == "true");
        return success;
    }
    private log = (message: string, object: any = null) => {
        if (!window.console) return;

        if (object) {
            console.log(message, object);
            return;
        }
        console.log(message)
    }
}

//# sourceMappingURL=extension.js.map