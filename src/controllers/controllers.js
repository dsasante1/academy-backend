 
/* eslint-disable max-len */
/* eslint-disable consistent-return */
// const applicantQuery = require('../queries/applicant.queries');
// const applicantService = require('../services/applicant.service');
// const { runQuery } = require('../config/database.config');

// Controller creating a new applicant
// eslint-disable-next-line max-len
function createController(service, query, runQuerry) {
  return async (req, res, next) => {
    try {
      const response = await service(req.body, query, runQuerry);

      return res.status(response.code).json(response);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  createController,
};
