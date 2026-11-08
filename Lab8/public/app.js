// app.js connects page to Dice module

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

rollButton.addEventListener("click", async () => {
  try {
    await dice.rollAll();          // gets the values from the server
    showDice();
    message.textContent = "Click dice to keep them, then roll again";
  } catch (error) {
    console.error(error);
    message.textContent = "Could not get the dice from the server. Please try again.";
  }
});

showDice();
