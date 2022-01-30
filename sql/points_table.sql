-- do for loop + sort at the backend

-- basic info for a team
select matches, wins, matches - wins - ties as losses, ties, 2*wins as points from
(
    select
        coalesce(count(match_id), 0) as matches,
        coalesce(count(case when match_winner = 3 then 1 else null end), 0) as wins,
        coalesce(count(case when win_type is null then 1 else null end), 0) as ties
    from match
    where team1 = 3 or team2 = 3
) as sq1;

