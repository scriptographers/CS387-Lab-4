select season_year, round(avg(runs), 2) as avg_1st from
(
    select match_id, sum(runs_scored + extra_runs) as runs 
    from ball_by_ball
    where innings_no = 1
    group by match_id, innings_no
) as sq1
left outer join match on match.match_id = sq1.match_id
where venue_id = 1
group by season_year;