'use strict';

var regexBodyMatch = require('../lib/pact-v2-ruleset');
var expect = require('chai').expect;

describe('Regex and type body matching:', function(){

    describe('Given a matching valid body, valid path and valid configuration', function(){

        var matchingConfigurations = [
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals",
                rule: { "match": "type" },
                expected: {
                    animals: [
                        { name: "somestring" }
                    ]
                }
            },
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals.*",
                rule: { max: 2 },
                expected: {
                }
            },
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals",
                rule: { min: 2 },
                expected: {
                    animals: [
                        { name: "somestring" }   
                    ]
                }
            },
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals[*].name",
                rule: { "match": "type" },
                expected: {
                    animals: [
                        { name: "somestring" },
                        { name: "somestring" }   
                    ]
                }
            },
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals[*].name",
                rule: { "match": "regex", "regex": "^.*a.*$"},
                expected: {
                    animals: [
                        { name: "somestring" }   
                    ]
                }
            }
        ];

        matchingConfigurations.forEach(function(config, index){
            it('should match each pattern - test ' + index, function(){
                expect(regexBodyMatch(config.path, config.rule, config.body, config.expected)).to.be.false;
            });
        });
    });

    describe('Given a non-matching body, valid path and valid configuration', function(){

        var nonMatchingConfigurations = [
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals",
                rule: { "min": 3, "match": "type" },
                expected: {
                    animals: {
                        name: "somestring"          
                    }
                }
            },
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals",
                rule: { "max": 1, "match": "type" },
                expected: {
                    animals: {
                        someOtherString: "somestring"          
                    }
                }
            },
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals[*].name",
                rule: { "match": "regex", "regex": "^.*z.*$"},
                expected: {
                    animals: {
                        name: "somestring"          
                    }
                }
            },
            {
                body: {
                    "animals": [
                        { "name": "Mary" },
                        { "name": "Susan" }
                    ]
                },
                path:"$.body.animals[*].name",
                rule: { "match": "type" },
                expected: {
                    animals: [
                        { name: 1234 },
                        { name: "foobar" }
                    ]
                }
            }
        ];

        nonMatchingConfigurations.forEach(function(config, index){
            it('should not match - test ' + index, function(){
                expect(regexBodyMatch(config.path, config.rule, config.body, config.expected)).to.be.truthy;
            });
        });
    });
});
