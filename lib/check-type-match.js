'use strict';

var _ = require('lodash');
var type = require('type-detect');
var util = require('util');

/**
 * This is for the following scenario:
 *
 * expected: ["foo"]
 * actual: ["baz", "quux"]
 * --> return valid type match;
 *
 * expected: ["foo"]
 * actual: ["baz", 1234]
 * --> return failure to type match;
 *
 * In the event of multiple expecations, match each type in the actual results array against the first
 * expectation which placed in an array.
 */
function matchByFirstExpectation(matchingObjects, matchingExpectedObjects, path){

    //No assertion, allow
    if(matchingExpectedObjects.length === 0){
        return false;
    }

    if(matchingExpectedObjects.length !== 1){
        throw {
            error: "During the type match, there is an uneven number of assertions and expectations. It's not possible to disambiguate which is to be matched with which. Create an expectation with either a single element to match the type against or else the same number of elements for each actual element",
            expected: "assertion array length to equal 1",
            actual: matchingExpectedObjects.length
        };
    }

    var failures = matchingObjects.map(function(match){
        if(type(match) !== type(matchingExpectedObjects[0])){
            return {
                error: "Type matching failure for " + path,
                expected: "Expected type <" + type(matchingExpectedObjects[0]) + "> from example: " + util.inspect(matchingExpectedObjects[0]),
                actual: "Found <"  + type(match) + "> for " + util.inspect(match)
            };
        }
    }).filter(function(e){
        return !!e;  //Remove undefined records
    });

    if(failures.length){
        return failures[0];
    }
}


/**
 * This is for the following scenario:
 *
 * expected: ["foo", "bar"]
 * actual: ["baz", "quux"]
 * --> return valid type match;
 *
 * expected: ["foo", "bar"]
 * actual: ["baz", 1234]
 * --> return failure to type match;
 *
 * In the event of multiple expecations, match each type, side by side against the
 * actual results array.
 */
function matchSideBySide(matchingObjects, matchingExpectedObjects, path){
    //In the event of matching an array, check all the internal elements
    var expectedKeys = Object.keys(matchingExpectedObjects);
    var failures = expectedKeys.map(function(eK){
        if(!matchingObjects[eK]) {
            return {
                error: "unable to complete Type check for " + path + " Because " + eK + " is not defined",
                expected: "Expected type <" + type(matchingExpectedObjects) + "> from example: " + util.inspect(matchingExpectedObjects),
                actual: "Found no matching object"
            };
        }
        if(type(matchingObjects[eK]) !== type(matchingExpectedObjects[eK])){
            return {
                error: "Type matching failure for " + path,
                expected: "Expected type <" + type(matchingExpectedObjects[eK]) + "> from example: " + util.inspect(matchingExpectedObjects[eK]),
                actual: "Found <"  + type(matchingObjects[eK]) + "> for " + util.inspect(matchingObjects[eK])
            };
        }
    }).filter(function(e){
        return !!e;  //Remove undefined records
    });

    if(failures.length){
        return failures[0];
    }
}

/**
 * Private api:
 * @param {Object} matchingObjects The json-path selection of objects with which to do a type comparison on
 * @param {Object} matchingExpectedObjects The json-path selection of expected objects with which to assert from
 * @return {Object} Return truthy object with expectation failure.
 */
module.exports = function (matchingObjects, matchingExpectedObjects, path){
    if(type(matchingObjects) === "array" && type(matchingExpectedObjects) === "array"){

        if(matchingObjects.length === matchingExpectedObjects.length) {
            return matchSideBySide(matchingObjects, matchingExpectedObjects, path);
        }
        else {
            return matchByFirstExpectation(matchingObjects, matchingExpectedObjects, path);
        }
    }
    else if(type(matchingObjects) !== type(matchingExpectedObjects)){
        return {
            error: "Type matching failure for " + path,
            expected: "Expected type <" + type(matchingExpectedObjects) + "> from example: " + util.inspect(matchingExpectedObjects),
            actual: "Found <"  + type(matchingObjects) + "> for " + util.inspect(matchingObjects)
        };
    }
};
