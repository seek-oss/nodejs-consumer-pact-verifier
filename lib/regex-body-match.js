'use strict';

var jsonPath = require('jsonpath');
var _ = require('lodash');
var checkTypeMatch = require(__dirname + '/check-type-match');
var checkRegexMatch = require(__dirname + '/check-regex-match');

function regexBodyMatch(path, ruleSet, body, expectedBody){

    //Add 'body' to json path because it's expecting that additional element
    var matchingObjects = jsonPath.query({body: body}, path); 
    var matchingExpectedObjects = jsonPath.query({body: expectedBody}, path);

    if(ruleSet.hasOwnProperty("min") && matchingObjects.length < ruleSet.min){
        return false;
    }
    if(ruleSet.hasOwnProperty("max") && matchingObjects.length > ruleSet.max){
        return false;
    }
    if(ruleSet.hasOwnProperty("match") && ruleSet.match === "type"){
        if(!checkTypeMatch(path, ruleSet, body, expectedBody, matchingObjects, matchingExpectedObjects)){
            return false;
        }
    }
    if(ruleSet.hasOwnProperty("match") && ruleSet.match === "regex"){
        if(!checkRegexMatch(ruleSet, matchingObjects)){
            return false;
        }
    }
    return true; //Successful match
}

module.exports = regexBodyMatch;
