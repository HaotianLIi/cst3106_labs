// dice.js - Dice module for Yatzy (Lab 6)
// handles rolling the dice and keeping track of their values
// the dice HTML matches dice.css from lab 5 (same as showDie() in 07_dice.js)

class Dice {

  constructor(numberOfDice = 5) {
    this.numberOfDice = numberOfDice;           // Yatzy uses 5 dice
    this.values = new Array(numberOfDice).fill(1); // current face of each die
    this.held = new Array(numberOfDice).fill(false); // true = player is keeping this die
  }

  // returns a random number between 1 and 6 (inclusive)
  roll() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // rolls every die that is not held, returns the new values
  rollAll() {
    for (let i = 0; i < this.numberOfDice; i++) {
      if (!this.held[i]) {
        this.values[i] = this.roll();
      }
    }
    return this.getValues();
  }

  // keep or un-keep one die
  toggleHold(index) {
    this.held[index] = !this.held[index];
  }

  // un-keep all dice, used at the start of every turn
  reset() {
    this.held.fill(false);
  }

  // copy of the values so other modules can't change them by accident
  getValues() {
    return [...this.values];
  }

  // dot positions for each face (same classes as dice.css)
  static positions(value) {
    const faces = {
      1: ["middle"],
      2: ["top-left", "bottom-right"],
      3: ["top-left", "middle", "bottom-right"],
      4: ["top-left", "top-right", "bottom-left", "bottom-right"],
      5: ["top-left", "top-right", "bottom-left", "bottom-right", "middle"],
      6: ["top-left", "top-right", "bottom-left", "bottom-right", "middle-left", "middle-right"]
    };
    return faces[value];
  }

  // returns the HTML for one die, same structure as the lab 5 mock-up
  static showDie(value) {
    let dots = "";
    for (const pos of Dice.positions(value)) {
      dots += `<div class="${pos}"><div class="dot"></div></div>`;
    }
    return `<div class="dice">${dots}</div>`;
  }
}
