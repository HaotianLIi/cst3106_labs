// yatzyGame.js - YatzyGame module for Yatzy (Lab 6)
// handles the state of the game: players, rounds, rolls and the winner
// uses the Dice module for rolling and one YatzyEngine per player for scores

class YatzyGame {

  static MAX_ROUNDS = 15;  // one round for each box on the scorecard
  static MAX_ROLLS = 3;    // 3 rolls per turn

  constructor(playerNames = ["Player 1"]) {
    this.playerNames = playerNames;
    this.dice = new Dice(5);
    this.startNewGame();
  }

  // sets everything back to the start
  startNewGame() {
    this.players = this.playerNames.map(name => ({
      name: name,
      engine: new YatzyEngine()   // each player has their own score table
    }));
    this.currentPlayer = 0;       // index in this.players
    this.currentRound = 1;
    this.rollCount = 0;           // rolls used this turn
    this.gameOver = false;
    this.dice.reset();
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  // total score of the current player
  get totalScore() {
    return this.getCurrentPlayer().engine.getTotal();
  }

  canRoll() {
    return !this.gameOver && this.rollCount < YatzyGame.MAX_ROLLS;
  }

  // rolls the dice that aren't held, returns the new values (or null if out of rolls)
  rollDice() {
    if (!this.canRoll()) return null;
    this.rollCount++;
    return this.dice.rollAll();
  }

  // dice can only be kept after the first roll
  toggleHold(index) {
    if (this.rollCount === 0 || this.gameOver) return;
    this.dice.toggleHold(index);
  }

  // puts the current dice in a box for the current player, then ends the turn
  scoreCategory(category) {
    if (this.rollCount === 0 || this.gameOver) return null;
    const points = this.getCurrentPlayer().engine.recordScore(category, this.dice.getValues());
    if (points === null) return null;   // box already used
    this.endTurn();
    return points;
  }

  // ends the current player's turn and switches to the next player
  // after the last player, the next round starts
  endTurn() {
    this.rollCount = 0;
    this.dice.reset();
    this.currentPlayer++;

    if (this.currentPlayer >= this.players.length) {
      this.currentPlayer = 0;
      this.currentRound++;
    }

    if (this.currentRound > YatzyGame.MAX_ROUNDS) {
      this.endGame();
    }
  }

  // finds the winner (highest total) and finishes the game
  endGame() {
    this.gameOver = true;
    this.currentRound = YatzyGame.MAX_ROUNDS;

    let winner = this.players[0];
    for (const player of this.players) {
      if (player.engine.getTotal() > winner.engine.getTotal()) {
        winner = player;
      }
    }
    this.winner = { name: winner.name, score: winner.engine.getTotal() };
    return this.winner;
  }
}
