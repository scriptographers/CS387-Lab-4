select
    coalesce(sum(case when runs_scored = 1 then 1 else null end), 0) as ones,
    coalesce(sum(case when runs_scored = 2 then 2 else null end), 0) as twos,
    coalesce(sum(case when runs_scored = 3 then 3 else null end), 0) as threes,
    coalesce(sum(case when runs_scored = 4 then 4 else null end), 0) as fours,
    coalesce(sum(case when runs_scored = 5 then 5 else null end), 0) as fives,
    coalesce(sum(case when runs_scored = 6 then 6 else null end), 0) as sixes,
    coalesce(sum(extra_runs), 0) as extras
from ball_by_ball
where match_id = 501203 and innings_no = 1; 