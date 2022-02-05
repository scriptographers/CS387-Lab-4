DROP TABLE IF EXISTS player,
  umpire,
  team,
  owner,
  venue,
  match,
  player_match,
  umpire_match,
  ball_by_ball;

-- Player Information
CREATE TABLE player (
  player_id INT,
  player_name TEXT,
  dob DATE,
  batting_hand TEXT,
  bowling_skill TEXT,
  country_name TEXT,
  PRIMARY KEY (player_id)
  );

-- Umpire Information
CREATE TABLE umpire (
  umpire_id INT,
  umpire_name TEXT,
  country_name TEXT,
  PRIMARY KEY (umpire_id)
  );

-- Team Information
CREATE TABLE team (
  team_id INT,
  team_name TEXT,
  PRIMARY KEY (team_id)
  );

-- Owner Information
CREATE TABLE owner (
  owner_id INT,
  owner_name TEXT,
  owner_type TEXT,
  team_id INT,
  stake INT CHECK (
    stake BETWEEN 0
      AND 100
    ),
  PRIMARY KEY (owner_id),
  FOREIGN KEY (team_id) REFERENCES team ON DELETE SET NULL
  );

-- Venue Information
CREATE TABLE venue (
  venue_id INT,
  venue_name TEXT,
  city_name TEXT,
  country_name TEXT,
  capacity INT,
  PRIMARY KEY (venue_id)
  );

-- Match Information
CREATE TABLE match (
  match_id INT,
  season_year INT,
  team1 INT,
  team2 INT,
  venue_id INT,
  toss_winner INT,
  match_winner INT,
  toss_name TEXT CHECK (
    toss_name = 'field'
    OR toss_name = 'bat'
    ),
  win_type TEXT CHECK (
    win_type = 'wickets'
    OR win_type = 'runs'
    OR win_type IS NULL
    ),
  man_of_match INT,
  win_margin INT,
  attendance INT,
  PRIMARY KEY (match_id),
  FOREIGN KEY (venue_id) REFERENCES venue ON DELETE SET NULL,
  FOREIGN KEY (team1) REFERENCES team ON DELETE SET NULL,
  FOREIGN KEY (team2) REFERENCES team ON DELETE SET NULL,
  FOREIGN KEY (toss_winner) REFERENCES team ON DELETE SET NULL,
  FOREIGN KEY (match_winner) REFERENCES team ON DELETE SET NULL,
  FOREIGN KEY (man_of_match) REFERENCES player ON DELETE SET NULL
  );

-- Player to Match Relation
CREATE TABLE player_match (
  playermatch_key BIGINT,
  match_id INT,
  player_id INT,
  role_desc TEXT CHECK (
    role_desc = 'Player'
    OR role_desc = 'Keeper'
    OR role_desc = 'CaptainKeeper'
    OR role_desc = 'Captain'
    ),
  team_id INT,
  PRIMARY KEY (playermatch_key),
  FOREIGN KEY (match_id) REFERENCES match ON DELETE SET NULL,
  FOREIGN KEY (player_id) REFERENCES player ON DELETE SET NULL,
  FOREIGN KEY (team_id) REFERENCES team ON DELETE SET NULL
  );

-- Umpire to Match Relation
CREATE TABLE umpire_match (
  umpirematch_key BIGINT,
  match_id INT,
  umpire_id INT,
  role_desc TEXT CHECK (
    role_desc = 'Field'
    OR role_desc = 'Third'
    ),
  PRIMARY KEY (umpirematch_key),
  FOREIGN KEY (match_id) REFERENCES match ON DELETE SET NULL,
  FOREIGN KEY (umpire_id) REFERENCES umpire ON DELETE SET NULL
  );

-- Ball by ball Information
CREATE TABLE ball_by_ball (
  match_id INT,
  innings_no INT CHECK (
    innings_no = 1
    OR innings_no = 2
    ),
  over_id INT,
  ball_id INT,
  runs_scored INT CHECK (
    runs_scored BETWEEN 0
      AND 6
    ),
  extra_runs INT,
  out_type TEXT CHECK (
    out_type = 'caught'
    OR out_type = 'caught and bowled'
    OR out_type = 'bowled'
    OR out_type = 'stumped'
    OR out_type = 'retired hurt'
    OR out_type = 'keeper catch'
    OR out_type = 'lbw'
    OR out_type = 'run out'
    OR out_type = 'hit wicket'
    OR out_type IS NULL
    ),
  striker INT,
  non_striker INT,
  bowler INT,
  PRIMARY KEY (match_id, innings_no, over_id, ball_id),
  FOREIGN KEY (match_id) REFERENCES match ON DELETE SET NULL,
  FOREIGN KEY (striker) REFERENCES player ON DELETE SET NULL,
  FOREIGN KEY (non_striker) REFERENCES player ON DELETE SET NULL,
  FOREIGN KEY (bowler) REFERENCES player ON DELETE SET NULL
  );

-- Total stakes for each team should not exceed 100
DROP FUNCTION IF EXISTS total_stakes();
DROP TRIGGER IF EXISTS total_stakes ON owner;

CREATE FUNCTION total_stakes() RETURNS trigger AS $total_stakes$
BEGIN
  IF NEW.stake > 100 - (SELECT coalesce(sum(owner.stake), 0) FROM owner WHERE owner.team_id = NEW.team_id) THEN
    RAISE EXCEPTION 'Total stakes for each team should not exceed 100';
  END IF;

  RETURN NEW;
END;
$total_stakes$ LANGUAGE plpgsql;

CREATE TRIGGER total_stakes
  BEFORE INSERT
  ON owner
  FOR EACH ROW
  EXECUTE PROCEDURE total_stakes();

-- Attendance in a match should not exceed the capacity of the venue
DROP FUNCTION IF EXISTS attendance_capacity();
DROP TRIGGER IF EXISTS attendance_capacity ON match;

CREATE FUNCTION attendance_capacity() RETURNS trigger AS $attendance_capacity$
BEGIN
  IF NEW.attendance > (SELECT capacity FROM venue WHERE venue.venue_id = NEW.venue_id) THEN
    RAISE EXCEPTION 'Attendance in a match should not exceed the capacity of the venue';
  END IF;

  RETURN NEW;
END;
$attendance_capacity$ LANGUAGE plpgsql;

CREATE TRIGGER attendance_capacity
  BEFORE INSERT
  ON match
  FOR EACH ROW
  EXECUTE PROCEDURE attendance_capacity();

-- At most two Field umpire and one Third umpire per match
DROP FUNCTION IF EXISTS umpire_count();
DROP TRIGGER IF EXISTS umpire_count ON umpire_match;

CREATE FUNCTION umpire_count() RETURNS trigger AS $umpire_count$
DECLARE
  num INT;
BEGIN
  num := (SELECT count(*) FROM umpire_match AS um WHERE um.match_id = NEW.match_id AND um.role_desc = NEW.role_desc);

  IF NEW.role_desc = 'Field' AND num >= 2 THEN
    RAISE EXCEPTION 'At most two Field umpire per match';
  END IF;

  IF NEW.role_desc = 'Third' AND num >= 1 THEN
    RAISE EXCEPTION 'At most one Third umpire per match';
  END IF;

  RETURN NEW;
END;
$umpire_count$ LANGUAGE plpgsql;

CREATE TRIGGER umpire_count
  BEFORE INSERT
  ON umpire_match
  FOR EACH ROW
  EXECUTE PROCEDURE umpire_count();

DROP SEQUENCE IF EXISTS venue_id_seq;
CREATE SEQUENCE venue_id_seq START WITH 1 INCREMENT BY 1;
ALTER TABLE venue ALTER venue_id SET DEFAULT nextval('venue_id_seq');
