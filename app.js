const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const scores = {
  airgun: [],
  archery: [],
  blowgun: []
};

let lastPlayer = null;

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit", (req, res) => {
  const { playerName, gameType, scoresArray } = req.body;
  const parsedScores = scoresArray.split(',').map(Number);
  const total = parsedScores.reduce((a, b) => a + b, 0);

  const target = {
    airgun: 32,
    archery: 18,
    blowgun: 53
  };

  const result = {
    name: playerName,
    total,
    success: total >= target[gameType]
  };

  scores[gameType].push(result);
  scores[gameType].sort((a, b) => b.total - a.total);

  lastPlayer = { name: playerName, total, success: result.success };

  res.redirect("/");
});

app.get("/leaderboard", (req, res) => {
  res.render("leaderboard", { scores });
});

app.get("/api/leaderboard", (req, res) => {
  res.json(scores);
});

app.get("/api/last-player", (req, res) => {
  res.json(lastPlayer);
  lastPlayer = null;
});

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
