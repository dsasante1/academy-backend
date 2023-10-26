/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { provideResponse, responseProvider } = require('../../helper/response');
const { runQuery } = require('../config/database.config');
const adminQueries = require('../queries/admin.queries');
const config = require('../config/env/index');
// TODO: create a query to edit applications

async function queryRunner(queries) {
  const result = await runQuery(queries);
  return result;
}

// remove duplicates, async function creator

// destructure items from body ...{args}

// function queryTemplates(
//   args,
//   query,
//   errorMsg,
//   successMsg,
//   queryExecutor = runQuery,
//   ...queryItems) {
//   return async () => {
//     // body

//     const response = await queryExecutor(
//       query,
//       queryItems,
//     );

//     if (!response) {
//       throw {
//         code: 400,
//         status: 'error',
//         message: errorMsg,
//         data: null,
//       };
//     }

//     return provideResponse('success', 201, successMsg, response);
//   };
// }



// check password
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

// admin login

const loginAdmin = async (
  body,
  queryExecutor = runQuery,
  checkAdminPassword = checkPassword,
  generateLoginToken = generateToken,
) => {
  const { email, password } = body;

  // Check if that admin exists inside the db
  // const admin = await runQuery(adminQueries.findAdminByEmail, [email]);

  const admin = await queryExecutor(adminQueries.findAdminByEmail, [email]);

  if (!admin) {
    return provideResponse(
      'error',
      400,
      'Wrong email and password combination',
      null,
    );
  }

  // Compare admin passwords
  const { password: dbPassword, id } = admin[0];

  // const applicantPassword = bcrypt.compareSync(password, dbPassword);
  const adminPassword = checkAdminPassword(password, dbPassword);

  if (!adminPassword) {
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
    'Admin login successfully',
    {
      id,
      email,
      token,
    },
  );
};

const createApplication = async (body, queryExecutor = runQuery) => {
  const {
    link, batch_id, newDate, instructions,
  } = body;

  const applicationResponse = await queryExecutor(
    adminQueries.createApplication,
    [batch_id, link, newDate, instructions],
  );

  if (!applicationResponse) {
    return provideResponse(
      'error',
      500,
      'Application creation failed',
      null,
    );
  }

  return provideResponse('success', 201, 'created application successfully', applicationResponse);
};

const createAssessment = async (body, queryExecutor = runQuery) => {
  const { question, timer, batch } = body;

  const assessmentResponse = await queryExecutor(
    adminQueries.createAssessment,
    [question, timer, batch],
  );

  if (!assessmentResponse) {
    return responseProvider(
      'error',
      500,
      'Application creation failed',
      null,
    );
  }

  return provideResponse('success', 201, 'created application successfully', assessmentResponse);
};

const approveDeclineApplication = async (body, queryExecutor = runQuery) => {
  const { email, applicationStatus } = body;

  const [assessmentResponse = null] = await queryExecutor(
    adminQueries.approveDeclineApplication,
    [email, applicationStatus],
  );

  if (!assessmentResponse) {
    return responseProvider(
      'error',
      500,
      'Approval process failed',
      null,
    );
  }

  return provideResponse('success', 201, 'Approval process successfully', assessmentResponse);
};

const applicationDashboard = async (queryExecutor = runQuery) => {
  // TODO: get individual  dashboard results into objects for easy retrieval
  // get dashboards into single array
  // use every on the dashboard array to check for errors or null values

  const [
    dashBoardCurrentApplicants, dashBoardHistory,
    dashboardTotalApplicants, dashboardCurrentAcademy,
  ] = await Promise.all([
    queryExecutor(adminQueries.dashboardCurrentApplicantsAcademy),
    queryExecutor(adminQueries.dashboardHistory),
    queryExecutor(adminQueries.dashboardTotalApplicantsAcademies),
    queryExecutor(adminQueries.currentAcademy),
  ]);

  // dashBoard.some((items) => !item)

  if (
    !dashBoardCurrentApplicants
        || !dashBoardHistory
        || !dashboardTotalApplicants
        || !dashboardCurrentAcademy
  ) {
    return provideResponse(
      'error',
      404,
      'Dashboard Information not found',
      null,
    );
  }

  const dashboard = [
    dashBoardCurrentApplicants, dashBoardHistory,
    dashboardTotalApplicants, dashboardCurrentAcademy,
  ];
  return provideResponse('success', 200, 'information fetched successfully', dashboard);
  // // await Promise.all
};

const applicantEntries = async (queryExecutor = queryRunner(adminQueries.applicationEntries)) => {
  const entriesResponse = await queryExecutor;

  if (!entriesResponse) {
    return provideResponse(
      'error',
      404,
      'Applicant Entries not found',
      null,
    );
  }

  return provideResponse('success', 200, 'Admin Entries fetched successfully', entriesResponse);
};

const assessmentHistory = async (queryExecutor = queryRunner(adminQueries.assessmentHistory)) => {
  const assessmentResponse = await queryExecutor;

  if (!assessmentResponse) {
    return provideResponse(
      'error',
      404,
      'Assessment history not found',
      null,
    );
  }

  return provideResponse('success', 200, 'Assessment history fetched successfully', assessmentResponse);
};

const applicantsResults = async (queryExecutor = queryRunner(adminQueries.applicantsResults)) => {
  const resultResponse = await queryExecutor;

  if (!resultResponse) {
    return provideResponse(
      'error',
      404,
      'Results not found',
      null,
    );
  }

  return provideResponse('success', 200, 'Results fetched successfully', resultResponse);
};

const editBatchId = async (body, queryExecutor = runQuery) => {
  const { batchCreationDate, newBatchId } = body;

  const editBatchIdResponse = await queryExecutor(
    adminQueries.editBatchId,
    [batchCreationDate, newBatchId],
  );

  if (!editBatchIdResponse) {
    return provideResponse(
      'error',
      500,
      'Edit Batch Id failed',
      null,
    );
  }

  return provideResponse('success', 201, 'Batch Id edited successfully', editBatchIdResponse);
};

const updateTimer = async (body, queryExecutor = runQuery) => {
  const { batchId, timer } = body;

  const editTimerResponse = await queryExecutor(adminQueries.updateTimer, [batchId, timer]);

  if (!editTimerResponse) {
    return provideResponse(
      'error',
      500,
      'Edit timer failed',
      null,
    );
  }

  return provideResponse('success', 201, 'Timer edited successfully', editTimerResponse);
};

// createAdminProfile,

module.exports = {
  loginAdmin,
  createApplication,
  createAssessment,
  approveDeclineApplication,
  applicationDashboard,
  applicantEntries,
  assessmentHistory,
  applicantsResults,
  editBatchId,
  updateTimer,

};
