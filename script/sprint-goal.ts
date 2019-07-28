import Q = require("q");
import * as RoosterJs from 'roosterjs';
import Controls = require("VSS/Controls");
import Menus = require("VSS/Controls/Menus");
import StatusIndicator = require("VSS/Controls/StatusIndicator");
import EmojiPicker = require("vanilla-emoji-picker");
import { ExtensionDataService } from "VSS/SDK/Services/ExtensionData";
import { SprintGoalApplicationInsightsWrapper } from "./SprintGoalApplicationInsightsWrapper";
import { Helpers } from "./helpers"
import { RunningDocumentsTable } from "VSS/Events/Document";

export class SprintGoal {
    private iterationId: string;
    private teamId: string;
    private storageUri: string;
    private waitControl: StatusIndicator.WaitControl;
    private editor: RoosterJs.Editor;
    private helpers: Helpers;

    constructor(private ai: SprintGoalApplicationInsightsWrapper) {
        try {
            this.helpers = new Helpers();

            var context = VSS.getExtensionContext();
            this.storageUri = this.getLocation(context.baseUri).hostname;

            var webContext = VSS.getWebContext();
            this.log('TeamId:' + webContext.team.id);
            this.teamId = webContext.team.id;

            var config = VSS.getConfiguration();
            this.log('constructor, foregroundInstance = ' + config.foregroundInstance);

            var reloadWhenIterationChanges = false;

            if (config.foregroundInstance) { // else: config.host.background == true
                // this code runs when the form is loaded, otherwise, just load the tab

                reloadWhenIterationChanges = true;

                this.iterationId = config.iterationId;
                this.buildWaitControl();
                this.getSettings(true).then((settings) => {
                    new EmojiPicker({});
                    this.fillForm(settings);

                });

                this.buildMenuBar();

                (<HTMLAnchorElement>document.getElementById("projectadminlink")).href = this.getAdminPageUri();

                ai.trackPageView(document.title);
            }

            // register this 'Sprint Goal' service
            VSS.register(VSS.getContribution().id, <IContributedTab>{
                pageTitle: this.getTabTitle,
                uri: undefined,
                updateContext: (ctx) => this.contextUpdated(ctx, reloadWhenIterationChanges),
                name: this.getTabTitle,
                isInvisible: (state) => false
            });
        }
        catch (e) {
            if (this.ai) this.ai.trackException(e);
        }
    }

    private getAdminPageUri = (): string => {
        var webContext = VSS.getWebContext();
        var extensionId = VSS.getExtensionContext().extensionId;
        var env = ""

        if (extensionId.indexOf("-dev") >= 0) env = "-dev";
        if (extensionId.indexOf("-acc") >= 0) env = "-acc";
        var uri = webContext.host.uri + "/" + webContext.project.name + "_settings/keesschollaart.sprint-goal" + env + ".SprintGoalWidget.Admin";

        return uri;
    }

    private buildWaitControl = () => {
        var waitControlOptions: StatusIndicator.IWaitControlOptions = {
            target: $("#sprint-goal"),
            cancellable: false,
            backgroundColor: "#ffffff",
            message: "Working on your Sprint Goal..",
            showDelay: 0
        };
        this.waitControl = Controls.create(StatusIndicator.WaitControl, $("#sprint-goal"), waitControlOptions);
    }

    private contextUpdated = (ctx, reloadWhenIterationChanges: boolean) => {
        if (ctx.iterationId == this.iterationId) return;

        if (reloadWhenIterationChanges) {
            VSS.getService(VSS.ServiceIds.Navigation).then((hostNavigationService: IHostNavigationService) => {
                //hostNavigationService.setTabTitle("my sprint goal"); // if only this was available
                hostNavigationService.reload();
            });

        }
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

    public getTabTitle = async (tabContext): Promise<string> => {
        this.log('getTabTitle');
        if (!tabContext || !tabContext.iterationId) {
            this.log("getTabTitle: tabContext or tabContext.iterationId empty");
            return "Goal";
        }

        this.iterationId = tabContext.iterationId;
        var sprintGoalCookie = this.getSprintGoalFromCookie();

        if (!sprintGoalCookie) {
            this.log("getTabTitle: Sprint goal net yet loaded in cookie, getting it async...");
            try {
                var settings = await this.getSettings(true);
                return "Goal: " + settings.goal;
            }
            catch{
                return "Goal";
            }
        }

        if (sprintGoalCookie && sprintGoalCookie.sprintGoalInTabLabel && sprintGoalCookie.goal != null) {
            this.log("getTabTitle: loaded title from cookie");
            return "Goal: " + sprintGoalCookie.goal;
        }
        else {
            this.log("getTabTitle: Cookie found but empty goal");
            return "Goal";
        }
    }

    public getSprintGoalFromCookie = (): SprintGoalDto => {
        var goal = this.getCookie(this.helpers.getConfigKey(this.iterationId, this.teamId) + "goalText");

        var sprintGoalInTabLabel = false;
        if (goal) {
            sprintGoalInTabLabel = (this.getCookie(this.helpers.getConfigKey(this.iterationId, this.teamId) + "sprintGoalInTabLabel") == "true");
        }

        if (!goal) return undefined;

        return {
            goal: goal,
            sprintGoalInTabLabel: sprintGoalInTabLabel,
            // we dont persist the rest of the values in the cookie
            details: "",
            detailsPlain: "",
            goalAchieved: false
        };
    }

    public saveSettings = async (): Promise<any> => {
        this.log('saveSettings');

        if (this.waitControl) this.waitControl.startWait();

        $(".emoji-wysiwyg-editor").blur(); //ie11 hook to force WYIWYG editor to copy value to #goal input field

        const sprintConfig = <SprintGoalDto>{
            sprintGoalInTabLabel: $("#sprintGoalInTabLabelCheckbox").prop("checked"),
            goal: $("#goalInput").val(),
            details: this.editor.getContent(),
            detailsPlain: this.editor.getTextContent(),
            goalAchieved: $("#achievedCheckbox").prop("checked")
        };

        if (this.ai) {
            if (sprintConfig.goal.substr(0, 1) != "!") {
                await this.ai.trackEvent("SaveSettings", <any>sprintConfig);
            }
        }

        var configIdentifierWithTeam: string = this.helpers.getConfigKey(this.iterationId, this.teamId);

        this.updateSprintGoalCookie(configIdentifierWithTeam, sprintConfig);

        return VSS.getService(VSS.ServiceIds.ExtensionData)
            .then((dataService: ExtensionDataService) => {
                this.log('saveSettings: ExtensionData Service Loaded, saving for ' + configIdentifierWithTeam, sprintConfig);
                return dataService.setValue("sprintConfig." + configIdentifierWithTeam, sprintConfig);
            })
            .then((value: object) => {
                this.log('saveSettings: settings saved!', value);
                if (this.waitControl) this.waitControl.endWait();
            });
    }

    public getSettings = async (forceReload: boolean): Promise<SprintGoalDto> => {
        this.log('getSettings');
        if (this.waitControl) this.waitControl.startWait();
        var currentGoalInCookie = this.getSprintGoalFromCookie();

        var cookieSupport = this.checkCookie();

        if (forceReload || !currentGoalInCookie || !cookieSupport) {
            var configIdentifierWithTeam = this.helpers.getConfigKey(this.iterationId, this.teamId);

            var teamGoal = await this.fetchSettingsFromExtensionDataService(configIdentifierWithTeam);
            if (teamGoal) {
                this.updateSprintGoalCookie(configIdentifierWithTeam, teamGoal);

                return teamGoal;
            }
        }
        else {
            this.log('getSettings: fetched settings from cookie');
            return currentGoalInCookie;
        }
    }

    private fetchSettingsFromExtensionDataService = (key: string): IPromise<SprintGoalDto> => {
        return VSS.getService(VSS.ServiceIds.ExtensionData)
            .then((dataService: ExtensionDataService) => {
                this.log('getSettings: ExtensionData Service Loaded, get value by key: ' + key);

                try {
                    return dataService.getValue("sprintConfig." + key);
                }
                catch (e) {
                    return null;
                }
            })
            .then((sprintGoalDto: SprintGoalDto): SprintGoalDto => {
                this.log('getSettings: ExtensionData Service fetched data', sprintGoalDto);
                if (this.waitControl) this.waitControl.endWait();
                return sprintGoalDto;
            });
    }


    private updateSprintGoalCookie = (key: string, sprintGoal: SprintGoalDto) => {
        this.setCookie(key + "goalText", sprintGoal.goal);
        this.setCookie(key + "sprintGoalInTabLabel", sprintGoal.sprintGoalInTabLabel);
    }

    public fillForm = (sprintGoal: SprintGoalDto) => {
        if (!this.checkCookie()) {
            $("#cookieWarning").show();
        }

        $("#sprintGoalInTabLabelCheckbox").change(function () {
            if (this.checked) {
                $("#ditwerkniettooltip").show();
            } else {
                $("#ditwerkniettooltip").hide();
            }
        });

        var editorDiv = <HTMLDivElement>document.getElementById('detailsText');
        this.editor = RoosterJs.createEditor(editorDiv);
        if (!sprintGoal) {
            $("#sprintGoalInTabLabelCheckbox").prop("checked", false);
            $("#achievedCheckbox").prop("checked", true);
            $("#goalInput").val("");
        }
        else {
            $("#sprintGoalInTabLabelCheckbox").prop("checked", sprintGoal.sprintGoalInTabLabel);
            $("#achievedCheckbox").prop("checked", sprintGoal.goalAchieved);
            $("#goalInput").val(sprintGoal.goal);

            this.editor.setContent(sprintGoal.details);
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

        if (this.storageUri.indexOf('dev') === -1 && this.storageUri.indexOf('acc') === -1) return;

        if (object) {
            console.log(message, object);
            return;
        }
        console.log(message)
    }
}

export declare class EmojiPicker {
    constructor(params: any);
}

export class SprintGoalDto {
    public goal: string;
    public sprintGoalInTabLabel: boolean;
    public goalAchieved: boolean;
    public details: string;
    public detailsPlain: string;
}
