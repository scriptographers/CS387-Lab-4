select * from
(
    (
        select * from venue
        where venue_id = 2
    ) as basic
    natural join
    (
        select count(match_id) as total_matches from match
        where venue_id = 2
    ) as match_info
    natural join
    (
        select max(runs) as total_high, min(runs) as total_low from
        (
            select match_id, sum(runs_scored + extra_runs) as runs 
            from ball_by_ball
            group by match_id
        ) as sq1
        left outer join match on match.match_id = sq1.match_id
        where venue_id = 2
    ) as minmax_runs
    natural join
    (
        select max(runs) as highest_chased from
        (
            select match_id, sum(runs_scored + extra_runs) as runs 
            from ball_by_ball
            where innings_no = 2
            group by match_id
        ) as sq1
        left outer join match on match.match_id = sq1.match_id
        where venue_id = 2
    ) as chase
) as mq;