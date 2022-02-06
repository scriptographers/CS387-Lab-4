// Player Info
const player_info = `
SELECT player_name,
  country_name,
  batting_hand,
  bowling_skill
FROM player
WHERE player_id = $1;
`;

// Batting stats
const bat_stat = `
SELECT *,
  round((total_runs * 100.0) / coalesce(nullif(total_balls, 0), 1), 2) AS strike_rate,
  round((total_runs * 1.0) / coalesce(nullif(total_out, 0), 1), 2) AS average
FROM (
  SELECT count(match_id) AS total_matches,
    coalesce(sum(runs_per_match), 0) AS total_runs,
    coalesce(sum(balls_per_match), 0) AS total_balls,
    coalesce(sum(fours_per_match), 0) AS fours,
    coalesce(sum(sixes_per_match), 0) AS sixes,
    coalesce(sum(out_per_match), 0) AS total_out,
    count(CASE WHEN runs_per_match >= 50 AND runs_per_match < 100 THEN 1 ELSE NULL END) AS fifties,
    count(CASE WHEN runs_per_match >= 100 THEN 1 ELSE NULL END) AS hundreds,
    coalesce(max(runs_per_match), 0) AS hs
  FROM (
    SELECT match_id,
      coalesce(sum(runs_scored), 0) AS runs_per_match,
      count(ball_id) AS balls_per_match,
      count(CASE WHEN runs_scored = 4 THEN 1 ELSE NULL END) AS fours_per_match,
      count(CASE WHEN runs_scored = 6 THEN 1 ELSE NULL END) AS sixes_per_match,
      count(out_type) AS out_per_match
    FROM ball_by_ball
    WHERE striker = $1
    GROUP BY match_id
    ) AS sq1
  ) AS sq2;
`;

// Bowling stats
const bowl_stat = `
SELECT *,
  round((total_runs * 1.0) / coalesce(nullif(total_overs, 0), 1), 2) AS economy
FROM (
  SELECT count(match_id) AS total_matches,
    coalesce(sum(runs_per_match), 0) AS total_runs,
    coalesce(sum(wickets_per_match), 0) AS total_wickets,
    coalesce(sum(overs_per_match), 0) AS total_overs,
    coalesce(sum(balls_per_match), 0) AS total_balls,
    count(CASE WHEN wickets_per_match >= 5 THEN 1 ELSE NULL END) AS five_wickets
  FROM (
    SELECT match_id,
      count(CASE WHEN (out_type NOT IN ('retired hurt', 'run out')) AND (out_type IS NOT NULL) THEN 1 ELSE NULL END) AS wickets_per_match,
      coalesce(sum(runs_scored + extra_runs), 0) AS runs_per_match,
      count(ball_id) AS balls_per_match,
      count(DISTINCT over_id) AS overs_per_match
    FROM ball_by_ball
    WHERE bowler = $1
    GROUP BY match_id
    ) AS sq1
  ) AS sq2;
`;

// Batting stat per match
const bat_per_match = `
SELECT match_id,
  coalesce(sum(runs_scored), 0) AS runs_per_match
FROM ball_by_ball
WHERE striker = $1
GROUP BY match_id, innings_no
ORDER BY match_id;
`;

// Bowling stat per match
const bowl_per_match = `
SELECT match_id,
  count(CASE WHEN (out_type NOT IN ('retired hurt', 'run out')) AND (out_type IS NOT NULL) THEN 1 ELSE NULL END) AS wickets_per_match,
  coalesce(sum(runs_scored + extra_runs), 0) AS runs_per_match
FROM ball_by_ball
WHERE bowler = $1
GROUP BY match_id, innings_no
ORDER BY match_id;
`;


module.exports = {
  player_info,
  bat_stat,
  bowl_stat,
  bat_per_match,
  bowl_per_match
};
