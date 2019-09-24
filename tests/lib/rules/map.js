/**
 * @fileoverview Check lodash map method
 * @author Dmitry Zaytsev
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/map"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("map", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "_.map([42, 3, 14], function(value) { return value * 2; })",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
