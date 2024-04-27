# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2024-04-27 Fixed build and deployment

### Added

- Add a GitHub action for PRs to deploy to dev

### Fixed

- Build failed after adding

## [<=0.5.0] - 2024-03-12

### Added

- Added models for the database
- Create a basic login page, UI only no functionality
- Connect login page to firebase database
- Ability to login admin user / team user
- Admin: Season page + ability to create seasons
- Admin: Quest theme + quest page
- Display and add hints to quests
- Infrastructure for GCP projects
- Github Actions for CI/CD deploy to dev & prod
- Admin: Add teams
- Admin: Start and end seasons
- Game: Wait, start, end, comtpleted screens
- UI/UX for game
  - Show current quest
  - Show hints
  - Show timer and all team progress/points
- Backend for checking answer and continuing game
- Forward to next quest when one in the team got the right answer
- Instead of getting next hint, get the ability to reveal a specific hint
- Upload images/files for quests and serve them statically from GCP
- Clear/Remove an asset
- Logout
- Forwarding
  - When not logged in -> Login page
  - Admin automatically forwarded to admin page
- Submit button for quests
- Randomize the order of themes and quests per team
  - Add a button to mark all the quests and themes will be randomized
  - Instead of having a logic for the next quest, each team's model has the order of the quests
  - When completing a quest, go to the next quest in the list
  - Randomize the full order when a team is created
  - Update the progress bar to show how many quests have been completed (don't show the order)
