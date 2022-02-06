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
  res.json({ message: "Backend works" });
});

app.get("/match/list", db.match.list);
app.get("/match/info", db.match.info);
app.get("/match/players", db.match.players);
app.get("/match/umpires", db.match.umpires);

app.get("/innings/bat", db.innings.bat);
app.get("/innings/bowl", db.innings.bowl);
app.get("/innings/extras", db.innings.extras);
app.get("/innings/overs_breakup", db.innings.overs_breakup);
app.get("/innings/top3_bat", db.innings.top3_bat);
app.get("/innings/top3_bowl", db.innings.top3_bowl);
app.get("/innings/runs_breakup", db.innings.runs_breakup);

app.get("/player/info", db.player.info);
app.get("/player/bat_stat", db.player.bat_stat);
app.get("/player/bowl_stat", db.player.bowl_stat);
app.get("/player/bat_per_match", db.player.bat_per_match);
app.get("/player/bowl_per_match", db.player.bowl_per_match);

app.get("/ptable/list", db.ptable.list);
app.get("/ptable/points", db.ptable.points);
app.get("/ptable/nrr", db.ptable.nrr);

app.get("/venue/list", db.venue.list);
app.get("/venue/basic", db.venue.basic);
app.get("/venue/win_stat", db.venue.win_stat);
app.get("/venue/first_inn", db.venue.first_inn);
app.post("/venue/add", db.venue.add);

// set port as 4000 and listen for requests
app.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
});
