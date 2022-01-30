select *, round((1.0*runs_by_team)/(overs_by_team) - (1.0*runs_against_team)/(overs_against_team), 2) as nrr from
(
        select 
            sum(runs_by_over) as runs_by_team, 
            count(case when overs_by = 0 then null else 1 end) as overs_by_team,
            sum(runs_against_over) as runs_against_team, 
            count(case when overs_against = 0 then null else 1 end) as overs_against_team 
        from
        ( 
            select 
                sum(case when batting.team_id = 1 then runs_scored else 0 end) as runs_by_over,
                sum(case when bowling.team_id = 1 then runs_scored else 0 end) as runs_against_over,
                count(case when batting.team_id = 1 then 1 else null end) as overs_by,
                count(case when bowling.team_id = 1 then 1 else null end) as overs_against
            from ball_by_ball
            left outer join player_match as batting 
            on ball_by_ball.match_id = batting.match_id and ball_by_ball.striker = batting.player_id
            left outer join player_match as bowling 
            on ball_by_ball.match_id = bowling.match_id and ball_by_ball.bowler = bowling.player_id
            group by ball_by_ball.match_id, innings_no, over_id
        ) as sq1
) as sq2;