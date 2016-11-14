const test = require('ava');

const server = require('../server');

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
        return project.name === 'public and published';
      }), 'All projects returned are public and published');
    });
});

test('get all projects, user token', t => {
  return server.injectThen({
    method: 'GET',
    url: '/projects',
    credentials: {}
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.every(project => {
      return /published/.test(project.name);
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
