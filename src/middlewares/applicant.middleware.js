/* eslint-disable camelcase */
const { runQuery } = require('../config/database.config');
const applicantQueries = require('../queries/applicant.queries');

const adminQueries = require('../queries/admin.queries');

const cloudinary = require('../../utils/cloudinary');
const { responseProvider } = require('../../helper/response');

// module.exports = ApplicantMiddleware;

async function queryRunner(queries) {
  const result = await runQuery(queries);
  return result;
}

// set applicant batch id
// eslint-disable-next-line max-len
const getCurrentBatchId = async (req, res, next, queries = queryRunner(adminQueries.currentBatch)) => {
  try {
    const [{ batch_id = null }] = await new Promise((resolve) => {
      setTimeout(() => resolve(queries), 700);
    });

    if (!batch_id) {
      return responseProvider(res, null, 'batch id not found', 501);
    }

    req.batch_id = batch_id;
    return next();
  } catch (error) {
    return next(error);
  }
};
// set applicant batch id
// function setBatchId(queries = applicantQueries.setApplicantBatchId) {

const setBatchId = async (req, res, next, queries = applicantQueries.setApplicantBatchId) => {
  try {
    const { email } = req.body;

    // eslint-disable-next-line prefer-destructuring
    const batch_id = req.batch_id;

    const [setBatch = null] = await runQuery(
      queries,
      [email, batch_id],
    );

    if (!setBatch) {
      return responseProvider(res, null, 'batch id not set', 501);
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const getSecureUrl = async (filePath = '') => {
  try {
    if (!filePath) {
      throw (Error('invalid file path'));
    }
    const { secure_url } = await cloudinary.uploader.upload(filePath, { use_filename: true, resource_type: 'raw' });

    return secure_url;
  } catch (error) {
    return error;
  }
};

// TODO remove duplicated funcntions
// upload applicant image
const applicantImageUploader = async (req, res, next, fetchSecureUrl = getSecureUrl) => {
  try {
    const { image } = req.files;
    const imagePath = image[0].path;

    const imgUrl = await new Promise((resolve) => {
      setTimeout(() => resolve(fetchSecureUrl(imagePath)), 900);
    });

    if (!imgUrl || imgUrl instanceof Error) {
      return responseProvider(res, null, 'Cannot upload image, try again!', 400);
    }

    req.imgUrl = imgUrl;

    return next();
  } catch (error) {
    return next(error);
  }
};

// upload applicant cv document
const applicantDocUploader = async (req, res, next, fetchSecureUrl = getSecureUrl) => {
  try {
    const { cv } = req.files;
    const cvPath = cv[0].path;

    const cvUrl = await await new Promise((resolve) => {
      setTimeout(() => resolve(fetchSecureUrl(cvPath)), 900);
    });

    if (!cvUrl || cvUrl instanceof Error) {
      return responseProvider(res, null, 'Cannot upload cv, try again!', 400);
    }

    req.cvUrl = cvUrl;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  // checkIfIdExists,
  getCurrentBatchId,
  applicantImageUploader,
  applicantDocUploader,
  setBatchId,
  getSecureUrl,
};
