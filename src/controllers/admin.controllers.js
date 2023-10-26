const adminService = require('../services/admin.service');

// Admin Login controller
const signInAdmin = async (req, res, next) => {
  try {
    const result = await adminService.loginAdmin(req.body);
    return res.status(result.code).json(result);
  } catch (error) {
    next(error);
  }
};

const createApplication = async (req, res, next) => {
  try {
    const applicationResponse = await adminService.createApplication(req.body);

    return res.status(applicationResponse.code).json(applicationResponse);
  } catch (error) {
    next(error);
  }
};

const createAssessment = async (req, res, next) => {
  try {
    const assessmentResponse = await adminService.createAssessment(req.body);

    return res.status(assessmentResponse.code).json(assessmentResponse);
  } catch (error) {
    next(error);
  }
};

// approve or decline applicants application
const approveDeclineApplication = async (req, res, next) => {
  try {
    const assessmentResponse = await adminService.approveDeclineApplication(req.body);

    return res.status(assessmentResponse.code).json(assessmentResponse);
  } catch (error) {
    next(error);
  }
};

const applicationDashboard = async (req, res, next) => {
  try {
    const assessmentResponse = await adminService.applicationDashboard();

    return res.status(assessmentResponse.code).json(assessmentResponse);
  } catch (error) {
    next(error);
  }
};

const applicantEntries = async (req, res, next) => {
  try {
    const assessmentResponse = await adminService.applicantEntries();

    return res.status(assessmentResponse.code).json(assessmentResponse);
  } catch (error) {
    next(error);
  }
};

const assessmentHistory = async (req, res, next) => {
  try {
    const assessmentResponse = await adminService.assessmentHistory();

    return res.status(assessmentResponse.code).json(assessmentResponse);
  } catch (error) {
    next(error);
  }
};

const applicantsResults = async (req, res, next) => {
  try {
    const applicantsResultsResponse = await adminService.applicantsResults();

    return res.status(applicantsResultsResponse.code).json(applicantsResultsResponse);
  } catch (error) {
    next(error);
  }
};

const editBatchId = async (req, res, next) => {
  try {
    const editBatchIdResponse = await adminService.editBatchId(req.body);

    return res.status(editBatchIdResponse.code).json(editBatchIdResponse);
  } catch (error) {
    next(error);
  }
};

const editTimer = async (req, res, next) => {
  try {
    const editTimerResponse = await adminService.updateTimer(req.body);

    return res.status(editTimerResponse.code).json(editTimerResponse);
  } catch (error) {
    next(error);
  }
};

// adminService.updateTimer

module.exports = {
  signInAdmin,
  createApplication,
  createAssessment,
  approveDeclineApplication,
  applicationDashboard,
  applicantEntries,
  assessmentHistory,
  applicantsResults,
  editBatchId,
  editTimer,
};
