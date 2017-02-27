const Hapi = require('hapi');

const server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: ['*'],
        additionalHeaders: ['x-requested-with', 'accept-language']
      }
    }
  }
});

server.connection({port: process.env.PORT});

server.register(require('hapi-auth-jwt2'), function (err) {
  if (err) console.error(err);
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.AUTH0_SECRET,
    validateFunc: function (decoded, request, callback) {
      callback(null, true);
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
