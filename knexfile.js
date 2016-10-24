// Update with your config settings.
module.exports = {
  development: {
    client: 'pg',
    connection: process.env.pg_conn_string,
    migrations: {
      tableName: 'migrations'
    }
  }
};
