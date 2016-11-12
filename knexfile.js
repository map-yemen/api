var path = require('path');
// Update with your config settings.
module.exports = {
  test: {
    client: 'pg',
    connection: 'postgres://localhost/map_egypt_test',
    migrations: {
      directory: path.join(__dirname, '/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '/seeds')
    }
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      tableName: 'migrations'
    },
    debug: true
  }
};
