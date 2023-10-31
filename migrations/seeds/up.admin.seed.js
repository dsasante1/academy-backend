'use strict';

// var dbm;
// var type;
// var seed;
// var fs = require('fs');
// var path = require('path');
// var Promise;

const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { runQuery } = require('../../src/config/database.config');

dotenv.config();
/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
// exports.setup = function(options, seedLink) {
//   dbm = options.dbmigrate;
//   type = dbm.dataType;
//   seed = seedLink;
//   Promise = options.Promise;
// };

const adminQueryUp = `INSERT INTO admin(
  email,
  fullname,
  country,
  phonenumber,
  address,
  password
  )
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING fullname;`;

const up = async (email, fullname, country, phonenumber, address, password, query) => {
  try {
    const saltRounds = 12;
    const hash = bcrypt.hashSync(password, saltRounds);

    const data = await runQuery(
      query,
      [
        email,
        fullname,
        country,
        phonenumber,
        address,
        hash,
      ],
    );

    if (data) {
      console.log(fullname, 'admin seeding succesfull');
    }

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

const {
  email,
  fullname,
  country,
  phonenumber,
  address,
  password,
} = process.env;

up(
  email,
  fullname,
  country,
  phonenumber,
  address,
  password,
  adminQueryUp,
);
