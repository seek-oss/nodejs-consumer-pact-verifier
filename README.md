# Pact consumer verification
This is a spike at the verification portion of the [version 2 Pact]
(https://github.com/pact-foundation/pact-specification/tree/version-2) specification.

The library should work with standard testing frameworks such as [mocha](https://www.npmjs.com/package/mocha)
and should behave as a standard assertion library. It should throw an `AssertionError` in the event of
failure.

- [Status](#status)
	- [Implemented](#implemented)
	- [Not implemented](#not-implemented)
- [Usage](#usage)

## Status
This library is still in alpha/early stages of development and does not yet fully conform
to the v2 specification. At the time of time of writing, the intention is to implement this once it is
clearer how to do so.

### Implemented
- All PactV1 features (strict body matching, headers, path, method query string etc.).
- Basic v2 Type matching.
- v2 Regex matching tests passing.
- v2 Min/Max matching rules passing.

### Not implemented
- Nested array type matching still failing (expect unit-test failure)

## Usage
- Essentially this the verification section only, use it in place of `chai.expect/assert`.
- It's unlikely this will be what you are looking for with standard pact verification.
- To verify a standard consumer, use it with [the interceptor](https://github.com/seek-oss/nodejs-consumer-pact-interceptor)
 to catch the outgoing HTTP requests and assert they meet the pact spec.
