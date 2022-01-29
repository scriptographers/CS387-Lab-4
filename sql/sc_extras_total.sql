select 
    sum(extra_runs) as extras, 
    sum(runs_scored + extra_runs) as total,
    count(out_type) as wickets
from ball_by_ball
where match_id = 501203 and innings_no = 1; -- change these accordingly