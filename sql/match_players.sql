select player_name from player_match
left outer join player on player_match.player_id = player.player_id
where match_id = 501203 and team_id = 3
order by player_name; 