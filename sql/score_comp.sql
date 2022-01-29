select sum(runs_scored + extra_runs) as runs, count(out_type) as wickets 
from ball_by_ball
where match_id = 501203 and innings_no = 1
group by over_id
order by over_id;