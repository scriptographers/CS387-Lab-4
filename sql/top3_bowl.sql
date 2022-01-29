select player_name, wickets, runs_given from
(
    select bowler, sum(runs_scored + extra_runs) as runs_given,
    count(
        case when 
        (out_type <> 'retired hurt') and (out_type <> 'run out') and (out_type is not NULL) 
        then 1 else null end
    ) as wickets
    from ball_by_ball
    where match_id = 501203 and innings_no = 1
    group by bowler
) as sq1
left outer join player on bowler = player_id
where wickets >= 1
order by wickets desc, runs_given asc, player_name asc
limit 3;