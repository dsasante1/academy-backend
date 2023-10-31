const findAdminByEmail = `SELECT id, email, password FROM admin WHERE email=$1`;

const dashboardTotalApplicantsAcademies = `
SELECT 
MAX (applicants.id) AS Total_Applicants, 
MAX(batch_id) AS Total_Academies
FROM applicants, application

`;

const dashboardCurrentApplicantsAcademy = `
SELECT COUNT (applicants.batch) AS Current_Applicants FROM applicants
WHERE applicants.batch IN (SELECT application.batch_id FROM application
                           ORDER BY application.batch_id DESC LIMIT 1)
`;

// get student for each academy batch
const dashboardHistory = `
SELECT application.batch_id AS Academy,
COUNT(applicants.batch) AS Students,
application.created_at AS Started

FROM application LEFT JOIN applicants
ON application.batch_id = applicants.batch
GROUP BY application.batch_id, applicants.batch,
application.created_at
ORDER BY application.batch_id DESC

`;

const currentAcademy = `
SELECT batch_id AS Current_Academy, MAX(created_at) AS Created FROM application
GROUP BY application.batch_id, application.created_at
ORDER BY application.batch_id DESC LIMIT 1
`;

const createApplication = `
INSERT INTO application (
    batch_id,
    link, 
    closure_date,
    instructions
)
    VALUES ($1, $2, $3, $4) RETURNING  id, batch_id, created_at, closure_date

`;

// dashboard assessment history
const createAssessment = `INSERT INTO assesment (
    question,
    timer, 
    batch
)
    VALUES ($1, $2, $3) RETURNING  id, batch, question, timer

`;

const assessmentHistory = `select batch, date_computed,
number_of_questions, timer,
exams  from assesment`;

const applicantsResults = `select firstname, lastname, email,
dob, address,
university, cgpa,
assesment_score, batch from applicants`;

const applicationEntries = `
select firstname, lastname,
email, dob, address,
university, cgpa, batch
from applicants
`;

// TODO  set admin profile
const createAdminProfile = '';

const updateTimer = `
UPDATE assesment
SET timer=$2
WHERE batch=$1
RETURNING batch, timer

`;

const editBatchId = `
UPDATE application
SET batch_id=$2
WHERE batch_id=$1
RETURNING batch_id, closure_date
`;

// fetch batch by batch_id from db to check duplicate batch id
const fetchBatch = 'SELECT batch_id FROM application WHERE batch_id=$1';

// get current batch id for applicant
const currentBatch = `
SELECT batch_id FROM application
ORDER BY batch_id DESC LIMIT 1;

`;

const approveDeclineApplication = `
UPDATE applicants
SET application=$2
WHERE email=$1 
RETURNING firstname, lastname, email, application
`;

// fetch batch id info from assessment table
const assessmentBatchId = 'SELECT batch FROM assesment WHERE batch=$1';

// TODO update student assessment
// after taking the exams

module.exports = {
  findAdminByEmail,
  createApplication,
  createAssessment,
  fetchBatch,
  dashboardTotalApplicantsAcademies,
  dashboardHistory,
  dashboardCurrentApplicantsAcademy,
  currentBatch,
  currentAcademy,
  assessmentHistory,
  applicantsResults,
  applicationEntries,
  createAdminProfile,
  updateTimer,
  editBatchId,
  approveDeclineApplication,
  assessmentBatchId,
};
