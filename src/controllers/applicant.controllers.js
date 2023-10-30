/* eslint-disable max-len */
/* eslint-disable consistent-return */
const applicantQuery = require('../queries/applicant.queries');
const applicantService = require('../services/applicant.service');
const { runQuery } = require('../config/database.config');
const { createController } = require('./controllers');
// Controller creating a new applicant
// eslint-disable-next-line max-len
function signUpApplicant(controller =
createController(
  applicantService.signUpApplicant,
  applicantQuery,
  runQuery,
)) {
  return controller;
}

// Login controller

function logInApplicant(
  controller = createController(
    applicantService.loginApplicant,
    applicantQuery.findApplicantByEmail,
    runQuery,
  ),
) {
  return controller;
}



// Login controller

// async function logInApplicant(req, res, next, service = applicantService.loginApplicant) {
//   try {
//     const result = await service(req.body);
//     return res.status(result.code).json(result);
//   } catch (error) {
//     return next(error);
//   }
// }

// upload applicant image src to database
function applicantImageDb(service = applicantService.setApplicantImageDb, query = applicantQuery, queryExecutor = runQuery) {
  return async (req, res, next) => {
    try {
      const { email } = req.body;

      const imageUrl = req.imgUrl;

      await service(imageUrl, email, query, queryExecutor);

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

function applicantDetailsDb(
  controller = createController(
    applicantService.setApplicantDetailsDb,
    applicantQuery,
    runQuery,
  ),
) {
  return controller;
}

module.exports = {
  signUpApplicant,
  logInApplicant,
  applicantImageDb,
  applicantDocDb,
  applicantDetailsDb,
};
