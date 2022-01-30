select team_name, win_type, win_margin
from match left outer join team on match_winner = team_id
where match_id = 501208;