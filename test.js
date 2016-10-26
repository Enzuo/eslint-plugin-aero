"use strict";

/**
 * @see https://github.com/eslint/eslint/blob/master/tests/lib/rules/space-in-parens.js
 * 
 */ 
var rule = require("./eslint-plugin-aero"),
    RuleTester = require("eslint").RuleTester;

const MISSING_SPACE_ERROR = "There must be a space inside this paren.",
    REJECTED_SPACE_ERROR = "There should be no spaces inside this paren.";

var ruleTester = new RuleTester();
ruleTester.run("eslint-plugin-aero", rule, {
    valid: [
        { code: "foo( /* bar */ )", options: ["always"] },
		{ code: "foo\n(\nbar\n)\n", options: ["always"] },
		{ code: "foo( bar )", options: ["always"] },
		{ code: "foo (bar )", options: ["always"] },
    ],

    invalid: [
        /* ALWAYS (space in or outside the bracket) */
        {
            code: "var foo={x:bar}",
            output: "var foo={ x:bar }",
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column: 9}, 
                {message: MISSING_SPACE_ERROR, line: 1, column: 15}
            ]
        },
        /* NEVER (no spaces inside parens, braces, bracket) */
        {
            code: "foo( )",
            output: "foo()",
            options: ["never"],
            errors: [{message: REJECTED_SPACE_ERROR, line: 1, column: 4}]
        },
    ]
});