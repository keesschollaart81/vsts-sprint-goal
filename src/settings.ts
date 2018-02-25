export class SprintGoalWidgetSettings {

    public static DefaultSettings = new SprintGoalWidgetSettings("#3624A0", "#ffffff", 13);

    constructor(foregroundColor: string, backgroundColor: string, fontSize: number) {
        this.BackgroundColor = backgroundColor;
        this.Fontsize = fontSize;
        this.ForegroundColor = foregroundColor;
    }

    public ForegroundColor: string;
    public BackgroundColor: string;
    public Fontsize: number;

}