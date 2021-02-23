import { ExtensionDataService } from "VSS/SDK/Services/ExtensionData";
import { ApplicationInsights } from '@microsoft/applicationinsights-web'


export class SprintGoalApplicationInsightsWrapper {
    private webContext: WebContext;
    private context: IExtensionContext;
    private isLoaded: boolean;
    private telemetryOptOut?: boolean;
    private appInsights: ApplicationInsights;

    constructor() {
        this.isLoaded = false;
    }

    private load = async (): Promise<void> => {
        this.isLoaded = true;

        this.context = VSS.getExtensionContext();
        this.webContext = VSS.getWebContext();
        var dataService: IExtensionDataService = await VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData);
        try {
            this.telemetryOptOut = await dataService.getValue<boolean>("telemetryOptOut");
        }
        catch (error) {
            this.telemetryOptOut = false;
        }
        if (!this.telemetryOptOut) {
            this.appInsights = new ApplicationInsights({
                config: {
                    instrumentationKey: '4a71e7ad-d598-40c2-930b-2d571f6f149f'
                }
            });
            this.appInsights.loadAppInsights();
            this.appInsights.setAuthenticatedUserContext(
                this.webContext.user.id,
                this.webContext.collection.id);
        }
    }

    public trackPageView = async (title: string): Promise<void> => {
        if (!this.isLoaded) await this.load();
        if (this.telemetryOptOut) return;

        this.appInsights.trackPageView({
            name: title,
            uri: window.location.pathname,
            properties: this.getDefaultProps()
        });
    }

    public trackEvent = async (name: string, properties?: { [name: string]: string; }): Promise<void> => {
        if (!this.isLoaded) await this.load();
        if (this.telemetryOptOut) return;

        var joinedProps = { ...this.getDefaultProps(), ...properties };

        this.appInsights.trackEvent({
            name: name,
            properties: joinedProps
        });
    }

    public trackException = async (exception: Error): Promise<void> => {
        if (!this.isLoaded) await this.load();
        if (this.telemetryOptOut) return;

        this.appInsights.trackException({
            exception: exception,
            properties: this.getDefaultProps()
        });
    }

    private getDefaultProps = () => {
        return {
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