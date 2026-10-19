// yatzyEngine.js - YatzyEngine module for Yatzy (Lab 6)
// handles the rules: works out the score for each box and keeps the score table
// scoring follows the Yatzy rules in the lab 5 README

class YatzyEngine {

  // the 15 boxes on the scorecard
  static UPPER = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  static LOWER = ["onePair", "twoPairs", "threeKind", "fourKind",
                  "smallStraight", "largeStraight", "fullHouse", "chance", "yatzy"];
  static CATEGORIES = [...YatzyEngine.UPPER, ...YatzyEngine.LOWER];

  static BONUS_TARGET = 63;  // upper sum needed for the bonus
  static BONUS_POINTS = 50;

  constructor() {
    this.scoreTable = {};
    this.resetScores();
  }

  // empty scorecard, null means the box hasn't been used yet
  resetScores() {
    for (const category of YatzyEngine.CATEGORIES) {
      this.scoreTable[category] = null;
    }
  }

  // ---------- helpers ----------

  // how many of each face, e.g. [4,4,4,6,6] -> {4: 3, 6: 2}
  countDice(diceValues) {
    const counts = {};
    for (const v of diceValues) {
      counts[v] = (counts[v] || 0) + 1;
    }
    return counts;
  }

  sum(diceValues) {
    return diceValues.reduce((total, v) => total + v, 0);
  }

  // faces that show up at least n times, highest first
  facesWithAtLeast(diceValues, n) {
    const counts = this.countDice(diceValues);
    return Object.keys(counts)
      .map(Number)
      .filter(face => counts[face] >= n)
      .sort((a, b) => b - a);
  }

  // ---------- rules ----------

  // returns the score for a box with these dice (0 if the dice don't fit)
  calculateScore(category, diceValues) {
    const sorted = [...diceValues].sort((a, b) => a - b).join("");

    // upper section: add up all dice of that face
    const upperIndex = YatzyEngine.UPPER.indexOf(category);
    if (upperIndex !== -1) {
      const face = upperIndex + 1;
      return diceValues.filter(v => v === face).length * face;
    }

    switch (category) {
      case "onePair": {
        const pairs = this.facesWithAtLeast(diceValues, 2);
        return pairs.length > 0 ? pairs[0] * 2 : 0;   // highest pair
      }
      case "twoPairs": {
        const pairs = this.facesWithAtLeast(diceValues, 2);
        return pairs.length >= 2 ? (pairs[0] + pairs[1]) * 2 : 0;
      }
      case "threeKind": {
        const three = this.facesWithAtLeast(diceValues, 3);
        return three.length > 0 ? three[0] * 3 : 0;
      }
      case "fourKind": {
        const four = this.facesWithAtLeast(diceValues, 4);
        return four.length > 0 ? four[0] * 4 : 0;
      }
      case "smallStraight":
        return sorted === "12345" ? 15 : 0;
      case "largeStraight":
        return sorted === "23456" ? 20 : 0;
      case "fullHouse": {
        // needs 3 of one face and 2 of a different face
        const counts = Object.values(this.countDice(diceValues)).sort();
        return counts.join("") === "23" ? this.sum(diceValues) : 0;
      }
      case "chance":
        return this.sum(diceValues);
      case "yatzy":
        return this.facesWithAtLeast(diceValues, 5).length > 0 ? 50 : 0;
      default:
        return 0;
    }
  }

  // checks if the player is allowed to score these dice in this box:
  // the box has to exist, still be empty, and the dice have to be 5 numbers from 1-6
  // (a box can still be picked for 0 points if the dice don't fit, like in the lab 5 rules)
  isValidSelection(category, diceValues) {
    if (!YatzyEngine.CATEGORIES.includes(category)) return false;
    if (this.scoreTable[category] !== null) return false;
    if (!Array.isArray(diceValues) || diceValues.length !== 5) return false;
    return diceValues.every(v => Number.isInteger(v) && v >= 1 && v <= 6);
  }

  // saves the score in the table, returns the points (or null if not allowed)
  recordScore(category, diceValues) {
    if (!this.isValidSelection(category, diceValues)) return null;
    const points = this.calculateScore(category, diceValues);
    this.scoreTable[category] = points;
    return points;
  }

  // ---------- totals ----------

  getUpperSum() {
    return YatzyEngine.UPPER.reduce((total, c) => total + (this.scoreTable[c] || 0), 0);
  }

  getBonus() {
    return this.getUpperSum() >= YatzyEngine.BONUS_TARGET ? YatzyEngine.BONUS_POINTS : 0;
  }

  getLowerSum() {
    return YatzyEngine.LOWER.reduce((total, c) => total + (this.scoreTable[c] || 0), 0);
  }

  getTotal() {
    return this.getUpperSum() + this.getBonus() + this.getLowerSum();
  }

  // true when all 15 boxes are filled
  isComplete() {
    return YatzyEngine.CATEGORIES.every(c => this.scoreTable[c] !== null);
  }
}
