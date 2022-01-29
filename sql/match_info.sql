select 
    match_id, venue_name, 
    t1.team_name as team1_name, t2.team_name as team2_name, 
    season_year, t3.team_name as toss_winner_name, toss_name
from match
left outer join venue on match.venue_id = venue.venue_id
left outer join team as t1 on match.team1 = t1.team_id
left outer join team as t2 on match.team2 = t2.team_id
left outer join team as t3 on match.toss_winner = t3.team_id
where match_id = 501203;