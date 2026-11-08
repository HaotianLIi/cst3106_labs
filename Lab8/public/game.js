// game.js connects page to Dice module

const dice = new Dice(5);

const diceGroup = document.getElementById("diceGroup");
const rollButton = document.getElementById("rollButton");
const message = document.getElementById("message");

function showDice() {
  diceGroup.innerHTML = "";
  dice.values.forEach((value, i) => {
    const container = document.createElement("div");
    container.className = "dice-container";
    if (dice.held[i]) container.classList.add("held");
    container.innerHTML = Dice.showDie(value);
    container.addEventListener("click", () => {
      dice.toggleHold(i);
      showDice();
    });
    diceGroup.appendChild(container);
  });
}

// held dice are skipped so they stay still
function shakeDice(whenDone) {
  const $rolling = $("#diceGroup .dice-container:not(.held) .dice");

  for (let i = 0; i < 4; i++) {
    $rolling
      .animate({ left: "-=10px" }, 50)
      .animate({ left: "+=20px" }, 50)
      .animate({ left: "-=10px" }, 50);
  }

  // promise() waits for every die, so whenDone runs once instead of once per die
  $rolling.promise().done(whenDone);
}

rollButton.addEventListener("click", async () => {
  try {
    await dice.rollAll();
    // new numbers are only shown after the animation completes
    shakeDice(() => {
      showDice();
      message.textContent = "Click dice to keep them, then roll again";
    });
  } catch (error) {
    console.error(error);
    message.textContent = "Could not get the dice from the server. Please try again.";
  }
});

showDice();
