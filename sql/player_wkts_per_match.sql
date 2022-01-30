select
    match_id,
    coalesce(count(
        case when 
        (out_type <> 'retired hurt') and (out_type <> 'run out') and (out_type is not NULL) 
        then 1 else null end
    ), 0) as wickets_per_match,
    coalesce(sum(runs_scored + extra_runs), 0) as runs_per_match
from ball_by_ball
where bowler = 9
group by match_id, innings_no
order by match_id;