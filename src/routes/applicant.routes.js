const express = require('express');

const multer = require('multer');
const path = require('path');

// const fileStorage = multer.memoryStorage();

// const upload = multer({ storage: fileStorage });

const router = express.Router();
const { checkToken } = require('../middlewares/auth.middleware');
const validator = require('../middlewares/validation.middleware');
const applicantMiddleware = require('../middlewares/applicant.middleware');

// const { imgUpload, pdfUpload } = require("../../utils/multer");

// const { imgUpload } = require("../../utils/multer");

const applicantControllers = require('../controllers/applicant.controllers');

// signup route
router.post('/signup', validator.checkSignUpApplicantInput, applicantControllers.createApplicant());

// login route
router.post('/login', validator.checkLoginInput, applicantControllers.signInApplicant());

// application input route

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, 'uploads/'));
  },
  filename(req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}`);

  },
});

const upload = multer({ storage });


const applicantUploadedFiles = upload.array('files');

router.post(
  '/upload',
  // checkToken,
  applicantUploadedFiles,
  // applicantMiddleware.fileHandler,
  validator.checkApplicationInput,
  applicantMiddleware.getCurrentBatchId,
  applicantMiddleware.setBatchId(),
  applicantMiddleware.applicantImageUploader,
  applicantControllers.applicantImageDb(),
  applicantMiddleware.applicantDocUploader,
  applicantControllers.applicantDocDb(),
  applicantControllers.applicantDetailsDb(),
);

module.exports = router;
