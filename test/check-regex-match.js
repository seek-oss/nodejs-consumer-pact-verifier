'use strict';

var checkRegexMatch = require('../lib/check-regex-match');
var expect = require('chai').expect;

describe('Given a matching set of objects and regex', function(){

    var matchingConfigurations = [
        {
            matchingObjects: "Foobar",
            rule: { "match": "regex", regex: "^.*a.*$" },
        },
        {
            matchingObjects: [ "Foobar", "baz"],
            rule: { "match": "regex", regex: "^.*a.*$" },
        },
        {
            matchingObjects: 1234,
            rule: { "match": "regex", regex: "[0-9]" },
        },
    ];

    matchingConfigurations.forEach(function(config, index){
        it('should match each pattern - test ' + index, function(){
            expect(checkRegexMatch(config.rule, config.matchingObjects)).to.be.true;
        });
    });
});

describe('Given a non-matching set of things to match over', function(){

    var nonMatchingConfigurations = [
        {
            matchingObjects: 1234,
            rule: { "match": "regex", regex: "[a-z]" },
        },
        {
            matchingObjects: "Foobar",
            rule: { "match": "regex", regex: "^.*z.*$" },
        },
        {
            matchingObjects: [ "Foobar", "baa"],
            rule: { "match": "regex", regex: "^.*z.*$" },
        },
        {
            matchingObjects: {foo: "foo"},
            rule: { "match": "regex", regex: "o" },
        },
        {
            matchingObjects: undefined,
            rule: { "match": "regex", regex: "o" },
        },
        {
            matchingObjects: null,
            rule: { "match": "regex", regex: "o" },
        },
    ];
    
    nonMatchingConfigurations.forEach(function(config, index){
        it('should fail to match each pattern - test ' + index, function(){
            expect(checkRegexMatch(config.rule, config.matchingObjects)).to.be.false;
        });
    });
});

describe('when given invalid parameters: ', function(){
    it('should throw an exception', function(){
        expect(function(){
            checkRegexMatch({ match: "type", regex: "foo"}, "somestring");
        }).to.throw();

        expect(function(){
            checkRegexMatch({ match: "regex" }, "somestring");
        }).to.throw();
    });
});
