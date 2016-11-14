const test = require('ava');

const server = require('../../server');
const db = require('../../db');
const uuid = require('../fixtures/uuid');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
  return db('projects').insert({
    id: uuid.delete,
    name: 'for deleting',
    private: true,
    published: false,
    owner: 'seed',
    data: {}
  });
});

test('delete a project, no token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/projects/${uuid.delete}`
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('delete a project, user token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/projects/${uuid.delete}`,
    credentials: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('delete a non-existent project, admin token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/projects/${uuid.notFound}`,
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 404, 'Status code is 404');
  });
});

test('delete a  project, admin token', t => {
  return server.injectThen({
    method: 'DELETE',
    url: `/projects/${uuid.delete}`,
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.id === uuid.delete,
      'The correct project is returned');
  });
});
