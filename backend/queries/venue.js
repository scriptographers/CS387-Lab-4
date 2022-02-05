// Venue List
const venue_list = `
SELECT venue_id,
  venue_name
FROM venue
ORDER BY venue_name ASC;
`;

// Venue Basic Stats
const venue_basic = `
SELECT * FROM
(
    (
        SELECT * FROM venue
        WHERE venue_id = $1
    ) AS basic
    NATURAL JOIN
    (
        SELECT count(match_id) AS total_matches FROM match
        WHERE venue_id = $1
    ) AS match_info
    NATURAL JOIN
    (
        SELECT max(runs) AS total_high, min(runs) AS total_low FROM
        (
            SELECT match_id, sum(runs_scored + extra_runs) AS runs
            FROM ball_by_ball
            GROUP BY match_id, innings_no
        ) AS sq1
        LEFT OUTER JOIN match ON match.match_id = sq1.match_id
        WHERE venue_id = $1
    ) AS minmax_runs
    NATURAL JOIN
    (
        SELECT max(runs) AS highest_chased FROM
        (
            SELECT match_id, sum(runs_scored + extra_runs) AS runs
            FROM ball_by_ball
            WHERE innings_no = 2
            GROUP BY match_id
        ) AS sq1
        LEFT OUTER JOIN match ON match.match_id = sq1.match_id
        WHERE venue_id = $1
    ) AS chase
) AS mq;
`;

// Venue Win Stats
const venue_win = `
SELECT count(match_id) AS matches,
  count(CASE WHEN win_type = 'runs' THEN 1 ELSE NULL END) AS bat,
  count(CASE WHEN win_type = 'wickets' THEN 1 ELSE NULL END) AS bowl,
  count(CASE WHEN win_type IS NULL THEN 1 ELSE NULL END) AS ties
FROM match
WHERE venue_id = $1;
`;

const first_inn = `
SELECT season_year,
  round(avg(runs), 2) AS avg_1st
FROM (
  SELECT match_id,
    sum(runs_scored + extra_runs) AS runs
  FROM ball_by_ball
  WHERE innings_no = 1
  GROUP BY match_id, innings_no
  ) AS sq1
LEFT OUTER JOIN match ON match.match_id = sq1.match_id
WHERE venue_id = $1
GROUP BY season_year;
`;

const venue_add = `
INSERT INTO venue (venue_name, city_name, country_name, capacity)
VALUES ($1, $2, $3, $4);
`;

module.exports = {
    venue_list,
    venue_basic,
    venue_win,
    first_inn,
    venue_add
};
