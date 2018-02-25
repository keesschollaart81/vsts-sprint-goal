export class SprintGoalWidgetSettings {

    public static DefaultSettings = new SprintGoalWidgetSettings("#3624A0", "#ffffff", 13);

    constructor(foregroundColor: string, backgroundColor: string, fontSize: number) {
        this.backgroundColor = backgroundColor;
        this.fontsize = fontSize;
        this.foregroundColor = foregroundColor;
    }

    public foregroundColor: string;
    public backgroundColor: string;
    public fontsize: number;

}