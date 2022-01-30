-- runs, fours, sixes, strike rate, average
select *, 
    round(100.0*((total_runs*1.0)/total_balls), 2) as strike_rate,
    round((total_runs*1.0)/total_out, 2) as average 
from(
    select
        coalesce(count(match_id), 0) as total_matches,
        sum(runs_per_match) as total_runs,
        sum(balls_per_match) as total_balls,
        sum(fours_per_match) as fours,
        sum(sixes_per_match) as sixes,
        sum(out_per_match) as total_out,
        coalesce(count(case when runs_per_match >= 50 then 1 else null end), 0) as fifties,
        max(runs_per_match) as hs
    from
    (
        select
            match_id,
            coalesce(sum(runs_scored), 0) as runs_per_match,
            coalesce(count(ball_id), 0) as balls_per_match,
            coalesce(sum(case when runs_scored = 4 then 4 else null end), 0) as fours_per_match,
            coalesce(sum(case when runs_scored = 6 then 6 else null end), 0) as sixes_per_match,
            coalesce(count(out_type), 0) as out_per_match
        from ball_by_ball
        where striker = 8
        group by match_id, innings_no
    ) as sq1
) as sq2; 