define(["require", "exports", "TFS/Work/RestClient", "VSS/Service", "VSS/WebApi/Constants", "./settings", "./SprintGoalApplicationInsightsWrapper", "tinycolor2"], function (require, exports, Work_Client, Service, WebApi_Constants, settings_1, SprintGoalApplicationInsightsWrapper_1, tinycolor) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetStyles();
        VSS.register("SprintGoalWidget", function () {
            return new SprintGoalWidget(WidgetHelpers, new SprintGoalApplicationInsightsWrapper_1.SprintGoalApplicationInsightsWrapper());
        });
        VSS.notifyLoadSucceeded();
    });
    var SprintGoalWidget = /** @class */ (function () {
        function SprintGoalWidget(WidgetHelpers, ai) {
            var _this = this;
            this.WidgetHelpers = WidgetHelpers;
            this.ai = ai;
            this.getConfigKey = function (iterationId, teamId) {
                // https://github.com/Microsoft/vss-web-extension-sdk/issues/75
                return iterationId.toString().substring(0, 15) + teamId.toString().substring(0, 15);
            };
            this.display = function (title, text, columns, settings) {
                var isLight = true;
                $("#widgetcontainer").css("background-color", settings.backgroundColor);
                $("#sprint-goal").css("color", settings.foregroundColor);
                $("#sprint-goal").css("font-size", settings.fontsize + "pt");
                isLight = tinycolor(settings.backgroundColor).isLight();
                $(".widget").css("background-image", _this.getFlagFilename(columns, isLight));
                $("#widgetcontainer h2").css("color", (isLight) ? "black" : "white");
                $("#widgetcontainer h2").text(title);
                $("#sprint-goal").text(text);
                $(".widget").show();
                _this.ai.trackEvent("Widget shown");
                return _this.WidgetHelpers.WidgetStatusHelper.Success();
            };
            this.fetchSettingsFromExtensionDataService = function (key) {
                return VSS.getService(VSS.ServiceIds.ExtensionData)
                    .then(function (dataService) {
                    return dataService.getValue("sprintConfig." + key);
                });
            };
            this.getFlagFilename = function (cols, isLight) {
                var file = "";
                if (cols == 1)
                    file = (isLight) ? "flag-black.png" : "flag-white.png";
                else
                    file = (isLight) ? "flag-black-big.png" : "flag-white-big.png";
                return "url('images/dist/" + file + "')";
            };
        }
        SprintGoalWidget.prototype.load = function (widgetSettings) {
            try {
                return this.loadSprintGoal(widgetSettings);
            }
            catch (e) {
                this.ai.trackException(e);
                return this.display(widgetSettings.name, "Error loading widget", widgetSettings.size.columnSpan, settings_1.SprintGoalWidgetSettings.DefaultSettings);
            }
        };
        SprintGoalWidget.prototype.reload = function (widgetSettings) {
            try {
                return this.loadSprintGoal(widgetSettings);
            }
            catch (e) {
                this.ai.trackException(e);
                return this.display(widgetSettings.name, "Error reloading widget", widgetSettings.size.columnSpan, settings_1.SprintGoalWidgetSettings.DefaultSettings);
            }
        };
        SprintGoalWidget.prototype.loadSprintGoal = function (widgetSettings) {
            var _this = this;
            var workClient = Service.VssConnection
                .getConnection()
                .getHttpClient(Work_Client.WorkHttpClient, WebApi_Constants.ServiceInstanceTypes.TFS);
            var webContext = VSS.getWebContext();
            var projectId = webContext.project.id;
            var teamId = webContext.team.id;
            var teamContext = {
                project: "",
                projectId: webContext.project.id,
                team: "",
                teamId: webContext.team.id,
            };
            var settings = JSON.parse(widgetSettings.customSettings.data);
            if (!settings)
                settings = settings_1.SprintGoalWidgetSettings.DefaultSettings;
            return workClient.getTeamIterations(teamContext).then(function (i) {
                if (i.length == 0)
                    return _this.display(widgetSettings.name, "No sprint goal yet!", widgetSettings.size.columnSpan, settings);
                return workClient.getTeamIterations(teamContext, "current").then(function (teamIterations) {
                    var iterationId = teamIterations[0].id;
                    var configIdentifierWithTeam = _this.getConfigKey(iterationId, teamId);
                    return _this.fetchSettingsFromExtensionDataService(configIdentifierWithTeam).then(function (teamGoal) {
                        var title = (widgetSettings.size.columnSpan == 1) ? widgetSettings.name : widgetSettings.name + " - " + teamIterations[0].name;
                        if (teamGoal) {
                            return _this.display(title, teamGoal.goal, widgetSettings.size.columnSpan, settings);
                        }
                    });
                });
            });
        };
        return SprintGoalWidget;
    }());
    exports.SprintGoalWidget = SprintGoalWidget;
    var SprintGoalDto = /** @class */ (function () {
        function SprintGoalDto() {
        }
        return SprintGoalDto;
    }());
    exports.SprintGoalDto = SprintGoalDto;
});
