/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { provideResponse, responseProvider } = require('../../helper/response');
const { runQuery } = require('../config/database.config');
// const adminQueries = require('../queries/admin.queries');
const config = require('../config/env/index');

async function queryRunner(queries) {
  const result = await runQuery(queries);
  return result;
}

const checkPassword = (password, dbPassword) => {
  if (!password || !dbPassword) {
    return null;
  }
  const result = bcrypt.compareSync(password, dbPassword);
  return result;
};

// generate token

const generateToken = (id, email, options) => {
  if (!id || !email || !options) {
    return null;
  }
  return jwt.sign(
    {
      id,
      email,
    },
    config.JWT_SECRET_KEY,
    options,
  );
};

const loginService = async (
  body,
  runQueries,
  query,
  checkLoginPassword = checkPassword,
  generateLoginToken = generateToken,
) => {
  const { email, password } = body;

  // Check if that admin exists inside the db
  const response = await runQueries(query, [email]);

  if (!response) {
    return provideResponse(
      'error',
      400,
      'Wrong email and password combination',
      null,
    );
  }

  // Compare admin passwords
  const { password: dbPassword, id } = response[0];

  const loginPassword = checkLoginPassword(password, dbPassword);

  if (!loginPassword) {
    return provideResponse(
      'error',
      400,
      'Wrong email and password combination',
      null,
    );
  }

  const options = {
    expiresIn: '1d',
  };

  const token = generateLoginToken(id, email, options);

  if (!token) {
    return provideResponse(
      'error',
      400,
      'Wrong email and password combination',
      null,
    );
  }
  return provideResponse(
    'success',
    200,
    'Login successful',
    {
      id,
      email,
      token,
    },
  );
};

module.exports = {
  checkPassword,
  loginService,
  queryRunner,

};
