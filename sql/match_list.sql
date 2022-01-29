select 
    match_id, season_year, 
    match.team1 as team1_id, match.team2 as team2_id, match.match_winner as winner_id,
    t1.team_name as team1_name, t2.team_name as team2_name, 
    venue.venue_name, venue.city_name 
from 
match left outer join venue on match.venue_id = venue.venue_id
left outer join team as t1 on match.team1 = t1.team_id
left outer join team as t2 on match.team2 = t2.team_id
order by season_year asc, match_id asc
limit 10 offset 0; -- replace 0 by 10*$1 later