'use strict';

var fs = require('fs');
var expect = require('chai').expect;
var verifier = require('../verifier')({
    consumer: "test consumer",
    provider: "test provider"
});

var AssertionError = require('assertion-error');

// Use this test for development, to look at a single one of the examples
describe.skip('Running a singular test', function(){
    var test = require(__dirname + '/pact-specification/testcases/request/body/array with nested array that matches.json');
    it("- " + test.comment, function(){
        if(test.match){
            verifier(test.expected, test.actual, test.expected.matchingRules, test.comment);
        }
        else {
            expect(function generatedTest(){
                verifier(test.expected, test.actual, test.expected.matchingRules, test.comment);
            }).to.throw(AssertionError);
        }
    });
});

describe('Given the pact version 2 specification', function(){

    var testScenarios = [];
    var testsToSkip = {
        "array with nested array that matches.json": true
    };

    var specPath = "/pact-specification/testcases/request";
    fs.readdirSync(__dirname + specPath + "/body").forEach(function(f){
        if(testsToSkip[f]){
            console.log('Skipping tests for ', f);
        }
        else if(f.match(/\.json$/))
            testScenarios.push(require(__dirname + specPath + "/body/" + f));
    });
    fs.readdirSync(__dirname + specPath + "/headers").forEach(function(f){
        if(f.match(/\.json$/))
            testScenarios.push(require(__dirname + specPath + "/headers/" + f));
    });
    fs.readdirSync(__dirname + specPath + "/method").forEach(function(f) {
        if(f.match(/\.json$/))
            testScenarios.push(require(__dirname + specPath + "/method/" + f));
    });
    fs.readdirSync(__dirname + specPath + "/path").forEach(function(f) {
        if(f.match(/\.json$/))
            testScenarios.push(require(__dirname + specPath + "/path/" + f));
    });
    fs.readdirSync(__dirname + specPath + "/query").forEach(function(f) {
        if(f.match(/\.json$/))
            testScenarios.push(require(__dirname + specPath + "/query/" + f));
    });

    testScenarios.forEach(function(test){
        it("- " + test.comment, function(){
            if(test.match){
                verifier(test.expected, test.actual, test.expected.matchingRules, test.comment);
            }
            else {
                expect(function generatedTest(){
                    verifier(test.expected, test.actual, test.expected.matchingRules, test.comment);
                }).to.throw(AssertionError);
            }
        });
    });
});
