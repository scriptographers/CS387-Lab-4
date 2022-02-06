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
  match_list: (req, res) => {
    pool.query(query.match.match_list, handler.bind(null, res));
  },

  match_info: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    pool.query(query.match.match_info, [match_id], handler.bind(null, res));
  },

  match_players: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    team_id = req.query['team_id'] ? parseInt(req.query['team_id']) : 0;
    pool.query(query.match.match_players, [match_id, team_id], handler.bind(null, res));
  },

  match_umpires: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    pool.query(query.match.match_umpires, [match_id], handler.bind(null, res));
  },
};

const innings = {
  batting: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_id = req.query['innings_id'] ? parseInt(req.query['innings_id']) : 1;
    pool.query(query.innings.batting, [match_id, innings_id], handler.bind(null, res));
  },

  bowling: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_id = req.query['innings_id'] ? parseInt(req.query['innings_id']) : 1;
    pool.query(query.innings.bowling, [match_id, innings_id], handler.bind(null, res));
  },

  extras: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_id = req.query['innings_id'] ? parseInt(req.query['innings_id']) : 1;
    pool.query(query.innings.extras, [match_id, innings_id], handler.bind(null, res));
  },

  overs_breakup: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_id = req.query['innings_id'] ? parseInt(req.query['innings_id']) : 1;
    pool.query(query.innings.overs_breakup, [match_id, innings_id], handler.bind(null, res));
  },

  top3_bat: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_id = req.query['innings_id'] ? parseInt(req.query['innings_id']) : 1;
    pool.query(query.innings.top3_bat, [match_id, innings_id], handler.bind(null, res));
  },

  top3_bowl: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_id = req.query['innings_id'] ? parseInt(req.query['innings_id']) : 1;
    pool.query(query.innings.top3_bowl, [match_id, innings_id], handler.bind(null, res));
  },

  runs_breakup: (req, res) => {
    match_id = req.query['match_id'] ? parseInt(req.query['match_id']) : 0;
    innings_id = req.query['innings_id'] ? parseInt(req.query['innings_id']) : 1;
    pool.query(query.innings.runs_breakup, [match_id, innings_id], handler.bind(null, res));
  }
};

const player = {
  player_info: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.player_info, [player_id], handler.bind(null, res));
  },

  bat_stat: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.bat_stat, [player_id], handler.bind(null, res));
  },

  bowl_stat: (req, res) => {
    player_id = req.query['player_id'] ? parseInt(req.query['player_id']) : 0;
    pool.query(query.player.bowl_stat, [player_id], handler.bind(null, res));
  }
};

const ptable = {
  team_list: (req, res) => {
    pool.query(query.ptable.team_list, handler.bind(null, res));
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
  venue_list: (req, res) => {
    pool.query(query.venue.venue_list, handler.bind(null, res));
  },

  venue_basic: (req, res) => {
    venue_id = req.query['venue_id'] ? parseInt(req.query['venue_id']) : 0;
    pool.query(query.venue.venue_basic, [venue_id], handler.bind(null, res));
  },

  venue_win: (req, res) => {
    venue_id = req.query['venue_id'] ? parseInt(req.query['venue_id']) : 0;
    pool.query(query.venue.venue_win, [venue_id], handler.bind(null, res));
  },

  first_inn: (req, res) => {
    venue_id = req.query['venue_id'] ? parseInt(req.query['venue_id']) : 0;
    pool.query(query.venue.first_inn, [venue_id], handler.bind(null, res));
  },

  venue_add: (req, res) => {
    venue_name = req.body['name'];
    city = req.body['city'];
    country = req.body['country'];
    capacity = req.body['capacity'];
    pool.query(query.venue.venue_add, [venue_name, city, country, capacity], handler.bind(null, res));
  }
};

module.exports = {
  match,
  innings,
  player,
  ptable,
  venue
};
