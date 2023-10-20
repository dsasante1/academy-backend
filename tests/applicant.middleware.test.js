/* eslint-disable no-unused-expressions */
const { expect } = require('chai');

const sinon = require('sinon');
const applicantMiddleware = require('../src/middlewares/applicant.middleware');

// eslint-disable-next-line no-undef
describe('Testing Applicant Middlewares', () => {
  let status; let json; let res; let next;
  beforeEach(() => {
    status = sinon.stub();
    json = sinon.spy();
    res = { json, status };
    status.returns(res);
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should test null current Batch Id', async () => {
    const response = [{ batch_id: null }];
    const stubQuery = sinon.stub().resolves(response);
    const req = sinon.spy();

    await applicantMiddleware.getCurrentBatchId(req, res, next, stubQuery());

    expect(next.calledOnce).to.equal(false);
    expect(req.calledOnce).to.equal(false);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(501);
    expect(json.calledOnce).to.be.true;
    expect(json.args[0][0].message).to.equal('batch id not found');
  });

  it('should fetch current Batch Id with default query', async () => {
    const req = sinon.spy();

    await applicantMiddleware.getCurrentBatchId(req, res, next);


    expect(next.calledOnce).to.equal(true);
    // expect(req.calledOnce).to.equal(true);
    expect(status.calledOnce).to.be.false;
    expect(json.calledOnce).to.be.false;
  });

  // eslint-disable-next-line no-undef
  it('should set Batch Id', async () => {
    const req = { batch_id: 6 };

    await applicantMiddleware.setBatchId(req.batch_id, res, next);

    expect(next.calledOnce).to.equal(true);
    expect(status.calledOnce).to.be.false;
    expect(json.calledOnce).to.be.false;
  });

  it('should test invalid batch Id', async () => {
    const req = { body: { email: '' }, batch_id: null };

    await applicantMiddleware.setBatchId(req, res, next);

    expect(next.calledOnce).to.equal(false);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(501);
    expect(json.calledOnce).to.be.true;
  });

  it('should test applicant image uploader error', async () => {
    const req = sinon.spy();
    const stubQuery = sinon.stub().resolves(null);

    await applicantMiddleware.applicantImageUploader(req, res, next, stubQuery());

    expect(next.calledOnce).to.equal(false);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(400);
    expect(json.calledOnce).to.be.false;
  });

  it('should test applicant doc uploader error', async () => {
    const req = sinon.spy();
    const stubQuery = sinon.stub().resolves(null);

    await applicantMiddleware.applicantDocUploader(req, res, next, stubQuery());

    expect(next.calledOnce).to.equal(false);
    expect(status.calledOnce).to.be.true;
    expect(status.args[0][0]).to.equal(400);
    expect(json.calledOnce).to.be.false;
  });

  it('should test applicant image uploader throw error', async () => {
    const req = sinon.spy();
    const stubQuery = sinon.stub().throws('invalid file path');

    await applicantMiddleware.applicantImageUploader(req, res, next, stubQuery);

    expect(next.calledOnce).to.equal(true);
    expect(status.calledOnce).to.be.false;
    expect(json.calledOnce).to.be.false;
  });

  it('should test applicant document uploader throw error', async () => {
    const req = sinon.spy();
    const stubQuery = sinon.stub().throws('invalid file path');

    await applicantMiddleware.applicantImageUploader(req, res, next, stubQuery);

    expect(next.calledOnce).to.equal(true);
    expect(status.calledOnce).to.be.false;
    expect(json.calledOnce).to.be.false;
  });
});
