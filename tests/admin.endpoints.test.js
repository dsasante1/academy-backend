/* eslint-disable no-undef */
const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

const assessmentData = {
  batch: 4,
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

const applicationData = {
  link: 'https://enyata.com/',
  closure_date: '31/12/2020',
  batch_id: 5,
  instructions: '1. a whole lot of instructions 2. another instruction. 3. the last piece of advice',
};

const timerData = {
  batch: 1,
  timer: 2000,
};

const timerDataNonExistingBatchId = {
  batch: 21,
  timer: 2000,
};

const approvalData = {
  email: 'clark@dailyplanet.com',
  applicationStatus: 'declined',
};

// eslint-disable-next-line no-undef
describe('Testing Admin Endpoints', () => {
  it('should test for creating application', async () => {
    const res = await request(app).post('/api/v1/admin/application').send(applicationData);
    expect(res.status).to.equal(201);
  });

  it('should test for creating assessment', async () => {
    const res = await request(app).post('/api/v1/admin/exam').send(assessmentData);
    expect(res.status).to.equal(201);
  });

  it('should test for approve application', async () => {
    const res = await request(app).put('/api/v1/admin/approve').send(approvalData);
    expect(res.status).to.equal(201);
  });

  it('should test fetch dashbord', async () => {
    const res = await request(app).get('/api/v1/admin/dashboard').send();
    expect(res.status).to.equal(200);
  });

  it('should test fetch entries', async () => {
    const res = await request(app).get('/api/v1/admin/entries').send();
    expect(res.status).to.equal(200);
  });

  it('should test fetch history', async () => {
    const res = await request(app).get('/api/v1/admin/history').send('/history');

    expect(res.status).to.equal(200);
  });

  it('should test fetch results', async () => {
    const res = await request(app).get('/api/v1/admin/results').send();
    expect(res.status).to.equal(200);
  });

  it('should test edit timer', async () => {
    const res = await request(app).put('/api/v1/admin/timer').send(timerData);
    expect(res.status).to.equal(201);
  });

  it('should test existing batch id before editing timer', async () => {
    const res = await request(app).put('/api/v1/admin/timer').send(timerDataNonExistingBatchId);
    expect(res.status).to.equal(409);
  });
});
