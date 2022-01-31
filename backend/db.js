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
}

const match = {
  match_list: (req, res) => {
    size = req.query['size'] ? parseInt(req.query['size']) : 10;
    offset = req.query['offset'] ? parseInt(req.query['offset']) : 0;
    pool.query(query.match.match_list, [size, offset], handler.bind(null, res));
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
}

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
}

module.exports = {
  match,
  innings
};
