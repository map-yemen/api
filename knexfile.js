// Update with your config settings.
const config = require('./local.js');
module.exports = {
  development: {
    client: 'pg',
    connection: config.pg_conn_string,
    migrations: {
      tableName: 'migrations'
    }
  }
};
