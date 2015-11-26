## Pact consumer verification 

This is a spike at the verification portion of the [version 2 Pact]
(https://github.com/pact-foundation/pact-specification/tree/version-2) specification. 

The library should work with standard testing frameworks such as [mocha](https://www.npmjs.com/package/mocha)
and should behave as a standard assertion library. It should throw an `AssertionError` in the event of 
failure. 

#### Status: 

This library is still in alpha/early stages of development and does not yet fully conform 
to the v2 specification. At the time of time of writing, the intention is to implement this once it is 
clearer how to do so. 

** Implemented **

- All PactV1 features (strict body matching, headers, path, method query string etc)
- Basic v2 Type matching 
- v2 Regex matching tests passing 
- v2 Min/Max matching rules passing 

** Not implemented **

- Nested array type matching still failing (expect unit-test failure)

#### Quickstart: 

Essentially, use it in place of `chai.expect/assert`. 

    var verifier = require('pact-consumer-verify');
    var interceptor = require('pact-interceptor');

    var assertPact = verifier({
        consumer: "some UI frontend",
        provider: "some API"
    });

    var interceptor = require('pact-interceptor');

    describe('Given a valid pact', function(){

        var expectation = {
          "description": "Getting favorite links",
          "provider_state": "some links are available",
          "request": {
            "method": "get",
            "path": "/get-favorite-links",
            "headers": {
              "content-type": "application/json"
            }
          },
          "response": {
            "status": 200,
            "headers": {},
            "body": {
              "links": ["http://google.com", "http://aljazeera.com"]
            }
          }
        }

        var actual; 

        beforeEach(function(done){
            interceptor('http://little-api/get-favorite-links', function(err, result){
                if(err) {
                    done(err); //There was an error, can't continue
                }
                else {
                    actual = result;     
                    done();
                }
            });
        });

        it('Should provide some nice links', function(){
            assertPact(expectation, actual);
            //now publish pact
        });
    });
    
