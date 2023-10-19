/* eslint-disable no-throw-literal */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { provideResponse } = require('../../helper/response');
// const applicantQuery = require('../queries/applicant.queries');
// const { runQuery } = require('../config/database.config');
const config = require('../config/env/index');

// create a applicant
const createApplicant = async (body, applicantQuery, queryExecutor) => {
  const {
    password, firstname, lastname, email, phonenumber,
  } = body;

  // Check if applicant already exist in db
  const applicantExist = await queryExecutor(applicantQuery.findApplicantByEmail, [email]);

  if (applicantExist.length > 0) {
    // eslint-disable-next-line no-throw-literal
    throw {
      code: 409,
      message: 'Applicant already exists',
      data: null,
      status: 'error',
    };
  }
  const saltRounds = 12;
  const hash = bcrypt.hashSync(password, saltRounds);

  const response = await queryExecutor(
    applicantQuery.addApplicant,
    [
      email,
      firstname,
      lastname,
      hash,
      phonenumber,
    ],
  );

  return provideResponse(
    'success',
    201,
    'New applicant added successfully!',
    response[0],
  );
};

// applicant login

const loginApplicant = async (body, applicantQuery, queryExecutor) => {
  const { email, password } = body;

  // Check if that applicant exists inside the db
  const applicant = await queryExecutor(applicantQuery.findApplicantByEmail, [email]);

  if (applicant.length === 0) {
    throw {
      code: 404,
      status: 'error',
      message: 'Invalid Email',
      data: null,
    };
  }

  // Compare applicant passwords
  const {
    password: dbPassword, id, firstname, lastname,
  } = applicant[0];

  const applicantPassword = bcrypt.compareSync(password, dbPassword);

  if (!applicantPassword) {
    throw {
      code: 400,
      status: 'error',
      message: 'Wrong email and password combination',
      data: null,
    };
  }

  const options = {
    expiresIn: '1d',
  };

  // Generate token for authentication purposes
  const token = jwt.sign(
    {
      id,
      email,
    },
    config.JWT_SECRET_KEY,
    options,
  );
  return {
    status: 'success',
    message: 'Applicant login successfully',
    code: 200,
    data: {
      id,
      firstname,
      lastname,
      email,
      token,
    },
  };
};

// Fetches all applicants in the database
const getAllApplicants = async (applicantQuery, queryExecutor) => {
  const applicants = await queryExecutor(applicantQuery.fetchAllApplicants);
  return provideResponse(
    'success',
    200,
    'Applicants fetched successfully',
    { applicants },
  );
};

// upload applicant image src to database
const setApplicantImageDb = async (email, imageUrl, applicantQuery, queryExecutor) => {
  // eslint-disable-next-line max-len
  const [applicantImg = null] = await queryExecutor(applicantQuery.applicantImgSrc, [imageUrl, email]);

  if (!applicantImg) {
    throw {
      code: 400,
      status: 'error',
      message: 'Applicant image not received',
      data: null,
    };
  }
};

// Upload doc url to database
const setApplicantDocDb = async (email, cvUrl, applicantQuery, queryExecutor) => {
  // eslint-disable-next-line max-len
  const [applicantDoc = null] = await queryExecutor(applicantQuery.applicantDocumentSrc, [cvUrl, email]);

  if (!applicantDoc) {
    throw {
      code: 400,
      status: 'error',
      message: 'Applicant cv has not been received',
      data: null,
    };
  }
};

// Upload applicants details to database
const setApplicantDetailsDb = async (body, applicantQuery, queryExecutor) => {
  const {
    address, course, university, cgpa, dob, email,
  } = body;

  const [applicantDoc = null] = await queryExecutor(
    applicantQuery.applicantDetails,
    [address, course, university, cgpa, dob, email],
  );

  if (!applicantDoc) {
    throw {
      code: 400,
      status: 'error',
      message: 'Applicant details has not been received',
      data: null,
    };
  }

  return provideResponse('success', 201, 'Applicant details added successfully!', applicantDoc);
};

module.exports = {
  createApplicant,
  loginApplicant,
  getAllApplicants,
  setApplicantImageDb,
  setApplicantDocDb,
  setApplicantDetailsDb,
};
