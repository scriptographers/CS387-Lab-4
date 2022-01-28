const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'postgres',
  database: 'Lab3A',
  password: 'secret',
  port: 5432,
  host: 'localhost',
});

module.exports = pool;
