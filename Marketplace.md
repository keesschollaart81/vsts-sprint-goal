# Azure DevOps - Sprint Goal

This extension enables you to set a goal for your sprint in Azure DevOps.

![Gif showing Sprint Goal](images/dist/sprint-goal-gif.gif "Gif showing Sprint Goal")

## Usage

First you set your goal (screenshot 1), a goal is set per sprint (or 'iteration') and optionally per team if multiple teams share the same sprint.

After setting the goal, the goal will be shown in the tab-label on every page within the sprint (screenshot 2)

## Release notes

### Version 5.0 - 29-07-2019

- Rich Text field for detailed goal description
- Toggle to set if goal was achieved
- Export all sprint goals to JSON
- Toggle in settings to disable all telemetry
- Warning that sprint goal in tab title does not update when using inline sprint-picker

For details of older releases check [GitHub Releases](https://github.com/keesschollaart81/vsts-sprint-goal/releases)

## Known Bugs
 
- New navigation (summer '18) does not fully refresh the page/tabs when switching team/sprint. (Updated) tab caption only visible after page refresh
- When working with multiple teams, navigating back to the most recent dashboard, the goal of the wrong team is shown [addressed here](https://github.com/Microsoft/vss-web-extension-sdk/issues/128)

## Privacy

Sprint Goal uses Application Insights to track some telemetry. 3 events are tracked: 'sprint form page loaded', 'sprint goal saved', and 'sprint widget configuration saved'. Your sprint goal and details never leave your Azure DevOps tenant / are not included in the telemetry.

Telemetry can be disabled on the settings page of Sprint Goal which can be found in the Azure DevOps project settings.

When saving the sprint goal, we track if you're showing the goal in the tab title (yes/no) and if the detail text field is used (yes/no) (more than 10 characters). When updating the widget, the size and color of the widget. For every telemetry the id's (guids) of the account, project and user are included as metadata.

## Contact

Experiencing problems, or do you have an idea? 
Please let me know via [Twitter](https://twitter.com/keesschollaart) or by [mail](mailto:keesschollaart81@hotmail.com).