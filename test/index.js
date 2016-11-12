var test = require('ava');
// var tokens = require('./fixtures/tokens');
var server = require('../');

test.before(t => {
  server.register(require('inject-then'), function (err) {
    if (err) throw err;
  });
});

test('get all projects', t => {
  return server.injectThen('/projects')
    .then((res) => {
      console.log(res);
      t.fail();
    });
});
