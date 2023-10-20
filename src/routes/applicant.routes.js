const express = require('express');

const router = express.Router();
const { checkToken } = require('../middlewares/auth.middleware');
const validator = require('../middlewares/validation.middleware');
const applicantMiddleware = require('../middlewares/applicant.middleware');
const upload = require('../../utils/upload.file');

const applicantControllers = require('../controllers/applicant.controllers');

// signup route
router.post('/signup', validator.checkSignUpApplicantInput, applicantControllers.createApplicant());

// login route
router.post('/login', validator.checkLoginInput, applicantControllers.signInApplicant());

// applicant upload files
router.post(
  '/upload',
  checkToken,
  upload,
  // validator.fileHandler,
  validator.checkFileUpload,
  validator.checkApplicationInput,
  applicantMiddleware.getCurrentBatchId,
  applicantMiddleware.setBatchId,
  applicantMiddleware.applicantImageUploader,
  applicantControllers.applicantImageDb(),
  applicantMiddleware.applicantDocUploader,
  applicantControllers.applicantDocDb(),
  applicantControllers.applicantDetailsDb(),
);

module.exports = router;
