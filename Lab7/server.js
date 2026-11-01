const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

app.get("/roll-dices", (req, res) => {
  const dice = [];
  for (let i = 0; i < 5; i++){
    dice.push(rollDie());
  }
  res.json({ dice });
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
})
