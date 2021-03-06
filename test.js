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
		{ code: "myfunc( function (bar) {var foo = bar})", options: ["always"] },
		{ code: "myfunc( function (bar){ var foo = bar })", options: ["always"] },
		{ code: "then(( foo ) => {\nbar=foo\n})", options: ["always"], parserOptions: { ecmaVersion: 6 }},
		{ code: "then( (foo) => {\nbar=foo\n})", options: ["always", { loose : [ '()' ]}], parserOptions: { ecmaVersion: 6 }},
		{ code: "then( (x+1) )", options: ["always", { loose : [ '()' ]}]},
        //TODO check here
        { code: "a = { foo( x+1 ) }", options: ["always", { loose : [ '()' ], inside : [ '{}' ]}]},
		{ code: "a = { x : foo }", options: ["always", { inside : [ '{}' ]}]},
		{ code: "function bar () {}", options: ["always", { inside : [ '{}' ]}]},
		{ code: "if (foo( a ) === bar) {}", options: ["always"]},
		{ code: "if( foo( a ) === bar ){}", options: ["always"]},
        /* never */
        { code: "foo(/* bar */)", options: ["never"] },
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
        // exceptions ( 
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
        // empty 
        {
            code: "foo( )",
            output: "foo()", 
            options: ["always"],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column:4},
                {message: REJECTED_SPACE_ERROR, line: 1, column:6},
            ]  
        },
        {
            code: "function foo () { }",
            output: "function foo () {}", 
            options: ["always", {"inside" : ["{}"]}],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column:17},
                {message: REJECTED_SPACE_ERROR, line: 1, column:19},
            ]  
        },
        // chain
        {
            code: "myfunc( function (bar){var foo = bar} )",
            output: "myfunc( function (bar){ var foo = bar })",
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:23},
                {message: MISSING_SPACE_ERROR, line: 1, column:37},
                {message: REJECTED_SPACE_ERROR, line: 1, column:39},
            ]  
        },
        {
            code: "myfunc( function (bar) {var foo = bar} )",
            output: "myfunc( function (bar) {var foo = bar})",
            options: ["always"],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column:40},
            ]
        },
        {
            code: "if( foo (a) === bar){}",
            output: "if( foo (a) === bar ){}",
            options: ["always"],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:20},
            ]
        },
        /***********************************************
         * Options 
         ***********************************************/
        //options : inside, force space to be inside the parens, brace or bracket 
        {
            code: "var a = {x:1}",
            output: "var a = { x:1 }",
            options: ["always", {inside : ["{}"]}],
            errors: [
                {message: MISSING_SPACE_ERROR, line: 1, column:9},
                {message: MISSING_SPACE_ERROR, line: 1, column:13},
            ]
        },         

        /***********************************************
         * NEVER (space in or outside the bracket)
         ***********************************************/ 

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
        {
            code: "foo( )",
            output: "foo()",
            options: ["never"],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column: 4},
                {message: REJECTED_SPACE_ERROR, line: 1, column: 6}
            ]
        },
        {
            code: "foo( x )",
            output: "foo(x)",
            options: ["never"],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column: 4},
                {message: REJECTED_SPACE_ERROR, line: 1, column: 8}
            ]
        },
        {
            code: "function foo() { }",
            output: "function foo() {}",
            options: ["never"],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column: 16},
                {message: REJECTED_SPACE_ERROR, line: 1, column: 18}
            ]
        },
        //inside option has no influence
        {
            code: "function foo() { }",
            output: "function foo() {}",
            options: ["never", {"inside" : ['{}']}],
            errors: [
                {message: REJECTED_SPACE_ERROR, line: 1, column: 16},
                {message: REJECTED_SPACE_ERROR, line: 1, column: 18}
            ]
        },
    ]
});