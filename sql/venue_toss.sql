select 
    count(match_id) as matches,
    count(case when win_type = 'runs' then 1 else null end) as bat,
    count(case when win_type = 'wickets' then 1 else null end) as bowl,
    count(case when win_type is null then 1 else null end) as ties
from match
where venue_id = 1;