const chai = require('chai');
const chaiFetchMock = require('chai-fetch-mock');
const fetchMock = require('fetch-mock');
const { shouldThrowError, buildHeaders, onResult, JiraFetch } = require('./../src/jiraFetch.js');
const expect = chai.expect;

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
    before(() => fetchMock.post('https://www.google.com/cats', { cats: 5 }))
    it('to have been called', function() {
      fetch.mockResponse("");
      let jf = new JiraFetch("admin","admin","https://www.google.com");
      jf.post("/cats","");
      expect(jf).to.equal("");
    });
  });
});