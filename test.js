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
		{ code: "foo (bar)", options: ["always"] },
    ],

    invalid: [
        /***********************************************
         * ALWAYS (space in or outside the bracket)
         ***********************************************/ 
        { 
            code: "foo (bar )",
            output: "foo (bar)", 
            options: ["always"],
            errors: [
                 {message: REJECTED_SPACE_ERROR, line: 1, column:10}
            ] 
        },
        {
            code: "foo ( bar)",
            output: "foo (bar)", 
            options: ["always"],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column:5}
            ]  
        },
        {
            code: "foo( bar)",
            output: "foo( bar )", 
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:9}
            ]  
        },
        {
            code: "foo(bar )",
            output: "foo( bar )", 
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:4}
            ]  
        },
        {
            code: "foo(bar)",
            output: "foo( bar )", 
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:4},
                {message: MISSING_SPACE_ERROR, line: 1, column:8}
            ]  
        },
        /* exceptions ( */
        {
            code: "foo({x:bar})",
            output: "foo({ x:bar })", 
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:5},
                {message: MISSING_SPACE_ERROR, line: 1, column:11}
            ]  
        },
        {
            code: "foo ({x:bar}) ",
            output: "foo ({ x:bar }) ", 
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:6},
                {message: MISSING_SPACE_ERROR, line: 1, column:12}
            ]  
        },
        // TODO
        // {
        //     code: "foo ({ x:bar }) ",
        //     output: "foo ({x:bar}) ", 
        //     options: ["always", "cascade"],
        //     errors: [
        //         {message: MISSING_SPACE_ERROR, line: 1, column:6},
        //         {message: MISSING_SPACE_ERROR, line: 1, column:12}
        //     ]  
        // },
        /*empty*/
        {
            code: "foo( )",
            output: "foo()", 
            options: ["always"],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column:4},
                {message: REJECTED_SPACE_ERROR, line: 1, column:6},
            ]  
        },
        /*e

    //     {
    //         code: "var foo={x:bar}",
    //         output: "var foo={ x:bar }",
    //         options: ["always"],
    //         errors: [
    //             {message: MISSING_SPACE_ERROR, line: 1, column: 9}, 
    //             {message: MISSING_SPACE_ERROR, line: 1, column: 15}
    //         ]
    //     },
    //     /* NEVER (no spaces inside parens, braces, bracket) */
    //     {
    //         code: "foo( )",
    //         output: "foo()",
    //         options: ["never"],
    //         errors: [{message: REJECTED_SPACE_ERROR, line: 1, column: 4}]
    //     },
    ]
});