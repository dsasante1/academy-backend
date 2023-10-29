/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { provideResponse, responseProvider } = require('../../helper/response');
const { runQuery } = require('../config/database.config');
const adminQueries = require('../queries/admin.queries');
const config = require('../config/env/index');
const { loginService } = require('./service');
// TODO: create a query to edit applications

async function loginAdmin(
  body,
  queryRunner = runQuery,
  query = adminQueries.findAdminByEmail,
  loginServices = loginService,
) {
  const result = await loginServices(body, queryRunner, query);
  return result;
}

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
  login,
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
