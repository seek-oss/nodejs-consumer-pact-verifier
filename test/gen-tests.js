'use strict';

var fs = require('fs');
var expect = require('chai').expect;
var verifier = require('../verifier');

describe.skip('Given the pact version 2 specification', function(){

    var testScenarios; 

    describe('function', function(){

        testScenarios = [];

        var specPath = "/pact-specification/testcases/request";
        fs.readdirSync(__dirname + specPath + "/body").forEach(function(f){
            testScenarios.push(require(__dirname + specPath + "/body/" + f));
        });
        fs.readdirSync(__dirname + specPath + "/headers").forEach(function(f){
            testScenarios.push(require(__dirname + specPath + "/headers/" + f));
        });
        fs.readdirSync(__dirname + specPath + "/method").forEach(function(f) {
            testScenarios.push(require(__dirname + specPath + "/method/" + f));
        });
        fs.readdirSync(__dirname + specPath + "/path").forEach(function(f) {
            testScenarios.push(require(__dirname + specPath + "/path/" + f));
        });
        fs.readdirSync(__dirname + specPath + "/query").forEach(function(f) {
            testScenarios.push(require(__dirname + specPath + "/query/" + f));
        });

        testScenarios.forEach(function(test){
            it("Test verification: " + test.comment, function(){
                if(test.match){
                    expect(function generatedTest(){
                        try {
                            verifier(test.comment, test.actual, test.expected, test.matchingRules);
                        }
                        catch(e){
                            console.log(e);
                            throw e;
                        }
                    }).to.not.throw();
                }
                else {
                    expect(function generatedTest(){
                        try{
                            verifier(test.comment, test.actual, test.expected, test.matchingRules);
                        }
                        catch(e){
                            console.log(e);
                            throw e;
                        }
                    }).to.throw();
                }
            });
        });
    });
});
