/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { provideResponse } = require('../../helper/response');
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

function queryTemplates(
  args,
  query,
  errorMsg,
  successMsg,
  queryExecutor = runQuery,
  ...queryItems) {
  return async () => {
    // body 

    const response = await queryExecutor(
      query,
      queryItems,
    );

    if (!response) {
      throw {
        code: 400,
        status: 'error',
        message: errorMsg,
        data: null,
      };
    }

    return provideResponse('success', 201, successMsg, response);
  };
}

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
    throw {
      code: 404,
      status: 'error',
      message: 'Invalid Email',
      data: null,
    };
  }

  // Compare admin passwords
  const { password: dbPassword, id } = admin[0];

  // const applicantPassword = bcrypt.compareSync(password, dbPassword);
  const applicantPassword = checkAdminPassword(password, dbPassword);

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
  // const token = jwt.sign(
  //     {
  //         id,
  //         email,
  //     },
  //     config.JWT_SECRET_KEY,
  //     options,
  // );

  const token = generateLoginToken(id, email, options);
  if (!token) {
    throw {
      code: 400,
      status: 'error',
      message: 'Wrong email and password combination',
      data: null,
    };
  }
  return {
    status: 'success',
    message: 'Admin login successfully',
    code: 200,
    data: {
      id,
      email,
      token,
    },
  };
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
    throw {
      code: 400,
      status: 'error',
      message: 'Application creation failed',
      data: null,
    };
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
    throw {
      code: 400,
      status: 'error',
      message: 'Application creation failed',
      data: null,
    };
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
    throw {
      code: 400,
      status: 'error',
      message: 'Approval process failed',
      data: null,
    };
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
    throw {
      code: 404,
      status: 'error',
      message: 'Dashboard Information not found',
      data: null,
    };
  }

  const dashboard = [
    dashBoardCurrentApplicants, dashBoardHistory,
    dashboardTotalApplicants, dashboardCurrentAcademy,
  ];
  return provideResponse('success', 200, 'information fetched successfully', dashboard);
  // // await Promise.all
};

const applicantEntries = async (queryExecutor = runQuery) => {
  const entriesResponse = await queryExecutor(adminQueries.applicationEntries);

  if (!entriesResponse) {
    throw {
      code: 404,
      status: 'error',
      message: 'Admin Entries not found',
      data: null,
    };
  }

  return provideResponse('success', 200, 'Admin Entries fetched successfully', entriesResponse);
};

const assessmentHistory = async (queryExecutor = queryRunner(adminQueries.assessmentHistory)) => {
  const assessmentResponse = await queryExecutor;

  if (!assessmentResponse) {
    throw {
      code: 404,
      status: 'error',
      message: 'Assessment history not found',
      data: null,
    };
  }

  return provideResponse('success', 200, 'Assessment history fetched successfully', assessmentResponse);
};

const applicantsResults = async (queryExecutor = queryRunner(adminQueries.applicantsResults)) => {
  const resultResponse = await queryExecutor;

  if (!resultResponse) {
    throw {
      code: 404,
      status: 'error',
      message: 'Results not found',
      data: null,
    };
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
    throw {
      code: 400,
      status: 'error',
      message: 'Edit batch Id failed',
      data: null,
    };
  }

  return provideResponse('success', 201, 'Batch Id edited successfully', editBatchIdResponse);
};

const updateTimer = async (body, queryExecutor = runQuery) => {
  const { batchId, timer } = body;

  const editTimerResponse = await queryExecutor(adminQueries.updateTimer, [batchId, timer]);

  if (!editTimerResponse) {
    throw {
      code: 400,
      status: 'error',
      message: 'Edit timer failed',
      data: null,
    };
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
