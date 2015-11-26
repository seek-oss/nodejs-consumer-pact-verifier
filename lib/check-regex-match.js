'use strict';

var _ = require('lodash');

/**
 * API: Private
 * Checks if the given matching objects are matching the regex as expected in the assertion. 
 * @param {Object} ruleset The 'rule' object. Must contain the following { match: "regex", regex: "<specified regex>" }
 * @param {Object/String/Array} The elements of the matching object which were selected with JSONPath from the actual body
 * @return {Boolean} true if elements(s) do successfully match the regex test, false if not. 
 */
module.exports = function(ruleSet, matchingObjects){

    if(ruleSet.match !== "regex"){
        throw {
            error: "check-regex-match can only be used for regex type checks. Check it has been imported correctly",
            ruleSet: ruleSet
        };
    }
    if(ruleSet.match === "regex" && !ruleSet.regex){
        throw {
            error: "check-regex-match has been set to type 'regex', but no regex provided",
            ruleSet: ruleSet
        };
    }

    if(_.isString(matchingObjects)){
        var regex = new RegExp(ruleSet.regex);
        return !!matchingObjects.match(regex);
    }
    else if(_.isNumber(matchingObjects)){
        var regex = new RegExp(ruleSet.regex);
        return !!(matchingObjects + "").match(regex);
    }
    else if(_.isArray(matchingObjects)){
        //Go through each matching element of the array, check if they match
        //if any fail to do so, abort immediately.
        var matchingFailures = matchingObjects.filter(function(ea){
            if(_.isString(ea)){
                var regex = new RegExp(ruleSet.regex);
                if(!ea.match(regex)){
                    return true; 
                }
            }
            //Not a string, can't match, consider a failure
            else {
                return true;
            }
        });
        return !matchingFailures.length; 
    }
    else {
        return false;
    }
};
