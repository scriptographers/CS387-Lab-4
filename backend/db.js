const pool = require('./pool');
const queries = require('./queries');

const match_list = (req, res) => {
  size = req.query['size'] ? parseInt(req.query['size']) : 10;
  offset = req.query['offset'] ? parseInt(req.query['offset']) : 0;

  pool.query(queries.match_list, [size, offset], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
};

module.exports = { match_list };
