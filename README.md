# two-player-trivia
A simple two-player trivia battle game where players compete by answering questions turn-by-turn. Built to practice JavaScript logic, DOM interaction, and game-flow design.

Two-Player Trivia Battle Game
Project Overview
Build a two-player trivia battle game in the browser using JavaScript.

Two players will play a trivia game using questions fetched from The Trivia API. The game should alternate turns between the two players, ask questions of different difficulty levels, award points based on difficulty, and declare a winner at the end.

Focus on implementing the game’s functionality with a clear, basic UI.

API Docs: https://the-trivia-api.com/docs/v2/


Game Flow & Features
Player Setup

Show inputs for:
Player 1 name
Player 2 name
Only allow the game to start once both names are filled.
After that, move to the category selection screen.
Category Selection

Show a list of categories (mapped to The Trivia API categories).
Both players agree and pick one category.
When a category is selected, fetch 6 questions from that category:
2 easy
2 medium
2 hard

Question Flow

For each chosen category, questions must be asked in this fixed order:

Easy – Player 1
Easy – Player 2
Medium – Player 1
Medium – Player 2
Hard – Player 1
Hard – Player 2

Question Display

For every question, show:

The question text
Multiple-choice options (shuffle)
The difficulty level (Easy / Medium / Hard)
Whose turn it is
The current scores for both players (always visible)

Answering & Scoring

After the player selects an option, show Correct or Wrong.
Award points based on difficulty:
Easy: 10 points
Medium: 15 points
Hard: 20 points
Move to the next question only after clicking a Next button.

Summary Section

After all 6 questions in a category are answered, show a summary section that includes:

Both players’ current scores
Clear options for what to do next:
Choose another category
End game

Choosing Another Category: Game Continues

Take players back to the category selection screen.
Do not show categories that were already used.
Ask them to select another category.
Once a new category is selected, repeat the flow: 
Fetch questions → Play through 6 questions → Show summary section

Ending the Game: Final Results

The game ends when:

Players choose "End game", or
All available categories have been used.
When the game ends, show a final results screen:

Player 1: name and final score
Player 2: name and final score
Winner message:
If one player’s score is higher, that player wins.
If both scores are equal, declare a draw.

How to Approach This Project
Planning

Good planning reduces confusion, prevents mistakes, and makes coding much easier.

Don’t start coding immediately — think first.
Break the whole project into small, clear tasks (the WHATs).
For each task, decide your approach (the HOW).
Write all this in a planning document before coding.

Building & Setup

Code locally with an index.html, style.css, and script.js file.
Run your project in the browser while developing.

Debugging: Things not working

When things are not working, don’t rely on hit‑and‑trial.

Use the browser’s Inspect → Sources tab to debug.
Read errors carefully and understand what’s happening.

Getting Help

Do not take help from AI tools, Google, peers, or friends.
If you’re stuck, confused, or unsure how to proceed, ask us directly. Message Vineela on Slack for guidance.


Planning document