'use strict';
var _ = require('lodash');

module.exports = function (matchingObjects, matchingExpectedObjects){

    if(_.isArray(matchingExpectedObjects) && _.isArray(matchingObjects)){
        // Check the arrays are of same length before comparing types 
        // to avoid getting into the scenario where one's shorter than the other 
        // and you run off the end in doing a side-by-side comparison. 
        if(matchingObjects.length !== matchingExpectedObjects.length) {
            return false;
        }
        for(var i = 0; i < matchingObjects.length; i++){
            if(typeof matchingObjects[i] !== typeof matchingExpectedObjects[i]) {
                return false;  
            }
        }
        return true; 
    }
    // Wishing for functors so badly right now...
    else {
        if(typeof matchingObjects !== typeof matchingBodyObjects) {
            return false;  
        }
        else {
            return true; 
        }
    }
};
