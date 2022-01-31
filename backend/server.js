const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./db");

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  console.log(req.query); // Try /?skip=0&limit=10
  res.json({ message: "Backend works" });
});

app.get("/match/match_list", db.match.match_list);
app.get("/match/match_info", db.match.match_info);
app.get("/match/match_players", db.match.match_players);
app.get("/match/match_umpires", db.match.match_umpires);

app.get("/innings/batting", db.innings.batting);
app.get("/innings/bowling", db.innings.bowling);
app.get("/innings/extras", db.innings.extras);
app.get("/innings/overs_breakup", db.innings.overs_breakup);
app.get("/innings/top3_bat", db.innings.top3_bat);
app.get("/innings/top3_bowl", db.innings.top3_bowl);
app.get("/innings/runs_breakup", db.innings.runs_breakup);

// set port as 4000 and listen for requests
app.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
