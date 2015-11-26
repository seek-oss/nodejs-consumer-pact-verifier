'use strict';

var AssertionError = require('assertion-error');
var _ = require('lodash');
var diff = require('deep-diff').diff;
var regexBodyMatch = require(__dirname + '/lib/regex-body-match');

/**
 * Private API: 
 * checks of the methods are equal, returns error object if not.
 */
function checkMethod(actual, expected){
    if(actual.toLowerCase() !== expected.toLowerCase()){
        return {
            error: "HTTP Methods are not equal",
            actual: actual,
            expected: expected
        };
    }
}

/**
 * Checks the path given
 */
function checkPath(actual, expected){
    if(actual.toLowerCase() !== expected.toLowerCase()){
        return {
            error: "Url paths are not equal",
            actual: actual,
            expected: expected
        };
    }
}

/**
 * Private api: 
 * Checks the query given
 */
function checkQuery(actual, expected){
    if(actual.toLowerCase() !== expected.toLowerCase()){
        return {
            error: "Query strings are not equal",
            actual: actual,
            expected: expected
        };
    }
}

/**
 * Private api: 
 * Checks the validity of the body. Actual should be strictly equal to the expected.
 */
function checkBody (actual, expected, matchingRules){
    if(!matchingRules){
        //Use v1 style simple matching
        return diff(actual, expected);
    }
    else {
        var paths = Object.keys(matchingRules);
        return paths.filter(function(path){
            !regexBodyMatch(path, matchingRules[path], actual);
        });
    }
}

/**
 * Private api: 
 * Checks the validity of the body. Actual should be strictly equal to the expected.
 */
function checkHeaders(actual, expected){
    return diff(actual, expected);
}

/**
 * @param {Object} expected The expected request. Object must include method, path, query, headers and body elements as per https://github.com/pact-foundation/pact-specification/blob/version-2/testcases/request/body/matches.json
 * @param {Object} actual Similarly, the actual request. 
 */
function verify(comment, expected, actual, matchingRules){
    var errors = [];
    errors.push(checkMethod(expected.method, actual.method));
    errors.push(checkPath(expected.path, actual.path));
    errors.push(checkQuery(expected.query, actual.query));
    errors.push(checkBody(expected.body, actual.body, matchingRules));
    errors.push(checkHeaders(expected.headers, actual.headers));

    //Clean out the 'undefined' from the array leaving only valid errors
    errors = errors.filter(function(e){
        return e !== undefined;
    });

    if(errors.length){
        throw {
            error: "Unable to verify pact", 
            errors: errors
        };
    }
    else {
        return true;    
    }
}

module.exports = verify;
