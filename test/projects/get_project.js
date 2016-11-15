const test = require('ava');

const server = require('../../server');
const uuid = require('../fixtures/uuid');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test('get a non-existent task, no token', t => {
  return server.injectThen(`/projects/${uuid.notFound}`)
    .then((res) => {
      t.is(res.statusCode, 404, 'Status code is 404');
    });
});

test('get a public and published project, no token', t => {
  return server.injectThen(`/projects/${uuid.public.published}`)
    .then((res) => {
      t.is(res.statusCode, 200, 'Status code is 200');
      t.true(res.result.id === uuid.public.published,
        'The correct project is returned');
    });
});

test('get a private and published project, no token', t => {
  return server.injectThen(`/projects/${uuid.private.published}`)
    .then((res) => {
      t.is(res.statusCode, 401, 'Status code is 401');
    });
});

test('get a public and draft project, no token', t => {
  return server.injectThen(`/projects/${uuid.public.draft}`)
    .then((res) => {
      t.is(res.statusCode, 401, 'Status code is 401');
    });
});

test('get a private and published project, user token', t => {
  return server.injectThen({
    method: 'GET',
    url: `/projects/${uuid.private.published}`,
    // empty credentials authenticate the request with no additional permissions
    credentials: {}
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.id === uuid.private.published,
      'The correct project is returned');
  });
});

test('get a public and draft project, user token', t => {
  return server.injectThen({
    method: 'GET',
    url: `/projects/${uuid.public.draft}`,
    // empty credentials authenticate the request with no additional permissions
    credentials: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('admin can get anything', t => {
  return server.injectThen({
    method: 'GET',
    url: `/projects/${uuid.private.draft}`,
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.id === uuid.private.draft,
      'The correct project is returned');
  });
});
