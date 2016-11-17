const test = require('ava');

const server = require('../../server');
const db = require('../../db');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test.after(t => {
  return db('indicators').where('owner', 'test').del();
});

test('create an indicator, no token', t => {
  return server.injectThen({
    method: 'POST',
    url: '/indicators'
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('create an indicator, user token', t => {
  return server.injectThen({
    method: 'POST',
    url: '/indicators',
    credentials: {
      sub: 'test',
      roles: ['user']
    },
    payload: {}
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('create an indicator, admin token, no data', t => {
  return server.injectThen({
    method: 'POST',
    url: '/indicators',
    credentials: {
      sub: 'test',
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 422, 'Status code is 422');
  });
});

test.serial('create an indicator, admin token', t => {
  return server.injectThen({
    method: 'POST',
    url: '/indicators',
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

test.serial('create duplicate indicator', t => {
  return server.injectThen({
    method: 'POST',
    url: '/indicators',
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
