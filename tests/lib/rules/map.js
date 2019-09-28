"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/map"),

  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ERROR_MESSAGE = 'Use native Array.prototype.map instead'

var ruleTester = new RuleTester();
ruleTester.run("map", rule, {

  valid: [
    "_.map({}, function() {})",
    "var _ = {}; _.map([], function() { })",
    "var object = {}; _.map({}, function() { })",
    "window._ = {}; _.map([], function() { })",
    "global._ = {}; _.map([], function() { })",
    "Array.isArray([1, 2, 3]) ? [1, 2, 3].map(function() {}) : _.map([1, 2, 3], function() {})"
  ],

  invalid: [
    { code: "_.map([42, 3, 14], function() { })", errors: [{ message: 'Use native Array.prototype.map instead' }] },
    { code: "_.map([], function() { })", errors: [{ message: 'Use native Array.prototype.map instead' }] },
    { code: "_.map(array, function() { }); var array = []", errors: [{ message: 'Use native Array.prototype.map instead' }] },
    { code: "_.map(globalVar, function() { })", errors: [{ message: 'Use native Array.prototype.map instead' }] },
    { code: "window.array = []; _.map(window.array, function() { })", errors: [{ message: 'Use native Array.prototype.map instead' }] },
    { code: "_.map('string', function() { })", errors: [{ message: 'Use native Array.prototype.map instead' }] },
    { code: "_.map([], function () { }); _ = { map: function() { } }", errors: [{ message: 'Use native Array.prototype.map instead' }] }
  ]
});
