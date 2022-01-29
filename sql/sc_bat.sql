select player_name as batter, runs, fours, sixes, balls from
(
    select 
        striker, 
        sum(runs_scored) as runs, 
        count(ball_id) as balls,
        count(case when runs_scored = 4 then 1 else null end) as fours,
        count(case when runs_scored = 6 then 1 else null end) as sixes
    from ball_by_ball 
    where match_id = 501203 and innings_no = 1 -- change these accordingly
    group by striker
) as sq1
left outer join player on striker = player_id
order by player_name;
