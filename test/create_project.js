const test = require('ava');

const server = require('../server');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test('create a project, no token', t => {
  return server.injectThen({
    method: 'POST',
    url: '/projects'
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

test('create a project, no data', t => {
  return server.injectThen({
    method: 'POST',
    url: '/projects',
    credentials: {
      sub: 'test',
      roles: ['user']
    }
  }).then((res) => {
    t.is(res.statusCode, 422, 'Status code is 422');
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
    payload: {
      name: 'test'
    }
  }).then((res) => {
    t.is(res.statusCode, 401, 'Status code is 401');
  });
});

// test('create a project, admin token', t => {
//   return server.injectThen({
//     method: 'POST',
//     url: '/projects',
//     credentials: {
//       roles: ['edit']
//     }
//   }).then((res) => {
//     t.is(res.statusCode, 401, 'Status code is 401');
//   });
// });
