const test = require('ava');

const server = require('../../server');
const db = require('../../db');
const uuid = require('../fixtures/uuid');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
  return db('indicators').insert({
    id: uuid.delete,
    name: 'for deleting',
    private: true,
    published: false,
    owner: 'seed',
    data: {}
  });
});

test('delete an indicator, no token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/indicators/${uuid.delete}`
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('delete an indicator, user token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/indicators/${uuid.delete}`,
    // empty credentials auhthenticate the request with no additional permissions
    credentials: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('delete a non-existent indicator, admin token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/indicators/${uuid.notFound}`,
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 404, 'Status code is 404');
  });
});

test('delete an indicator, admin token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/indicators/${uuid.delete}`,
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.id === uuid.delete,
      'The correct indicator is returned');
  });
});
