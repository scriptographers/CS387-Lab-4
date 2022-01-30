select
    match_id,
    coalesce(sum(runs_scored), 0) as runs
from ball_by_ball
where striker = 8
group by match_id, innings_no
order by match_id;