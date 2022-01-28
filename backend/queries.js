const match_list = `SELECT match_id,
season_year,
match.team1 AS team1_id,
match.team2 AS team2_id,
match.match_winner AS winner_id,
t1.team_name AS team1_name,
t2.team_name AS team2_name,
venue.venue_name,
venue.city_name
FROM match
LEFT OUTER JOIN venue ON match.venue_id = venue.venue_id
LEFT OUTER JOIN team AS t1 ON match.team1 = t1.team_id
LEFT OUTER JOIN team AS t2 ON match.team2 = t2.team_id
ORDER BY season_year LIMIT $1 OFFSET $2;
`;

module.exports = { match_list };
