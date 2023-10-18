# To do

A simple list of things to do, and to help me keep track of what I'm doing and going to do next.

## Todo

### Admin

- [ ] Show how the quest looks like for the team
- [ ] Add warning icons to missing fields
- [ ] Ability to remove a hint
- [ ] When looking at a quest, show the hints that have been revealed and by which team.
- [ ] Add a nice overview of the game, what quest they are on (with a link to the quest)
      And which hints they have revealed.
- [ ] Add/Remove minutes to the end time after it has been started
- [ ] See teams bound to a season and ability to delete them, for testing purposes

### UI/UX

### Chat

- [ ] Check how to add voice chat to the game

### General improvements

- [ ] Use Firebase for storage to automatically load updates instead of polling

### Game

- [ ] When a hint has 0 points, it is treated as non-existent and the team can't reveal it.
- [ ] First player to complete the game gets a bonus. This depends on the total number of players
- [ ] Randomize the order of themes and quests per team

## Done

- [x] Added models for the database
- [x] Create a basic login page, UI only no functionality
- [x] Connect login page to firebase database
- [x] Ability to login admin user / team user
- [x] Admin: Season page + ability to create seasons
- [x] Admin: Quest theme + quest page
- [x] Display and add hints to quests
- [x] Infrastructure for GCP projects
- [x] Github Actions for CI/CD deploy to dev & prod
- [x] Admin: Add teams
- [x] Admin: Start and end seasons
- [x] Game: Wait, start, end, comtpleted screens
- [x] UI/UX for game
  - [x] Show current quest
  - [x] Show hints
  - [x] Show timer and all team progress/points
- [x] Backend for checking answer and continuing game
- [x] Forward to next quest when one in the team got the right answer
- [x] Instead of getting next hint, get the ability to reveal a specific hint
- [x] Upload images/files for quests and serve them statically from GCP
- [x] Clear/Remove an asset
- [x] Logout
- [x] Forwarding
  - [x] When not logged in -> Login page
  - [x] Admin automatically forwarded to admin page
- [x] Submit button for quests
