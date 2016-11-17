const test = require('ava');

const server = require('../../server');
const db = require('../../db');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test.after(t => {
  return db('projects').where('owner', 'test').del();
});

test('create a project, no token', t => {
  return server.injectThen({
    method: 'POST',
    url: '/projects'
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('create a project, user token', t => {
  return server.injectThen({
    method: 'POST',
    url: '/projects',
    credentials: {
      sub: 'test',
      roles: ['user']
    },
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('create a project, admin token, no data', t => {
  return server.injectThen({
    method: 'POST',
    url: '/projects',
    credentials: {
      sub: 'test',
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 422, 'Status code is 422');
  });
});

test.serial('create a project, admin token', t => {
  return server.injectThen({
    method: 'POST',
    url: '/projects',
    credentials: {
      sub: 'test',
      roles: ['edit']
    },
    payload: {
      name: 'test create',
      data: {}
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
  });
});

test.serial('create duplicate project', t => {
  return server.injectThen({
    method: 'POST',
    url: '/projects',
    credentials: {
      sub: 'test',
      roles: ['edit']
    },
    payload: {
      name: 'test create',
      data: {}
    }
  }).then((res) => {
    t.is(res.statusCode, 422, 'Status code is 422');
  });
});
