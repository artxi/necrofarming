# CrowdBoinas Game Design

## Game Basics
- Workers predict which employees will no longer be with the company by year-end.
- There is a pre-defined pool of employee names to choose from.
- Each player submits a list of 8 names, with a predicted cause of departure (voluntary or fired).
- Submission deadline is early in H1. At the start of H2, players may change up to 2 guesses during a limited edit window.
- Guesses are locked after the deadline or when the player chooses to lock their entry early.

## User Management & Privacy
- Each player receives a unique code (distributed via chat) to join the game.
- Join page: players enter their unique code and click “Join”
  - If the code was used before, log the user into their profile.
  - If the code is valid and unused, prompt for an optional nickname and an Anonymous checkbox.
    - If Anonymous is checked, hide the nickname input; nickname will be empty.
- All entries are displayed on the website, with either the player’s nickname or “Anonymous”
- General list shows aggregate stats for each guessed name. Non-anonymous players who picked a name can be revealed via hover or expand.
- After each year, only summary data may be retained (TBD).

## Scoring
- Each correct guess: **1 point**
- Correct cause: **+0.5 points**
- No points if the guess is locked less than 15 days before the employee leaves (to prevent knowledge abuse).
- If an employee leaves and returns within the year, no points are awarded.
- Two rankings:
  1. Raw number of correct guesses
  2. Advanced scoring system (TBD; e.g., tiered/bonus for popularity or uniqueness)
- Tie-breaker rules: TBD

## Game Flow
- Players can submit and edit their list until the deadline, or lock it early.
- Employee pool and departures/causes are managed in the database (MVP).
- General list displays all guessed names, number of times guessed, and breakdowns by cause.
- Each player’s list is viewable, with their nickname or “Anonymous.”
- “How to Play” page and clear scoring explanation will be available.

## MVP & Future Features
- MVP: admin input for departures and database updates for management.
- Notifications and admin dashboard planned for future versions.
- Late entries may be allowed in the future, with penalties or minimum validity periods for guesses.
- **Post-MVP:** Add JWT authentication for secure player sessions and API protection.
- Possible future integration with company systems (e.g., Slack).
