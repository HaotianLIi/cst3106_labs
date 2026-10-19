# Yatzy - Lab 6

CST3106 Lab 6 - Building a Yatzy Dice Game

Author: Haotian Li (040961243)

In Lab 5 I made the design for my Yatzy game (rules, dice CSS and an HTML/CSS mock-up). In this lab I split the game logic into three JavaScript modules and connected them to the Lab 5 mock-up so the game can be played.

To run it, open `index.html` in a browser. No server is needed.

## Files

| File | What it is |
|---|---|
| `dice.js` | **Dice** module - rolls the dice and keeps their values |
| `yatzyEngine.js` | **YatzyEngine** module - scoring rules and the score table |
| `yatzyGame.js` | **YatzyGame** module - players, rounds, rolls and the winner |
| `app.js` | connects the page to the modules (all the DOM code is here) |
| `index.html` | game page, same layout as the Lab 5 mock-up |
| `dice.css` | dice styles from Lab 5 (class sample `07_dice.css`) |
| `styles.css` | game styles from Lab 5, plus a few lab 6 additions |

## 1. Review and Refinement of Lab 5

Lab 5 was only HTML/CSS, so the Roll Dice button didn't do anything. Things I changed or improved:

- **Dice are made by JavaScript now.** In the mock-up the 5 dice were written by hand in the HTML. Now `Dice.showDie()` builds the dice HTML from the value, using the same dot classes as `dice.css`.
- **Kept dice look different.** The mock-up had no way to show which dice are kept. Kept dice now get the grey `#ddd` background from my design system.
- **Empty boxes show "-" instead of 0.** In the mock-up every box showed 0, so you couldn't tell an empty box from a box scored as 0.
- **Scorecard rows are clickable** and the used ones turn bold so you can see which boxes are left.
- **Roll Dice button is disabled** after 3 rolls.
- **Added a New Game button.**
- **Game container fits small screens.** At 50% width it was too narrow on a phone, so under 900px it uses the full width.
- **Logic is separated from the page.** The three modules don't use `document` at all, only `app.js` does. This means the rules could be tested or reused without the page.

## 2. Design Decisions

### How many dice?

5 dice with 6 sides each. Each turn the player can roll up to 3 times and keep any dice between rolls.

### Scoring categories

15 boxes, same Yatzy rules as my Lab 5 README:

| Section | Boxes |
|---|---|
| Upper | Ones, Twos, Threes, Fours, Fives, Sixes (add up that face). 50 point bonus if the upper sum is 63 or more |
| Lower | One Pair, Two Pairs, Three of a Kind, Four of a Kind, Small Straight (15), Large Straight (20), Full House, Chance, Yatzy (50) |

A box can always be picked, even if the dice don't fit. Then it scores 0.

### Game flow

1. `startNewGame()` sets round 1, empty scorecards and roll 0.
2. The player rolls (up to 3 times) and clicks dice to keep them.
3. The player clicks an empty box. The engine checks it with `isValidSelection()`, works out the points with `calculateScore()` and saves them.
4. `endTurn()` resets the dice and moves to the next player. After the last player the round goes up.
5. After round 15, `endGame()` finds the highest total and shows the winner.

### Why split it into modules

Each module has one job, so it's easier to find bugs and change one part without breaking the others:

```
index.html + app.js   (page, buttons, clicks)
        |
    YatzyGame         (whose turn, which round, how many rolls)
     /       \
  Dice     YatzyEngine (one per player)
(rolling)  (rules + score table)
```

The game is single player on the page for now, but `YatzyGame` takes a list of player names, so more players can be added later by changing `new YatzyGame(["Player 1"])` in `app.js`.

## 3. Modules

### Dice (`dice.js`)

| Member | Description |
|---|---|
| `numberOfDice` | how many dice (5) |
| `values` | current value of each die |
| `held` | which dice are kept |
| `roll()` | returns a random number from 1 to 6 |
| `rollAll()` | rolls every die that isn't kept |
| `toggleHold(index)` | keep / un-keep a die |
| `reset()` | un-keeps all dice for a new turn |
| `Dice.showDie(value)` | returns the HTML for one die |

### YatzyEngine (`yatzyEngine.js`)

| Member | Description |
|---|---|
| `scoreTable` | score for each of the 15 boxes (`null` = not used yet) |
| `calculateScore(category, diceValues)` | returns the points these dice would get in that box |
| `isValidSelection(category, diceValues)` | checks the box exists, is still empty and the dice are 5 numbers from 1-6 |
| `recordScore(category, diceValues)` | saves the score in the table |
| `getUpperSum()`, `getBonus()`, `getTotal()` | totals for the scorecard |
| `isComplete()` | true when all boxes are filled |

### YatzyGame (`yatzyGame.js`)

| Member | Description |
|---|---|
| `currentPlayer` | index of the player whose turn it is |
| `currentRound` | round 1 to 15 |
| `totalScore` | total score of the current player |
| `rollCount` | rolls used this turn |
| `startNewGame()` | starts a new game |
| `rollDice()` | rolls the dice that aren't kept (max 3 times) |
| `scoreCategory(category)` | puts the dice in a box and ends the turn |
| `endTurn()` | ends the turn and switches to the next player |
| `endGame()` | finds the winner and finishes the game |

## References

- CST3106 Lab 5 (my Yatzy design, mock-up and dice CSS)
- CST3106 Lecture 5 slides (Yatzy rules, HTML structure, styling)
- Class sample code js3 (`07_dice.css`, `07_dice.js`)
- https://en.wikipedia.org/wiki/Yatzy
