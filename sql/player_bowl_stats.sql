select *, round((1.0*total_runs)/(total_overs), 2) as economy from 
(
    select 
        coalesce(count(match_id), 0) as total_matches,
        sum(runs_per_match) as total_runs,
        sum(wickets_per_match) as total_wickets,
        sum(overs_per_match) as total_overs,
        sum(balls_per_match) as total_balls,
        coalesce(count(case when wickets_per_match >= 5 then 1 else null end), 0) as five_wickets 
    from
    (
        select
            match_id,
            coalesce(count(
                case when 
                (out_type <> 'retired hurt') and (out_type <> 'run out') and (out_type is not NULL) 
                then 1 else null end
            ), 0) as wickets_per_match,
            coalesce(sum(runs_scored + extra_runs), 0) as runs_per_match,
            coalesce(count(ball_id), 0) as balls_per_match,
            coalesce(count(distinct over_id), 0) as overs_per_match
        from ball_by_ball
        where bowler = 9
        group by match_id, innings_no
    ) as sq1
) as sq2;