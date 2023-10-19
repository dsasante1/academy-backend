/* eslint-disable max-len */
/* eslint-disable consistent-return */
const applicantQuery = require('../queries/applicant.queries');
const applicantService = require('../services/applicant.service');
const { runQuery } = require('../config/database.config');

// Controller creating a new applicant
// eslint-disable-next-line max-len
function createApplicant(service = applicantService, query = applicantQuery, queryExecutor = runQuery) {
  return async (req, res, next) => {
    try {
      const response = await service.createApplicant(req.body, query, queryExecutor);

      return res.status(response.code).json(response);
    } catch (error) {
      next(error);
    }
  };
}

// Login controller

function signInApplicant(service = applicantService, query = applicantQuery, queryExecutor = runQuery) {
  return async (req, res, next) => {
    try {
      const result = await service.loginApplicant(req.body, query, queryExecutor);
      return res.status(result.code).json(result);
    } catch (error) {
      next(error);
    }
  };
}

// upload applicant image src to database
function applicantImageDb(service = applicantService, query = applicantQuery, queryExecutor = runQuery) {
  return async (req, res, next) => {
    try {
      const { email } = req.body;

      const imageUrl = req.imgUrl;

      await service.setApplicantImageDb(imageUrl, email, query, queryExecutor);

      // return res.status(result.code).json(result);
      return next();
    } catch (error) {
      next(error);
    }
  };
}

// Upload doc url to database
function applicantDocDb(service = applicantService, query = applicantQuery, queryExecutor = runQuery) {
  return async (req, res, next) => {
    try {
      const { email } = req.body;

      const { cvUrl } = req;

      await service.setApplicantDocDb(cvUrl, email, query, queryExecutor);

      return next();
    } catch (error) {
      next(error);
    }
  };
}

// Upload applicant details to database
function applicantDetailsDb(service = applicantService, query = applicantQuery, queryExecutor = runQuery) {
  return async (req, res, next) => {
    try {
      const response = await service.setApplicantDetailsDb(req.body, query, queryExecutor);

      return res.status(response.code).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  createApplicant,
  signInApplicant,
  applicantImageDb,
  applicantDocDb,
  applicantDetailsDb,
};
