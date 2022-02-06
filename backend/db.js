const pool = require('./pool');
const query = require('./query');

const handler = (res, error, results) => {
  if (error) {
    res.status(400).send({
      message: error
    })
  }
  else {
    res.status(200).json(results.rows);
  }
};

const match = {
  list: (req, res) => {
    pool.query(query.match.list, handler.bind(null, res));
  },

  info: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    pool.query(query.match.info, [match_id], handler.bind(null, res));
  },

  players: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    team_id = req.query['team_id'] ? parseInt(req.query['team_id']) : 0;
    pool.query(query.match.players, [match_id, team_id], handler.bind(null, res));
  },

  umpires: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    pool.query(query.match.umpires, [match_id], handler.bind(null, res));
  },
};

const innings = {
  bat: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_no = req.query['innings_no'] ? parseInt(req.query['innings_no']) : 1;
    pool.query(query.innings.bat, [match_id, innings_no], handler.bind(null, res));
  },

  bowl: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_no = req.query['innings_no'] ? parseInt(req.query['innings_no']) : 1;
    pool.query(query.innings.bowl, [match_id, innings_no], handler.bind(null, res));
  },

  extras: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_no = req.query['innings_no'] ? parseInt(req.query['innings_no']) : 1;
    pool.query(query.innings.extras, [match_id, innings_no], handler.bind(null, res));
  },

  overs_breakup: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_no = req.query['innings_no'] ? parseInt(req.query['innings_no']) : 1;
    pool.query(query.innings.overs_breakup, [match_id, innings_no], handler.bind(null, res));
  },

  top3_bat: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_no = req.query['innings_no'] ? parseInt(req.query['innings_no']) : 1;
    pool.query(query.innings.top3_bat, [match_id, innings_no], handler.bind(null, res));
  },

  top3_bowl: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_no = req.query['innings_no'] ? parseInt(req.query['innings_no']) : 1;
    pool.query(query.innings.top3_bowl, [match_id, innings_no], handler.bind(null, res));
  },

  runs_breakup: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_no = req.query['innings_no'] ? parseInt(req.query['innings_no']) : 1;
    pool.query(query.innings.runs_breakup, [match_id, innings_no], handler.bind(null, res));
  }
};

const player = {
  info: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.info, [player_id], handler.bind(null, res));
  },

  bat_stat: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.bat_stat, [player_id], handler.bind(null, res));
  },

  bowl_stat: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.bowl_stat, [player_id], handler.bind(null, res));
  },

  bat_per_match: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.bat_per_match, [player_id], handler.bind(null, res));
  },

  bowl_per_match: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.bowl_per_match, [player_id], handler.bind(null, res));
  }
};

const ptable = {
  list: (req, res) => {
    pool.query(query.ptable.list, handler.bind(null, res));
  },

  points: (req, res) => {
    season_year = req.query['season_year'] ? parseInt(req.query['season_year']) : 0;
    team_id = req.query['team_id'] ? parseInt(req.query['team_id']) : 0;
    pool.query(query.ptable.points, [season_year, team_id], handler.bind(null, res));
  },

  nrr: (req, res) => {
    season_year = req.query['season_year'] ? parseInt(req.query['season_year']) : 0;
    team_id = req.query['team_id'] ? parseInt(req.query['team_id']) : 0;
    pool.query(query.ptable.nrr, [season_year, team_id], handler.bind(null, res));
  }
};

const venue = {
  list: (req, res) => {
    pool.query(query.venue.list, handler.bind(null, res));
  },

  basic: (req, res) => {
    venue_id = req.query['venue_id'] ? parseInt(req.query['venue_id']) : 0;
    pool.query(query.venue.basic, [venue_id], handler.bind(null, res));
  },

  win_stat: (req, res) => {
    venue_id = req.query['venue_id'] ? parseInt(req.query['venue_id']) : 0;
    pool.query(query.venue.win_stat, [venue_id], handler.bind(null, res));
  },

  first_inn: (req, res) => {
    venue_id = req.query['venue_id'] ? parseInt(req.query['venue_id']) : 0;
    pool.query(query.venue.first_inn, [venue_id], handler.bind(null, res));
  },

  add: (req, res) => {
    venue_name = req.body['name'];
    city = req.body['city'];
    country = req.body['country'];
    capacity = req.body['capacity'];
    pool.query(query.venue.add, [venue_name, city, country, capacity], handler.bind(null, res));
  }
};

module.exports = {
  match,
  innings,
  player,
  ptable,
  venue
};
