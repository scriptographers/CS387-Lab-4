select player_name from
(
    select striker, sum(runs_scored) as runs, count(ball_id) as balls 
    from ball_by_ball
    where match_id = 501203 and innings_no = 1
    group by striker
) as sq1
left outer join player on striker = player_id
where balls >= 1
order by runs desc, balls asc, player_name asc
limit 3;