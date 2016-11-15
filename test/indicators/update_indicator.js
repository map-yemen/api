const test = require('ava');

const server = require('../../server');
const db = require('../../db');
const uuid = require('../fixtures/uuid');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test.after(t => {
  return db('indicators').where('id', uuid.public.draft).update({
    data: {},
    updated_at: null
  });
});

test('update an indicator, no token', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/indicators/${uuid.public.published}`,
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('update an indicator, user token', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/indicators/${uuid.public.published}`,
    // empty credentials auhthenticate the request with no additional permissions
    credentials: {},
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('update a non-existent indicator, admin token', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/indicators/${uuid.notFound}`,
    credentials: {
      roles: ['edit']
    },
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 404, 'Status code is 404');
  });
});

test('update an indicator, no payload', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/indicators/${uuid.public.draft}`,
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 422, 'Status code is 422');
  });
});

test('update an indicator, correctly', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/indicators/${uuid.public.draft}`,
    credentials: {
      roles: ['edit']
    },
    payload: {
      field: 'data'
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.id === uuid.public.draft,
      'The correct indicator is returned');
  });
});
