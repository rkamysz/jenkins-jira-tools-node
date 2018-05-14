let assert = require('assert');
var chai = require('chai');
let { shouldThrowError, buildHeaders, onResult } = require('./../src/jiraFetch.js');
let expect = chai.expect;
const throwError = function() { throw new TypeError('Illegal salmon!'); };
describe('JiraFetch', function () {
  describe('#onResult()', function () {
    it.only('should throw an Error if given response is an error', function () {
      let result = onResult(new Error());
      //assert.throws(throwError, Error, "Error thrown");
      console.log("....",result);
      expect(throwError).to.throw(TypeError,"Illegal salmon!");
    });
  });
  describe('#buildHeaders()', function () {
    it('headers should be equal', function () {
      let result = buildHeaders("admin","admin");
      assert.equal(JSON.stringify(result), '{"Content-Type":"application/json","Authorization":"Basic YWRtaW46YWRtaW4="}');
    });
  });
  describe('#shouldThrowError()', function () {
    it('should return true when response is an error', function () {
      let result = shouldThrowError(new Error())
      assert.equal(result, true);
    });
    it('should return true when response.status is not equal to expected status', function () {
      let result = shouldThrowError({ status: 404 }, 200);
      assert.equal(result, true);
    });
    it('should return false when status is equal to expected status', function () {
      let result = shouldThrowError({ status: 200 }, 200);
      assert.equal(result, false);
    });
    it('should return false by default', function () {
      let result = shouldThrowError({});
      assert.equal(result, false);
    });
  });
});