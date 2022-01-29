select player_name as bowler, balls_bowled, runs_given, wickets from
(
    select 
        bowler, 
        sum(runs_scored + extra_runs) as runs_given, 
        count(ball_id) as balls_bowled,
        count(
            case when 
            (out_type <> 'retired hurt') and (out_type <> 'run out') and (out_type is not NULL) 
            then 1 else null end
        ) as wickets
    from ball_by_ball 
    where match_id = 501204 and innings_no = 1 -- change these accordingly
    group by bowler
) as sq1
left outer join player on bowler = player_id
order by player_name;