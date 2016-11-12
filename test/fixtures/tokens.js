var jwt = require('jsonwebtoken');

module.exports = {
  'admin': jwt.sign({ roles: [ 'edit' ] }, process.env.AUTH0_SECRET),
  'user': jwt.sign({}, process.env.AUTH0_SECRET)
};
