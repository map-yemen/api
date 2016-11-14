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
  return db('projects').where('id', uuid.public.draft).update({
    data: {},
    updated_at: null
  });
});

test('update a non-existent task, no token', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/projects/${uuid.notFound}`,
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('update a non-existent task, user token', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/projects/${uuid.notFound}`,
    credentials: {},
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('update a non-existent task, admin token', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/projects/${uuid.notFound}`,
    credentials: {
      roles: ['edit']
    },
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 404, 'Status code is 404');
  });
});

test('update a task, no payload', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/projects/${uuid.public.draft}`,
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 422, 'Status code is 422');
  });
});

test('update a task, correctly', t => {
  return server.injectThen({
    method: 'PUT',
    url: `/projects/${uuid.public.draft}`,
    credentials: {
      roles: ['edit']
    },
    payload: {
      field: 'data'
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.id === uuid.public.draft,
      'The correct project is returned');
  });
});
