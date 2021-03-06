const test = require('ava');

const server = require('../../server');
const seeds = require('../fixtures/seed_data');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test('get all projects, no token', t => {
  return server.injectThen('/projects')
    .then((res) => {
      t.is(res.statusCode, 200, 'Status code is 200');
      t.true(res.result.every(project => {
        return seeds
          .filter(seed => !seed.private && seed.published)
          .find(seed => seed.id === project.id);
      }), 'All projects returned are public and published');
    });
});

test('get all projects, user token', t => {
  return server.injectThen({
    method: 'GET',
    url: '/projects',
    // empty credentials authenticate the request with no additional permissions
    credentials: {}
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.every(project => {
      return seeds
        .filter(seed => seed.published)
        .find(seed => seed.id === project.id);
    }), 'All projects returned are published');
    t.true(res.result.some(project => {
      return project.private;
    }), 'At least one project returned is private');
  });
});

test('get all projects, admin token', t => {
  return server.injectThen({
    method: 'GET',
    url: '/projects',
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.some(project => {
      return project.private;
    }), 'At least one project returned is private');
    t.true(res.result.some(project => {
      return !project.published;
    }), 'At least one project returned is a draft');
  });
});
