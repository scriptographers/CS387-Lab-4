select umpire_name from umpire_match
left outer join umpire on umpire_match.umpire_id = umpire.umpire_id
where match_id = 501203
order by umpire_name; 