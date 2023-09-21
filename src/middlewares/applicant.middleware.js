const { runQuery } = require('../config/database.config');
const { fetchApplicantById, applicantImgSrc,applicantDocumentUrl } = require('../queries/applicant.queries');



const checkIfIdExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [applicant = null] = await runQuery(fetchApplicantById, [id]);
    if (!applicant) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Applicant does not exist',
        data: null,
      });
    }

    req.applicant = applicant;
    return next();
  } catch (error) {
    return next(error);
  }
};




//upload applicant image
const applicantImageUploader = async (req, res, next) => {
  try {    
    const result = await req.file

    if (!result) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Can"t upload image, try again!',
        data: null,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};





//upload applicant image src to database
const setApplicantImageDb = async (req, res, next) => {
  try {
    const { fistname, lastname } = req.body;
    
    const { result } = req.file.path

    const [applicantImg = null] = await runQuery(applicantImgSrc, [fistname, lastname, result]);

    if (!applicantImg) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Applicant image not set',
        data: null,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};




//upload applicant image
const applicantDocUploader = async (req, res, next) => {
  try {    
    const result = await req.file

    if (!result) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Your document failed to upload',
        data: null,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};


//Upload doc url to database
const setApplicantDocDb = async (req, res, next) => {
  try {
    const { fistname, lastname } = req.body;
    
    const { result } = req.file.path

    const [applicantDoc = null] = await runQuery(applicantDocumentUrl, [fistname, lastname, result]);

    if (!applicantDoc) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Applicant document is not set in the database',
        data: null,
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};




module.exports = {
  checkIfIdExists,
  applicantImageUploader,
  setApplicantImageDb,
  setApplicantDocDb,
  applicantDocUploader
};
