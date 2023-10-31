/* eslint-disable no-throw-literal */
const bcrypt = require('bcrypt');

const { provideResponse } = require('../../helper/response');
const { runQuery } = require('../config/database.config');
const { loginService } = require('./service');

// create a applicant
const signUpApplicant = async (body, applicantQuery, queryExecutor) => {
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
async function loginApplicant(
  body,
  applicantQuery,
  queryRunner = runQuery,
  loginServices = loginService,
) {
  const result = await loginServices(body, queryRunner, applicantQuery);
  return result;
}


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
  signUpApplicant,
  loginApplicant,
  getAllApplicants,
  setApplicantImageDb,
  setApplicantDocDb,
  setApplicantDetailsDb,
};
