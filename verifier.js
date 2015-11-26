'use strict';

var AssertionError = require('assertion-error');
var _ = require('lodash');
var v2Ruleset = require(__dirname + '/lib/pact-v2-ruleset');
var queryString = require('query-string');

/**
 * Private API
 * Takes an object and lower-cases its' keys
 * @param {Object} o Expected to be a set of headers 
 * @return {Object} New object with lowercase keys 
 */
function makeObjectKeysLC (o){
    var keys = Object.keys(o);
    var lcObject = {};
    keys.forEach(function(k){
        lcObject[k.toLowerCase()] = o[k];
    });
    return lcObject;
}
/**
 * Private API: 
 * removes whitespace after commas (for headers), 
 * so "alligators, hippos" -> "alligators,hippos" 
 * @param {Object} h A set of headers, either expected or actual
 * @return {Object} A set of headers with whitespace removed
 */
function stripHeaderWhitespace (h){
    var n = {};
    var keys = Object.keys(h);
    keys.forEach(function(k){
        n[k] = h[k].replace(/,[ ]*/g, ',');
    });
    return n;
}

/**
 * Private API: 
 * checks of the methods are equal, returns error object if not.
 */
function checkMethod(actual, expected){
    if(actual.toLowerCase() !== expected.toLowerCase()){
        return {
            error: "HTTP Methods are not equal",
            actual: actual,
            expected: expected,
            showDiff: true
        };
    }
}

/**
 * Private api: 
 * Checks the path given
 * @param {String} actual The actual url path, ie "/foo/bar/123"
 * @param {String} expected The expecte url path 
 */
function checkPath(actual, expected){
    if(actual.toLowerCase() !== expected.toLowerCase()){
        return {
            error: "Url paths are not equal",
            actual: actual,
            expected: expected,
            showDiff: true
        };
    }
}

/**
 * Private api: 
 * Checks the query string given. Note this is case sensitive. 
 * @param {String} actual query string
 * @param {String} expected query string
 */
function checkQuery(actual, expected){

    //Ignore trailing ampersands
    var actualObj = actual ? queryString.parse(actual.replace(/\&$/, '')) : {};
    var expectedObj = queryString.parse(expected);

    if(! _.isEqual(actualObj, expectedObj)){
        return {
            error: "Query parameters do not match",
            expected: expectedObj, 
            actual: actualObj
        };
    }
}

/**
 * Private api: 
 * Checks the validity of the body. Actual should be strictly equal to the expected if 
 * using the simple (v1) matching rules. Otherwise apply the regex and type-checking of pact v2. 
 */
function checkBody (actual, expected, matchingRules){
    if(!expected){
        return; 
    }
    if(!matchingRules){ //Use v1 style simple matching
        if(! _.isEqual(actual, expected)){
            return {
                error: "Body does not match expectation: ",
                expected: expected, 
                actual: actual
            };
        }
    }
    else {
        var paths = Object.keys(matchingRules);
        var failures = paths.map(function(path){
            return v2Ruleset(path, matchingRules[path], actual, expected);
        }).filter(function(f){
            return f !== false;
        });
        if(failures.length){
            return failures[0];
        }
    }
}

/**
 * Private api: 
 * Checks the validity of the headers being sent. Note that this isn't a strict equality check:
 * - Header keys are expected to be case insensitive
 * - Header values, when comma delimited, are whitespace insensitive 
 * - Additional, non-expected headers being sent are ignored - Expectation is that headers asserted are a subset of those sent.
 */ 
function checkHeaders(actual, expected, matchingRules){
    if(!expected){
        return; 
    }
    //V1 Simple matching 
    if(!matchingRules){
        // Make header key casing insensitive
        var lcExpected = stripHeaderWhitespace(makeObjectKeysLC(expected));
        var lcActual = stripHeaderWhitespace(makeObjectKeysLC(actual));
    
        //Check all required headers are present: 
        var expectedKeys = Object.keys(lcExpected);
        var failures = expectedKeys.map(function(k){
            if(lcExpected[k] !== lcActual[k]){
                return {
                    error: "Headers do not match expectation:",
                    expected: expected, 
                    actual: actual
                };
            }
        });

        if(failures.length){
            return failures[0];
        }
    }
    else { //V2 Regex and more complex rule matching
        var paths = Object.keys(matchingRules);
        var failures = paths.map(function(path){
            return v2Ruleset(path, matchingRules[path], actual, expected);
        });
        if(failures.length){
            return failures[0];
        }
    }
}

/**
 * Public API: 
 * Main consumer pact verification entrypoint. Given a set of expectations it will either return 
 * the verified object or throw. 
 *
 * @param {Object} expected The expected request. Object must include method, path, query, 
 * headers and body elements as per https://github.com/pact-foundation/pact-specification/blob/version-2/testcases/request/body/matches.json
 * @param {Object} actual Similarly, the actual request. 
 * @param {object} matchingRules Optional, The v2 specification of extended matching rules such as type, regex and min/max requirements.
 * @param {String} comment Optional, A note about the test, used for identifying what's failing
 * @return {Object} return verified object if no assertions fail. Throws in the event of an assertion failure.
 */
function verify(expected, actual, matchingRules, comment){

    var errors = [];

    errors.push(checkMethod(expected.method, actual.method));
    errors.push(checkPath(expected.path, actual.path));
    errors.push(checkQuery(expected.query, actual.query));
    errors.push(checkBody(expected.body, actual.body, matchingRules));
    errors.push(checkHeaders(expected.headers, actual.headers, matchingRules));

    //Clean out the 'undefined' from the array leaving only valid errors
    errors = errors.filter(function(e){
        return !!e;
    });

    errors.forEach(function(e){
        var message = comment ? comment + " - " + e.error : e.error;
        throw new AssertionError(message, {
            expected: e.expected,
            actual: e.actual,
            showDiff: true
        });
    });

    //All good, pass on the expectations so they may be published
    return expected;
}

module.exports = function(settings){

   if(!settings.provider || !settings.consumer) {
        throw {
            error: "Pact assertions not correctly setup, please ensure that an object with a provider and consumer are passed in",
            settings: settings
        };
   }

   return function verifyPact (expected, actual, matchingRules, comment){
    
       if(!expected){
            throw {
                error: "Expectation can't be undefined when verifying pacts" 
            };
       }
       if(!actual){
            throw {
                error: "Actual results can't be undefined when verifying pacts" 
            };
       }

       return {
           consumer: {
                name: settings.consumer
            },
            provider: {
                name: settings.provider        
            },
            interactions: verify(expected, actual, matchingRules, comment)
       };
   };
};
