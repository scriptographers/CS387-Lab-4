// List
const list = `
SELECT match_id,
  season_year,
  match.team1 AS team1_id,
  match.team2 AS team2_id,
  match.win_type,
  match.win_margin,
  t1.team_name AS team1_name,
  t2.team_name AS team2_name,
  t3.team_name AS winner_name,
  venue.venue_name,
  venue.city_name
FROM match
LEFT OUTER JOIN venue ON match.venue_id = venue.venue_id
LEFT OUTER JOIN team AS t1 ON match.team1 = t1.team_id
LEFT OUTER JOIN team AS t2 ON match.team2 = t2.team_id
LEFT OUTER JOIN team AS t3 ON match.match_winner = t3.team_id
ORDER BY season_year DESC, match_id ASC
`;

// Info
const info = `
SELECT match_id,
  venue_name,
  season_year,
  team1 AS team1_id,
  team2 AS team2_id,
  t1.team_name AS team1_name,
  t2.team_name AS team2_name,
  toss_winner AS toss_winner_id,
  toss_name,
  match_winner AS winner_id,
  win_type,
  win_margin
FROM match
LEFT OUTER JOIN venue ON match.venue_id = venue.venue_id
LEFT OUTER JOIN team AS t1 ON match.team1 = t1.team_id
LEFT OUTER JOIN team AS t2 ON match.team2 = t2.team_id
WHERE match_id = $1;
`;

// Players of each Team
const players = `
SELECT player_name
FROM player_match
LEFT OUTER JOIN player ON player_match.player_id = player.player_id
WHERE match_id = $1 AND team_id = $2
ORDER BY player_name;
`;

// Umpires
const umpires = `
SELECT umpire_name
FROM umpire_match
LEFT OUTER JOIN umpire ON umpire_match.umpire_id = umpire.umpire_id
WHERE match_id = $1
ORDER BY umpire_name;
`;

module.exports = {
  list,
  info,
  players,
  umpires
};
