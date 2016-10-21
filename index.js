const auth_config = require('./local.js');
const Hapi = require('hapi');
const server = new Hapi.Server({
  connections: {
    routes: {
      cors: true    
    }
  }
});

server.connection({port: 3999});

server.register(require('hapi-auth-jwt2'), function (err) {
  server.auth.strategy('jwt', 'jwt', {
    key: new Buffer(auth_config.auth0_secret, 'base64') ,
    validateFunc: function (decoded, request, callback) {
      if (decoded) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    verifyOptions: {
      algorithms: ['HS256'],
      audience: auth_config.auth0_client_id
    }
  });

  server.auth.default('jwt');

  server.route({
    method: 'GET',
    path: '/',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      res('You used a token').header("Authorization", req.headers.authorization);
    }
  });
});



server.start((err) => {
  if (err) { throw err}
  console.log(`Server running at: ${server.info.uri}`);
});

