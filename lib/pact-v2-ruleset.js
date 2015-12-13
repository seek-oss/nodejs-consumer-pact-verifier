'use strict';

var jsonPath = require('jsonpath');
var checkTypeMatch = require(__dirname + '/check-type-match');
var checkRegexMatch = require(__dirname + '/check-regex-match');

/**
 * API private:
 * Attempts to apply the more compelx matching rules set out in the pact v2 spec to the body of
 * a given pact request. This includes regex matches and type matches on elements within the body.
 * @param {String} path The json path into the expected and actual body where the matching is concerned
 * @param {Object} ruleSet The object specifying the matching to perform, expected to be like
 * {match: "regex", regex: "[^0-9]" }
 * @param {Object} body The actual body request being asserted as matching expectations
 * @param {Object} expectedBody the expectations body
 * @return {boolean} Either false for no errors or an object for a failure to match assertion
 */
function regexBodyMatch(path, ruleSet, body, expectedBody){

    //Add 'body' to json path because it's expecting that additional element
    var matchingObjects = jsonPath.query({body: body}, path);
    var matchingExpectedObjects = jsonPath.query({body: expectedBody}, path);

    if(ruleSet.hasOwnProperty("min")){

        var failing = matchingObjects.map(function(match){
            if(match.length < ruleSet.min){
                return {
                    error: "failed to meet minimum for :" + path,
                    expected: ruleSet.min,
                    actual: match.length
                };
            }
        }).filter(function(f){
            return !!f;
        });

        if(failing.length){
            return failing[0];
        }
    }
    if(ruleSet.hasOwnProperty("max")){
        var failing = matchingObjects.map(function(match){
            if(match.length > ruleSet.max){
                return {
                    error: "failed to meet maximum for :" + path,
                    expected: ruleSet.min,
                    actual: match.length
                };
            }
        }).filter(function(f){
            return !!f;
        });
        if(failing.length){
            return failing[0];
        }
    }
    if(ruleSet.hasOwnProperty("match") && ruleSet.match === "type"){
        var typeCheckFailure = checkTypeMatch(matchingObjects, matchingExpectedObjects, path);
        if(typeCheckFailure){
            return typeCheckFailure;
        }
    }
    if(ruleSet.hasOwnProperty("match") && ruleSet.match === "regex"){
        if(!checkRegexMatch(ruleSet, matchingObjects)){
            return {
                error: "Unable to match regex: ",
                expected: ruleSet.regex,
                actual: matchingObjects
            };
        }
    }
    return false; //All appears ok, no apparent matching errors
}

module.exports = regexBodyMatch;
