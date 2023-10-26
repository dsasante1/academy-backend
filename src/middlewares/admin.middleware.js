/* eslint-disable camelcase */
/* eslint-disable consistent-return */
//

const { runQuery } = require('../config/database.config');
const adminQueries = require('../queries/admin.queries');
const applicantQueries = require('../queries/applicant.queries');

const checkBatchId = async (batch_id) => {
  const [batchResult = null] = await runQuery(adminQueries.fetchBatch, [batch_id]);

  if (!batchResult) {
    return batchResult;
  }

  return batchResult;
};

const checkBatchIdExistence = async (req, res, next) => {
  try {
    const { batch } = req.body;

    const batchResult = await checkBatchId(batch);

    if (!batchResult) {
      return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'Selected Batch does not exists!',
        data: null,
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
};

const checkBatchIdDuplicate = async (req, res, next) => {
  try {
    const { batch_id } = req.body;

    const batchResult = await checkBatchId(batch_id);

    if (batchResult) {
      return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'Duplicate batch id. select a new Batch id',
        data: null,
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
};

const checkIfEmailExists = async (req, res, next) => {
  try {
    const { email } = req.body;

    const [applicantEmail = null] = await runQuery(applicantQueries.findApplicantByEmail, [email]);

    if (!applicantEmail) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Invalid email',
        data: null,
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// check if new batch id does not
// match any existing batch id

const checkNewBatchId = async (req, res, next) => {
  try {
    const { newBatchId } = req.body;

    const batchResult = await checkBatchId(newBatchId);

    if (batchResult) {
      return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'The new Batch Id already exists!',
        data: null,
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
};

// prevent duplicate batch assessments/questions

const checkAssessmentBatchId = async (req, res, next) => {
  try {
    const { batch } = req.body;

    const [batchResult] = await runQuery(adminQueries.assessmentBatchId, [batch]);

    if (batchResult) {
      return res.status(409).json({
        status: 'error',
        code: 409,
        message: 'Batch Assessment already exists!',
        data: null,
      });
    }

    return next();
  } catch (error) {
    next(error);
  }
};

const changeDateFormat = (req, res, next) => {
  try {
    const { closure_date } = req.body;
    // split, replace - with /, change DD and MM position
    const modifiedDate = closure_date.split('/');
    // switch the position of the day and month
    [modifiedDate[0], modifiedDate[1]] = [modifiedDate[1], modifiedDate[0]];

    const newDate = modifiedDate.join('-');
    req.body.newDate = newDate;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  checkBatchIdDuplicate,
  checkBatchIdExistence,
  checkIfEmailExists,
  checkNewBatchId,
  checkAssessmentBatchId,
  changeDateFormat,
};
