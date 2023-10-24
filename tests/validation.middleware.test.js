/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const { expect } = require('chai');
const sinon = require('sinon');
const validators = require('../src/middlewares/validation.middleware');

const validApplicantInfo = {
  email: 'fif@agmail.com',
  firstname: 'fifa',
  lastname: 'league',
  password: 'ugn9ug984ngregre',
  phonenumber: '0000000000',
};

const invalidEmailapplicantInfo = {
  email: 'fifagmail.com',
  firstname: 'fifa',
  lastname: 'league',
  password: 'ugn9ug984ngregre',
  phonenumber: '0000000000',
};

const invalidFirstName = {
  email: 'fifa@gmail.com',
  firstname: '',
};

const invalidLastname = {
  email: 'fifa@gmail.com',
  firstname: 'uefa',
  lastname: 2,
};

const invalidSignUpPassword = {
  email: 'fifa@gmail.com',
  firstname: 'uefa',
  lastname: 'epl',
  password: '',
};

const invalidSignUpPhoneNumber = {
  email: 'fifa@gmail.com',
  firstname: 'uefa',
  lastname: 'epl',
  password: 'ggnoernboerbre',
  phonenumber: '122323',
};

const loginData = {
  email: 'olduser@gmail.com',
  password: 'gnopgn4t45y-4rggkjnr343',
};

const invalidLoginPassword = {
  email: 'olduser@gmail.com',
  password: 'gnopgn4',
};

const noLoginPassword = {
  email: 'olduser@gmail.com',
  password: 'gnopgn4',
};

const invalidLoginEmail = {
  email: 'oldusergmail.com',
  password: 'gnopgn4frrgrege3t4t34',
};

const noLoginEmail = {
  email: '',
  password: 'gnopgn4dewef3523',
};

const invalidImageExtension = '.PNG';
const pngImageExtension = '.png';
const jpegImageExtension = '.jpeg';
const jpgImageExtension = '.jpg';

const invalidDob = {
  address: 'accra, Ghana',
  course: 'chemistry',
  university: 'knust',
  cgpa: 3.66,
  dob: '12/21/202',
};

const invalidAddress = {
  address: '',
};

const invalidCourse = {
  address: 'accra, Ghana',
  course: '',
};

const invalidUniversity = {
  address: 'accra, Ghana',
  course: 'chemistry',
  university: 67,
};

const invalidCgpa = {
  address: 'accra, Ghana',
  course: 'chemistry',
  university: 'knust',
  dob: '04/04/2000',
  cgpa: '',
};

const invalidImage = {
  image: '.docx',
  cv: '.pdf',
};

const invalidCv = {
  image: '.png',
  cv: '.jpeg',
};

const mockPath = (fileInput) => fileInput;

const emptyDates = '';

const invalidDate = '31/6/2046';
const invalidDateFormat = '12-2-20';

const validDate = '2/2/2000';
const validDateFormat = '2/12/2002';

const validApplicationInfo = {
  address: 'accra, Ghana',
  course: 'chemistry',
  university: 'knust',
  cgpa: 3.66,
  dob: '12/2/2022',
  image: 'pasportPicture.png',
  cv: 'awesomeCv.pdf',
};
// const validLoginIn = {
//   email: 'dubiousApplicant@gmail.com',
//   password: 'gnopgn4t45y-4rggkjnr343',
// };

const invalidEmailLoginDetails = {
  email: 'oldusermail.com',
  password: 'gkjnr343',
};

// const invalidPasswordLoginDetails = {
//   email: 'old@usermail.com',
//   password: 'gkjnr343',
// };

const invalidUrlLink = { link: '' };

const invalidBatchId = {
  link: 'https://enyata.com/',
  batch_id: 'three',
};

const invalidInstructions = {
  link: 'https://enyata.com/',
  batch_id: 2,
  closure_date: '12/2/2022',
  instructions: 2,
};

const invalidCreateApplicationDate = {
  link: 'https://enyata.com/',
  batch_id: 2,
  closure_date: 'he 20/10/2022',
};

const validCreateApplicationInputs = {
  link: 'https://enyata.com/',
  closure_date: '31/12/2020',
  batch_id: 1,
  instructions: '1. a whole lot of instructions 2. another instruction. 3. the last piece of advice',
};

const invalidBatch = { batch: 'hello world' };
const invalidNewBatchId = { newBatchId: '' };

const validBatchInputs = { batch: 2, newBatchId: 3 };

const invalidQuestions = {
  batch: 2,
  question: '',
};

const invalidTimer = {
  batch: 2,
  question: {

    1: {
      question: 'question here',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      },
      answer: 'C',
    },

    2: {
      question: 'question here',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      },
      answer: 'D',
    },

  },
  timer: 'hello',
};

const validAssessmentInputs = {
  batch: 1,
  question: {

    1: {
      question: 'question here',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      },
      answer: 'C',
    },

    2: {
      question: 'question here',
      options: {
        A: '',
        B: '',
        C: '',
        D: '',
      },
      answer: 'D',
    },

  },

  timer: 60,
};

const invalidApplicationStatus = {
  email: 'good@gmail.com',
  applicationStatus: 'pening',
};

describe('validation middleware', () => {
  let status; let json; let res; let next;
  beforeEach(() => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
    next = sinon.spy();
  });

  describe('validate sign up inputs', () => {
    it('should call next for valid sign up input', () => {
      const req = { body: { ...validApplicantInfo } };
      validators.checkSignUpApplicantInput(req, res, next);
      expect(next.calledOnce).to.equal(true);
    });

    it('should return 404 for invalid sign up email input', () => {
      const req = { body: { ...invalidEmailapplicantInfo } };
      validators.checkSignUpApplicantInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid email');
    });

    it('should return 404 for invalid sign up firstname input', () => {
      const req = { body: { ...invalidFirstName } };
      validators.checkSignUpApplicantInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid firstname');
    });

    it('should return 404 for invalid sign up lastname input', () => {
      const req = { body: { ...invalidLastname } };
      validators.checkSignUpApplicantInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid lastname');
    });

    it('should return 404 for invalid sign up password input', () => {
      const req = { body: { ...invalidSignUpPassword } };
      validators.checkSignUpApplicantInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('invalid email and password');
    });

    it('should return 404 for invalid sign up phonenumber input', () => {
      const req = { body: { ...invalidSignUpPhoneNumber } };
      validators.checkSignUpApplicantInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid phone number');
    });
  });
  describe('validate login input', () => {
    it('should call next for valid login input', () => {
      const req = { body: { ...loginData } };
      validators.checkLoginInput(req, res, next);
      expect(next.calledOnce).to.equal(true);
    });

    it('should return 404 for invalid login password', () => {
      const req = { body: { ...invalidLoginPassword } };
      validators.checkLoginInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('invalid email and password');
    });

    it('should return 404 for no login password', () => {
      const req = { body: { ...noLoginPassword } };
      validators.checkLoginInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('invalid email and password');
    });

    it('should return 404 for invalid login email', () => {
      const req = { body: { ...invalidLoginEmail } };
      validators.checkLoginInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('invalid email and password');
    });

    it('should return 404 for no login email', () => {
      const req = { body: { ...noLoginEmail } };
      validators.checkLoginInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('invalid email and password');
    });
  });
  describe('validate applicant application form inputs', () => {
    it('should return false for check image extension with no file input', () => {
      const returnValue = validators.checkImageExtension('');
      expect(returnValue).to.equal(false);
    });

    it('should return false for images with invalid extensions', () => {
      const returnValue = validators.checkImageExtension(invalidImageExtension);
      expect(returnValue).to.equal(false);
    });

    it('should return true for images with jpg extensions', () => {
      const returnValue = validators.checkImageExtension(jpgImageExtension);
      expect(returnValue).to.equal(true);
    });

    it('should return true for images with png extensions', () => {
      const returnValue = validators.checkImageExtension(pngImageExtension);
      expect(returnValue).to.equal(true);
    });

    it('should return true for images with jpeg extensions', () => {
      const returnValue = validators.checkImageExtension(jpegImageExtension);
      expect(returnValue).to.equal(true);
    });

    it('should return 404 for application invalid date of birth input', () => {
      const req = { body: { ...invalidDob } };
      validators.checkApplicationInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid date of birth');
    });

    it('should return 404 for application invalid address input', () => {
      const req = { body: { ...invalidAddress } };
      validators.checkApplicationInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid address');
    });

    it('should return 404 for application invalid course input', () => {
      const req = { body: { ...invalidCourse } };
      validators.checkApplicationInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid course of study');
    });

    it('should return 404 for application invalid university input', () => {
      const req = { body: { ...invalidUniversity } };
      validators.checkApplicationInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid university name');
    });

    it('should return 404 for application invalid cgpa input', () => {
      const req = { body: { ...invalidCgpa } };
      validators.checkApplicationInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid cgpa');
    });

    it('should return 404 for application invalid image file', () => {
      const req = { files: { ...invalidImage } };

      validators.checkFileUpload(req, res, next, mockPath);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('invalid file');
    });

    it('should return 404 for application invalid pdf file', () => {
      const req = { files: { ...invalidCv } };

      validators.checkFileUpload(req, res, next, mockPath);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('invalid file');
    });

    it('should call next for valid application input', () => {
      const req = { body: { ...validApplicationInfo } };
      validators.checkApplicationInput(req, res, next);
      expect(next.calledOnce).to.equal(true);
    });

    it('should return false for empty date format input', () => {
      const returnValue = validators.isDateFormatValid(emptyDates);
      expect(returnValue).to.equal(false);
    });

    it('should return false for invalid date format input', () => {
      const returnValue = validators.isDateFormatValid(invalidDateFormat);
      expect(returnValue).to.equal(false);
    });

    it('should return false for empty invalid date input', () => {
      const returnValue = validators.isDateValid(emptyDates);
      expect(returnValue).to.equal(false);
    });

    it('should return false for invalid date input', () => {
      const returnValue = validators.isDateValid(invalidDate);
      expect(returnValue).to.equal(false);
    });

    it('should return true for valid date input', () => {
      const returnValue = validators.isDateValid(validDate);
      expect(returnValue).to.equal(true);
    });

    it('should return true for valid date input', () => {
      const returnValue = validators.isDateValid(validDateFormat);
      expect(returnValue).to.equal(true);
    });
  });
  describe('validate admin create application form inputs', () => {
    it('should return 404 for invalid link to create application', () => {
      const req = { body: { ...invalidUrlLink } };
      validators.checkCreateApplicationInputs(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid url link');
    });

    it('should return 404 for invalid batch id to create application', () => {
      const req = { body: { ...invalidBatchId } };
      validators.checkCreateApplicationInputs(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid batch Id');
    });

    it('should return 404 for invalid instructions to create application', () => {
      const req = { body: { ...invalidInstructions } };
      validators.checkCreateApplicationInputs(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide valid instructions');
    });

    it('should return 404 for invalid closure date to create application', () => {
      const req = { body: { ...invalidCreateApplicationDate } };
      validators.checkCreateApplicationInputs(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid closure date');
    });

    it('should call next for valid create application inputs', () => {
      const req = { body: { ...validCreateApplicationInputs } };
      validators.checkCreateApplicationInputs(req, res, next);
      expect(next.calledOnce).to.equal(true);
    });

    it('should return 404 for invalid batch input to create assessment', () => {
      const req = { body: { ...invalidBatch } };
      validators.checkCreateAssessmentInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid batch Id');
    });
  });
  describe('validate admin create assessment form inputs', () => {
    it('should return 404 for invalid questions to create assessment', () => {
      const req = { body: { ...invalidQuestions } };
      validators.checkCreateAssessmentInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide valid questions');
    });

    it('should return 404 for invalid timer to create assessment', () => {
      const req = { body: { ...invalidTimer } };
      validators.checkCreateAssessmentInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid timer');
    });

    it('should call next for valid create assessment inputs', () => {
      const req = { body: { ...validAssessmentInputs } };
      validators.checkCreateAssessmentInput(req, res, next);
      expect(next.calledOnce).to.equal(true);
    });

    it('should return 404 for invalid timer to edit timer', () => {
      const req = { body: { ...invalidTimer } };
      validators.checkTimerInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid timer');
    });

    it('should call next for valid timer inputs to edit timer', () => {
      const req = { body: { ...validAssessmentInputs } };
      validators.checkTimerInput(req, res, next);
      expect(next.calledOnce).to.equal(true);
    });

    it('should return 404 for invalid timer to edit batch id', () => {
      const req = { body: { ...invalidBatch } };
      validators.checkBatchIdInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid batch Id');
    });

    it('should return 404 for invalid timer to edit batch id', () => {
      const req = { body: { ...invalidNewBatchId } };
      validators.checkBatchIdInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid batch Id');
    });

    it('should call next for valid batch inputs to edit batch Id', () => {
      const req = { body: { ...validBatchInputs } };
      validators.checkBatchIdInput(req, res, next);
      expect(next.calledOnce).to.equal(true);
    });
  });
  describe('validate application decision inputs', () => {
    it('should return 404 for invalid email for check decision input', () => {
      const req = { body: { ...invalidEmailLoginDetails } };
      validators.checkDecisionInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid email');
    });

    it('should return 404 for application status for check decision input', () => {
      const req = { body: { ...invalidApplicationStatus } };
      validators.checkDecisionInput(req, res, next);
      expect(next.calledOnce).to.equal(false);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('provide a valid application decision');
    });
  });
});

// TODO test errors in the throw catch
// it('should pass the error into the callback if save fails', function() {
//   var expectedError = new Error('oops');
//   var save = sinon.stub(Database, 'save');
//   save.throws(expectedError);
//   var callback = sinon.spy();

//   setupNewUser({ name: 'foo' }, callback);

//   save.restore();
//   sinon.assert.calledWith(callback, expectedError);
// });
