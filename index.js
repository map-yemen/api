const Hapi = require('hapi');
const Boom = require('boom');

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

const db = require('knex')({
  client: 'pg',
  connection: process.env.pg_conn_string,
  migrations: {
    tableName: 'migrations'
  }
});

server.connection({port: process.env.port});

server.register(require('hapi-auth-jwt2'), function (err) {
  server.auth.strategy('jwt', 'jwt', {
    key: new Buffer(process.env.auth0_secret, 'base64') ,
    validateFunc: function (decoded, request, callback) {
      if (decoded) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    verifyOptions: {
      algorithms: ['HS256'],
      audience: process.env.auth0_client_id
    }
  });

  server.auth.default('jwt');

  /* Get all projects */
  server.route({
    method: 'GET',
    path: '/projects',
    config: {auth: false},
    handler: function (req, res) {
      return db('projects').select('id', 'name').then(res);
    }
  });

  /* Create a new project */
  server.route({
    method: 'POST',
    path: '/projects',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const data = req.payload;
      const owner = req.auth.credentials.sub;
      const name = data.name;

      if (!owner || !data || !name) {
        return res(Boom.badData('Bad data'));
      }

      return db('projects')
        .returning('id')
        .insert({
          data: data,
          owner: owner,
          name: name,
          created_at: db.fn.now(),
          updated_at: db.fn.now()
        }).then(function (ret) {
          return res({id: ret[0]});
        })
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not add data'))
        });
    }
    });

  /* Get a single project */
  server.route({
    method: 'GET',
    path: '/projects/{id}',
    config: {auth: false},
    handler: function (req, res) {
      return db('projects')
        .select()
        .where('id', req.params.id)
        .then((ret) => res(ret[0]))
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not find data'))
        });
    }
  });

  /* Update a single project */
  server.route({
    method: 'PUT',
    path: '/projects/{id}',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      const data = req.payload;
      return db('projects')
        .returning('id')
        .update({
          name: data.name,
          updated_at: db.fn.now(),
          data: data
        })
        .then((ret) => res({id: ret[0]}))
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not update data'))
        });
      ;
    }
  });

  /* Delete a single project */
  server.route({
    method: 'DELETE',
    path: '/projects/{id}',
    config: {auth: 'jwt'},
    handler: function (req, res) {
      return db('projects')
        .where('id', req.params.id)
        .del()
        .then((ret) => res({id: req.params.id}))
        .catch(function (err) {
          console.error(err);
          return res(Boom.badImplementation('Internal Server Error - Could not delete data'))
        })
    }
  })

});

server.start((err) => {
  if (err) { throw err}
  console.log(`Server running at: ${server.info.uri}`);
});

