const Hapi = require('hapi');

const server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['x-requested-with']
      }
    }
  }
});

server.connection({port: process.env.PORT});

server.register(require('hapi-auth-jwt2'), function (err) {
  if (err) console.error(err);
  server.auth.strategy('jwt', 'jwt', {
    key: new Buffer(process.env.AUTH0_SECRET, 'base64'),
    validateFunc: function (decoded, request, callback) {
      if (decoded) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    verifyOptions: {
      algorithms: ['HS256'],
      audience: process.env.AUTH0_CLIENT_ID
    }
  });

  server.auth.default('jwt');

  server.register({
    register: require('hapi-router'),
    options: {
      cwd: __dirname,
      routes: './routes/**/*.js'
    }
  }, function (err) {
    if (err) console.error(err);
  });
});

module.exports = server;
