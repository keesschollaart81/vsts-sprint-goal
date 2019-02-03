# Azure DevOps - Sprint Goal

This extension enables you to set a goal for your sprint in Azure DevOps.

![Gif showing Sprint Goal](images/dist/sprint-goal-gif.gif "Gif showing Sprint Goal")

## Usage

First you set your goal (screenshot 1), a goal is set per sprint (or 'iteration') and optionally per team if multiple teams share the same sprint.

After setting the goal, the goal will be shown in the tab-label on every page within the sprint (screenshot 2)

## Release notes

### Version 4.0 - 5-02-2019

- Support for dark theme
- From Azure hosted to self contained (Azure DevOps hosted) package
- No more issues with SSL on TFS (Azure DevOps Server) On-Premises
- No more error when no initial goal is set
- Several bugfixes (see GitHub closed issues)

For details of older releases check [GitHub Releases](https://github.com/keesschollaart81/vsts-sprint-goal/releases)

## Known Bugs
 
- New navigation (summer '18) does not fully refresh the page/tabs when switching team/sprint. (Updated) tab caption only visible after page refresh
- When working with multiple teams, navigating back to the most recent dashboard, the goal of the wrong team is shown [addressed here](https://github.com/Microsoft/vss-web-extension-sdk/issues/128)

## Privacy

Sprint Goal uses Application Insights to track telemetry. When: 'sprint form page loaded', 'sprint saved', data: the id's (guids) of the account, project and user.

## Contact

Experiencing problems, or do you have an idea? 
Please let me know via [Twitter](https://twitter.com/keesschollaart) or by [mail](mailto:keesschollaart81@hotmail.com).