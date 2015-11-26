'use strict';

var checkTypeMatch = require('../lib/check-type-match');
var expect = require('chai').expect;

describe('Given a matching set of objects and regex', function(){

    var matchingConfigurations = [
        {
            matchingObjects: "Foobar",
            matchingExpectedObjects: "foobar"
        },
        {
            matchingObjects: [ "Foobar", "baz"],
            matchingExpectedObjects: ["foobar"]
        },
        {
            matchingObjects: [ "Foobar", "baz"],
            matchingExpectedObjects: []
        },
        {
            matchingObjects: { "Foobar": "baz" },
            matchingExpectedObjects: {} 
        },
        {
            matchingObjects: { "Foobar": "baz" },
            matchingExpectedObjects: {baz: "asdf"} 
        },
        {
            matchingObjects: 1234,
            matchingExpectedObjects: 312
        },
        {
            matchingObjects: 1234,
            matchingExpectedObjects: 0 
        },
    ];

    matchingConfigurations.forEach(function(config, index){
        it('should match each pattern - test ' + index, function(){
            expect(checkTypeMatch(config.matchingObjects, config.matchingExpectedObjects), '$.some.path[*]').to.be.falsey;
        });
    });
});

describe('Given a matching set of objects and regex', function(){

    var nonMatchingConfigurations = [
        {
            matchingObjects: "Foobar",
            matchingExpectedObjects: 123 
        },
        {
            matchingObjects: "Foobar",
            matchingExpectedObjects: {}
        },
        {
            matchingObjects: "Foobar",
            matchingExpectedObjects: []
        },
        {
            matchingObjects: "",
            matchingExpectedObjects: []
        },
        {
            matchingObjects: [ "Foobar", "baz"],
            matchingExpectedObjects: {} 
        },
        {
            matchingObjects: [ "Foobar", "baz"],
            matchingExpectedObjects: 123
        },
        {
            matchingObjects: { "Foobar": "baz" },
            matchingExpectedObjects: "Foo" 
        },
        {
            matchingObjects: 1234,
            matchingExpectedObjects: "0"
        },
    ];

    nonMatchingConfigurations.forEach(function(config, index){
        it('should match each pattern - test ' + index, function(){
            expect(checkTypeMatch(config.matchingObjects, config.matchingExpectedObjects), "$.some.path[*]").to.be.truthy;
        });
    });
});

