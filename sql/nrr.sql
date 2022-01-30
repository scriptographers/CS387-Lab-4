select *, round((1.0*runs_by_team)/(overs_by_team) - (1.0*runs_against_team)/(overs_against_team), 2) as nrr from
(

    (
        select 
            sum(runs_per_over) as runs_by_team, count(*) as overs_by_team 
        from
        ( 
            select sum(runs_scored) as runs_per_over
            from ball_by_ball
            left outer join player_match as batting 
            on ball_by_ball.match_id = batting.match_id and ball_by_ball.striker = batting.player_id
            left outer join player_match as bowling 
            on ball_by_ball.match_id = bowling.match_id and ball_by_ball.bowler = bowling.player_id
            where batting.team_id = 1
            group by ball_by_ball.match_id, innings_no, over_id
        ) as sq1
    ) as sq3

    natural join 

    (
        select sum(runs_per_over) as runs_against_team, count(*) as overs_against_team from
        ( 
            select sum(runs_scored) as runs_per_over
            from ball_by_ball
            left outer join player_match as batting 
            on ball_by_ball.match_id = batting.match_id and ball_by_ball.striker = batting.player_id
            left outer join player_match as bowling 
            on ball_by_ball.match_id = bowling.match_id and ball_by_ball.bowler = bowling.player_id
            where bowling.team_id = 1
            group by ball_by_ball.match_id, innings_no, over_id
        ) as sq2
    ) as sq4

) as sq5;