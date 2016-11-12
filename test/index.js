const test = require('ava');
// var tokens = require('./fixtures/tokens');
const config = require('../knexfile.js')['test'];
const server = require('../server').server;
const db = require('../server').db;

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test.before(t => {
  return db.migrate.latest(config)
    .then(() => {
      return db.seed.run(config);
    });
});

test('get all projects, no token', t => {
  return server.injectThen('/projects')
    .then((res) => {
      t.is(res.statusCode, 200, 'Status code is 200');
      t.true(res.result.every(project => {
        return project.name === 'public and published';
      }), 'All projects returned are public and published');
    });
});
