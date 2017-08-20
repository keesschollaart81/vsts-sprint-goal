# VSTS Sprint Goal

This extension enables you to set a goal for your sprint in VSTS.

![Gif showing Sprint Goal](images/sprint-goal-gif.gif "Gif showing Sprint Goal")

## Usage

First you set your goal (screenshot 1), a goal is set per sprint (or 'iteration') and optionally per team if teams share the same sprint.

After setting the goal, the goal will be shown in the tab-label on every page within the sprint (screenshot 2)

## Release notes

### Version 2.0 - 20-08-217

- Support for multiple team working on the same iteration. The first team setting the goal, sets it both on iteration level as well on team level. After this all teams share this initial goal but can set their own if they want to.
- Support for TFS / On-Premises, note: internet connection is required for the end-user since the scripts/pages are hosted online.

### Version 1.0 - 02-06-2017

Initial Release

## Known Bugs

- First time someone (else) loads the sprint page, the sprint goal is not shown in the tab label.

## Privacy

Sprint Goal uses Application Insights to track telemetry. When: 'sprint form page loaded', 'sprint saved', data: the id's (guids) of the account, project and user.