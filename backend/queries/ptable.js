// List of teams
const team_list = `
SELECT team_id,
  team_name
FROM TEAM;
`;

// Points
const points = `
SELECT matches,
  wins,
  matches - wins - ties AS losses,
  ties,
  2 * wins AS points
FROM (
  SELECT coalesce(count(match_id), 0) AS matches,
    coalesce(count(CASE WHEN match_winner = $2 THEN 1 ELSE NULL END), 0) AS wins,
    coalesce(count(CASE WHEN win_type IS NULL THEN 1 ELSE NULL END), 0) AS ties
  FROM match
  WHERE season_year = $1 AND (team1 = $2 OR team2 = $2)
  ) AS sq1;
`;

// NRR
const nrr = `
SELECT round((1.0 * runs_by_team) / coalesce(nullif(overs_by_team, 0), 1) - (1.0 * runs_against_team) / coalesce(nullif(overs_against_team, 0), 1), 2) AS nrr
FROM (
  SELECT sum(runs_by_over) AS runs_by_team,
    count(CASE WHEN overs_by = 0 THEN NULL ELSE 1 END) AS overs_by_team,
    sum(runs_against_over) AS runs_against_team,
    count(CASE WHEN overs_against = 0 THEN NULL ELSE 1 END) AS overs_against_team
  FROM (
    SELECT sum(CASE WHEN batting.team_id = $2 THEN runs_scored ELSE 0 END) AS runs_by_over,
      sum(CASE WHEN bowling.team_id = $2 THEN runs_scored ELSE 0 END) AS runs_against_over,
      count(CASE WHEN batting.team_id = $2 THEN 1 ELSE NULL END) AS overs_by,
      count(CASE WHEN bowling.team_id = $2 THEN 1 ELSE NULL END) AS overs_against
    FROM ball_by_ball
    LEFT OUTER JOIN player_match AS batting ON ball_by_ball.match_id = batting.match_id AND ball_by_ball.striker = batting.player_id
    LEFT OUTER JOIN player_match AS bowling ON ball_by_ball.match_id = bowling.match_id AND ball_by_ball.bowler = bowling.player_id
    LEFT OUTER JOIN match ON ball_by_ball.match_id = match.match_id
    WHERE match.season_year = $1
    GROUP BY ball_by_ball.match_id, innings_no, over_id
    ) AS sq1
  ) AS sq2;
`;

module.exports = {
  team_list,
  points,
  nrr,
}
