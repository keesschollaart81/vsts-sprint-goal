import { ExtensionDataService } from "VSS/SDK/Services/ExtensionData";

export class SprintGoalApplicationInsightsWrapper {
    private webContext: WebContext;
    private context: IExtensionContext;
    private isLoaded: boolean;
    private telemetryOptOut?: boolean;

    constructor() {
        this.isLoaded = false;
    }

    private load = async () : Promise<void> => {
        this.isLoaded = true;

        this.context = VSS.getExtensionContext();
        this.webContext = VSS.getWebContext();
        var dataService: IExtensionDataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        try{
            this.telemetryOptOut = await dataService.getValue<boolean>("telemetryOptOut");
        }
        catch(error){
            this.telemetryOptOut = false;
        }
        if (!this.telemetryOptOut){
            var appInsights = window["appInsights"] || function (a: any) {
                function b(a) { c[a] = function () { var b = arguments; c.queue.push(function () { c[a].apply(c, b) }) } } var c: any = { config: a }, d = document, e = window; setTimeout(function () { var b = d.createElement("script"); b.src = a.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js", d.getElementsByTagName("script")[0].parentNode.appendChild(b) }); try { c.cookie = d.cookie } catch (a) { } c.queue = []; for (var f: any = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; f.length;)b("track" + f.pop()); if (b("setAuthenticatedUserContext"), b("clearAuthenticatedUserContext"), b("startTrackEvent"), b("stopTrackEvent"), b("startTrackPage"), b("stopTrackPage"), b("flush"), !a.disableExceptionTracking) { f = "onerror", b("_" + f); var g = e[f]; e[f] = function (a, b, d, e, h) { var i = g && g(a, b, d, e, h); return !0 !== i && c["_" + f](a, b, d, e, h), i } } return c
            }({
                instrumentationKey: "4a71e7ad-d598-40c2-930b-2d571f6f149f"
            });

            window["appInsights"] = appInsights, appInsights.queue && 0 === appInsights.queue.length && appInsights.trackPageView();

            window["appInsights"].setAuthenticatedUserContext(
                this.webContext.user.id,
                this.webContext.collection.id);
        }
    }

    public trackPageView = async (title: string) : Promise<void> => {
        if (!this.isLoaded) await this.load();
        if (this.telemetryOptOut) return;

        window["appInsights"].trackPageView(
            title,
            window.location.pathname,
            this.getDefaultProps()
        );
    }

    public trackEvent = async (name: string, properties?: { [name: string]: string; }, measurements?: { [name: string]: number; }) : Promise<void> => {
        if (!this.isLoaded) await this.load();
        if (this.telemetryOptOut) return;
 
        var joinedProps = { ...this.getDefaultProps(), ...properties};

        window["appInsights"].trackEvent(name, joinedProps, measurements)
    }

    public trackException = async (exception: Error) : Promise<void> => {
        if (!this.isLoaded) await this.load();
        if (this.telemetryOptOut) return;

        window["appInsights"].trackException(exception, "unhandled", this.getDefaultProps());
    }

    private getDefaultProps = () =>{
        return  {
            accountName: this.webContext.account.name,
            accountId: this.webContext.account.id,
            extensionId: this.context.extensionId,
            version: this.context.version,
            teamName: this.webContext.team.name
        };
    }

    public unload = () => {
        this.isLoaded = false;
        this.telemetryOptOut = undefined;
    }
}