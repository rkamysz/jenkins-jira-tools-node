var chai = require("chai");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);
const chaiFetchMock = require('chai-fetch-mock');
//const fetchMock = require('fetch-mock');
const fetch = require("node-fetch");
const sinon = require("sinon");
const JiraFetch = require('./../src/jiraFetch.js').JiraFetch;
const { shouldThrowError, buildHeaders, onResult, fetchMethod } = require('./../src/jiraFetch.js').JiraFetchComponents;
const expect = chai.expect;

// const proxyquire = require('proxyquire');
// const fakeFetch = proxyquire('./../src/jiraFetch.js', {
//   'node-fetch': sinon.stub().returns(Promise.resolve())
// });

describe('JiraFetch', function () {
  describe('#onResult()', function () {
    it('should throw an Error if given response is an error', function () {
      expect(() =>{ return onResult(new Error()) }).to.throw(Error);
    });
  });
  describe('#buildHeaders()', function () {
    it('headers should be equal', function () {
      let result = buildHeaders("admin","admin");
      expect(JSON.stringify(result)).to.be.equal('{"Content-Type":"application/json","Authorization":"Basic YWRtaW46YWRtaW4="}');
    });
  });
  describe('#shouldThrowError()', function () {
    it('should return true when response is an error', function () {
      expect(shouldThrowError(new Error())).to.be.true;
    });
    it('should return true when response.status is not equal to expected status', function () {
      expect(shouldThrowError({ status: 404 }, 200)).to.be.true;
    });
    it('should return false when status is equal to expected status', function () {
      expect(shouldThrowError({ status: 200 }, 200)).to.be.false;
    });
    it('should return false by default', function () {
      expect(shouldThrowError({})).to.be.false;
    });
  });
  describe('#post()', function() {
    it('fetch to have been called', function() {
      let fakeFetch = sinon.stub(fetch, 'Promise').returns(Promise.resolve());
      let JF = JiraFetch("admin","admin","https://www.google.de/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png");
      JF.post("","");
      expect(fakeFetch).to.have.been.called;
    });
  });
});