// app.js - connects the page to the three modules (Lab 6)
// the modules don't touch the page, so all the DOM code is here

const game = new YatzyGame(["Player 1"]);

const diceGroup = document.getElementById("diceGroup");
const rollButton = document.getElementById("rollButton");
const newGameButton = document.getElementById("newGameButton");
const message = document.getElementById("message");

// draws the 5 dice, kept dice get the "held" class
function showDice() {
  diceGroup.innerHTML = "";
  game.dice.values.forEach((value, i) => {
    const container = document.createElement("div");
    container.id = "die0" + (i + 1);
    container.className = "dice-container";
    if (game.dice.held[i]) container.classList.add("held");
    container.innerHTML = Dice.showDie(value);
    container.addEventListener("click", () => {
      game.toggleHold(i);
      showDice();
    });
    diceGroup.appendChild(container);
  });
}

// fills in the scorecard and the total
function showScores() {
  const engine = game.getCurrentPlayer().engine;

  for (const category of YatzyEngine.CATEGORIES) {
    const score = engine.scoreTable[category];
    document.getElementById(category + "Score").textContent = score === null ? "-" : score;
    document.querySelector(`[data-category="${category}"]`).classList.toggle("used", score !== null);
  }

  document.getElementById("upperSum").textContent = engine.getUpperSum();
  document.getElementById("bonusScore").textContent = engine.getBonus();
  document.getElementById("totalScore").textContent = "Total: " + game.totalScore;
}

function showMessage() {
  if (game.gameOver) {
    message.textContent = `Game over! ${game.winner.name} scored ${game.winner.score} points.`;
  } else if (game.rollCount === 0) {
    message.textContent = `Round ${game.currentRound} of ${YatzyGame.MAX_ROUNDS} - Roll the dice`;
  } else {
    message.textContent = `Round ${game.currentRound} of ${YatzyGame.MAX_ROUNDS} - Roll ${game.rollCount} of ${YatzyGame.MAX_ROLLS}`;
  }
  rollButton.disabled = !game.canRoll();
}

function update() {
  showDice();
  showScores();
  showMessage();
}

rollButton.addEventListener("click", () => {
  game.rollDice();
  update();
});

newGameButton.addEventListener("click", () => {
  game.startNewGame();
  update();
});

// clicking an empty box puts the score in it
document.querySelectorAll("[data-category]").forEach(row => {
  row.addEventListener("click", () => {
    if (game.scoreCategory(row.dataset.category) !== null) {
      update();
    }
  });
});

update();
