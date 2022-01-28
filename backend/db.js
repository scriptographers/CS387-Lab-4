const pool = require('./pool');
const queries = require('./queries');

const match_list = (req, res) => {
  limit = req.query['limit'] ? parseInt(req.query['limit']) : 10;
  skip = req.query['skip'] ? parseInt(req.query['skip']) : 0;

  pool.query(queries.match_list, [limit, skip * limit], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

module.exports = { match_list };
