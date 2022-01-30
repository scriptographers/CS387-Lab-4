// Scorecard data
const batting = `
SELECT player_name AS batter,
  runs,
  fours,
  sixes,
  balls
FROM (
  SELECT striker,
    sum(runs_scored) AS runs,
    count(ball_id) AS balls,
    count(CASE WHEN runs_scored = 4 THEN 1 ELSE NULL END) AS fours,
    count(CASE WHEN runs_scored = 6 THEN 1 ELSE NULL END) AS sixes
  FROM ball_by_ball
  WHERE match_id = $1 AND innings_no = $2
  GROUP BY striker
  ) AS sq1
LEFT OUTER JOIN player ON striker = player_id
ORDER BY player_name;
`;

const bowling = `
SELECT player_name AS bowler,
  balls_bowled,
  runs_given,
  wickets
FROM (
  SELECT bowler,
    sum(runs_scored + extra_runs) AS runs_given,
    count(ball_id) AS balls_bowled,
    count(CASE WHEN (out_type NOT IN ('retired hurt', 'run out') AND (out_type IS NOT NULL) THEN 1 ELSE NULL END) AS wickets
  FROM ball_by_ball
  WHERE match_id = $1 AND innings_no = $2
  GROUP BY bowler
  ) AS sq1
LEFT OUTER JOIN player ON bowler = player_id
ORDER BY player_name;
`;

const extras = `
SELECT sum(extra_runs) AS extras,
  sum(runs_scored + extra_runs) AS total,
  count(out_type) AS wickets
FROM ball_by_ball
WHERE match_id = $1 AND innings_no = $2;
`;

// Score comparison data
const overs_breakup = `
SELECT sum(runs_scored + extra_runs) AS runs,
  count(out_type) AS wickets
FROM ball_by_ball
WHERE match_id = $1 AND innings_no = $2
GROUP BY over_id
ORDER BY over_id;
`;

// Match summary data
const top3_bat = `
SELECT player_name
FROM (
  SELECT striker, sum(runs_scored) AS runs, count(ball_id) AS balls
    FROM ball_by_ball
    WHERE match_id = $1 AND innings_no = $2
    GROUP BY striker
    ) AS sq1
LEFT OUTER JOIN player ON striker = player_id
WHERE balls >= 1
ORDER BY runs DESC, balls ASC, player_name ASC
LIMIT 3;
`;

const top3_bowl = `
SELECT player_name,
  wickets,
  runs_given
FROM (
  SELECT bowler,
    sum(runs_scored + extra_runs) AS runs_given,
    count(CASE WHEN (out_type NOT IN ('retired hurt', 'run out') AND (out_type IS NOT NULL) THEN 1 ELSE NULL END) AS wickets
  FROM ball_by_ball
  WHERE match_id = $1 AND innings_no = $2
  GROUP BY bowler
  ) AS sq1
LEFT OUTER JOIN player ON bowler = player_id
WHERE wickets >= 1
ORDER BY wickets DESC, runs_given ASC, player_name ASC
LIMIT 3;
`;

const runs_breakup = `
SELECT coalesce(sum(CASE WHEN runs_scored = 1 THEN 1 ELSE NULL END), 0) AS ones,
  coalesce(sum(CASE WHEN runs_scored = 2 THEN 2 ELSE NULL END), 0) AS twos,
  coalesce(sum(CASE WHEN runs_scored = 3 THEN 3 ELSE NULL END), 0) AS threes,
  coalesce(sum(CASE WHEN runs_scored = 4 THEN 4 ELSE NULL END), 0) AS fours,
  coalesce(sum(CASE WHEN runs_scored = 5 THEN 5 ELSE NULL END), 0) AS fives,
  coalesce(sum(CASE WHEN runs_scored = 6 THEN 6 ELSE NULL END), 0) AS sixes,
  coalesce(sum(extra_runs), 0) AS extras
FROM ball_by_ball
WHERE match_id = $1 AND innings_no = $2;
`;

module.exports = {
  batting,
  bowling,
  extras,
  overs_breakup,
  top3_bat,
  top3_bowl,
  runs_breakup
}
