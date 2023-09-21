const  { responseProvider }  = require('../../helper/response');
const moment = require('moment')



const checkSignUpApplicantInput = (req, res, next) => {

  try {
    const { email, firstName, lastName, password, phoneNumber } = req.body;


    if (typeof email !== 'string' || !email.includes('@')) {
      return responseProvider( res, null, 'provide a valid email', 400)
    }

    if (typeof firstName !== 'string' || !firstName) {
      return responseProvider( res, null, 'provide a valid firstName', 400)
    }


    if (typeof lastName !== 'string' || !lastName) {
      return responseProvider( res, null, 'provide a valid lastName', 400)
    }


    if (typeof password !== 'string' || password.length < 8) {
      return responseProvider( res, null, 'provide a valid password', 400)
    }

    if (typeof phoneNumber !== 'number' || phoneNumber.length < 10) {
      return responseProvider( res, null, 'provide a valid phone number', 400)
    }


    return next();
  } catch (error) {
    return next(error);
  }
};


//first name
//last name
//email
//password
//address
//course of study
//date of birth
//university
//CGPA

//todo: refactor repetive validators



const checkApplicationInput = (req, res, next) => {

  try {

    const { 
      email, firstName,
      lastName, address, 
      course, university, 
      cgpa, dob 
      } = req.body;


    if (typeof email !== 'string' || !email.includes('@')) {
      return responseProvider( res, null, 'provide a valid email', 400)
    }

    if (typeof firstName !== 'string' || !firstName) {
      return responseProvider( res, null, 'provide a valid firstName', 400)
    }


    if (typeof lastName !== 'string' || !lastName) {
      return responseProvider( res, null, 'provide a valid lastName', 400)
    }


    if (typeof address !== 'string' || !address) {
      return responseProvider( res, null, 'provide a valid address', 400)
    }

    if (typeof course !== 'string' || !course) {
      return responseProvider( res, null, 'provide a valid course of study', 400)
    }


    if (typeof university !== 'string' || !university) {
      return responseProvider( res, null, 'provide a valid university name', 400)
    }

    if (typeof cgpa !== 'number') {
      return responseProvider( res, null, 'provide a valid cgpa', 400)
    }


    if (moment(dob, 'DD/MM/YYYY', true).isValid) {
      return responseProvider( res, null, 'provide a valid date of birth', 400)
    }


    return next();
  } catch (error) {
    return next(error);
  }
};








const checkApplicantLoginInput = (req, res, next) => {

  try {
    const { email, password } = req.body;


    if (typeof email !== 'string' || !email.includes('@')) {
      return responseProvider( res, null, 'provide a valid email', 400)
    }


    if (typeof password !== 'string' || password.length < 8) {
      return responseProvider( res, null, 'provide a valid password', 400)
    }

    return next();
  } catch (error) {
    return next(error);
  }
};








module.exports = {
  checkSignUpApplicantInput,  
  checkApplicantLoginInput,
  checkApplicationInput
}
