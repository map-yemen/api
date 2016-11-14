const test = require('ava');

const server = require('../../server');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test('get all indicators, no token', t => {
  return server.injectThen('/indicators')
    .then((res) => {
      t.is(res.statusCode, 200, 'Status code is 200');
      t.true(res.result.every(indicator => {
        return indicator.name === 'public and published';
      }), 'All indicators returned are public and published');
    });
});

test('get all indicators, user token', t => {
  return server.injectThen({
    method: 'GET',
    url: '/indicators',
    credentials: {}
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.every(indicator => {
      return /published/.test(indicator.name);
    }), 'All indicators returned are published');
    t.true(res.result.some(indicator => {
      return indicator.private;
    }), 'At least one indicator returned is private');
  });
});

test('get all indicators, admin token', t => {
  return server.injectThen({
    method: 'GET',
    url: '/indicators',
    credentials: {
      roles: ['edit']
    }
  }).then((res) => {
    t.is(res.statusCode, 200, 'Status code is 200');
    t.true(res.result.some(indicator => {
      return indicator.private;
    }), 'At least one indicator returned is private');
    t.true(res.result.some(indicator => {
      return !indicator.published;
    }), 'At least one indicator returned is a draft');
  });
});
