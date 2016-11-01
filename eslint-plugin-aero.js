/**
 * @fileoverview Disallows or enforces spaces inside of parentheses.
 * @author Enzuo based on the work of Jonathan Rajavuori
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent spacing inside parens, brace, bracket",
            category: "Stylistic Issues",
            recommended: false
        },

        fixable: "whitespace",

        schema: [
            {
                enum: ["always", "never"]
            },
            {
                type: "object",
                properties: {
                    inside: {
                        type: "array",
                        items: {
                            enum: ["{}", "[]", "()", "empty"]
                        },
                        uniqueItems: true
                    },
                    loose: {
                        type: "array",
                        items: {
                            enum: ["{}", "[]", "()"]
                        },
                        uniqueItems: true
                    },
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const MISSING_SPACE_MESSAGE = "There must be a space inside this paren."
        const REJECTED_SPACE_MESSAGE = "There should be no spaces inside this paren."
        const ALWAYS = context.options[0] === "always"
        const looseArray = (context.options.length === 2) && context.options[1].loose ? context.options[1].loose : []
        const insideArray = (context.options.length === 2) && context.options[1].inside ? context.options[1].inside : []
        const options = {}
        let punctuators

        /**
         * Produces an object with the opener and closer exception values
         * @param {Object} opts The exception options
         * @returns {Object} `openers` and `closers` exception values
         * @private
         */
        function getPunctuators() {
            const openers = ["(", "{", "["]
            const closers = [")", "}", "]"]
            const loose = [] 
            const inside = []
            
            for(let string of looseArray){
                for(let char of string){
                    loose.push(char)
                }
            }

            insideArray.map( (couple) => {
                if (couple === '()') {
                    return inside.push('(')
                }
                if (couple === '{}') {
                    return inside.push('{')
                }
                if (couple === '[]') {
                    return inside.push('[')
                }
            })

            return {
                openers,
                closers,
                loose,
                inside,
            }
        }

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------
        const sourceCode = context.getSourceCode();

        /**
         * eslint astUtils isTokenOnSameLine
         */
        function isTokenOnSameLine(left, right) {
            return left.loc.end.line === right.loc.start.line;
        }

        /**
         * Determines if a token is one of the exceptions for the opener paren
         * @param {Object} token The token to check
         * @returns {boolean} True if the token is one of the exceptions for the opener paren
         */
        function isOpenerException(token) {
            return token.type === "Punctuator" && punctuators.openers.indexOf(token.value) >= 0;
        }

        function isPunctator(token) {
            return token.type === "Punctuator" && (punctuators.openers.indexOf(token.value) >= 0 || punctuators.closers.indexOf(token.value) >= 0 );
        }

        function isloose(token) {
            return token.type === "Punctuator" && punctuators.loose.indexOf(token.value) >= 0;
        }

        function isInside(token) {
            return token.type === "Punctuator" && punctuators.inside.indexOf(token.value) >= 0;
        }

        /**
         * Determines if a token is one of the exceptions for the closer paren
         * @param {Object} token The token to check
         * @returns {boolean} True if the token is one of the exceptions for the closer paren
         */
        function isCloserException(token) {
            return token.type === "Punctuator" && punctuators.closers.indexOf(token.value) >= 0;
        }

        /**
         * Determines if an opener paren should have a missing space after it
         * @param {Object} left The paren token
         * @param {Object} right The token after it
         * @returns {boolean} True if the paren should have a space
         */
        function shouldOpenerHaveRightSpace(token, left, right) {
            if (!isTokenOnSameLine(token, right)) {
                return null;
            }
            if (sourceCode.isSpaceBetweenTokens(left, token) && !isInside(token)) {
                return false;
            }

            if (ALWAYS) {
                if (right.type === "Punctuator" && right.value === ")") {
                    return false;
                }
                if (isPunctator(right) === true) {
                    return isloose(right) ? null : false 
                } 
                return true
            } else {
                return false;
            }
        }

        /**
         * Determines if an closer paren should have a missing space after it
         * @param {Object} left The token before the paren
         * @param {Object} right The paren token
         * @returns {boolean} True if the paren should have a space
         */
        function shouldCloserHaveLeftSpace(token, left, openerHasSpace) {
            if (!isTokenOnSameLine(left, token)) {
                return null;
            }
            if (left.type === "Punctuator" && left.value === "(") {
                return false;
            }

            if (openerHasSpace && !isCloserException(left)) {
                return true;
            } else {
                return isloose(left) ? null : false;
            }
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program: function checkSpaces(node) {
                punctuators = getPunctuators();
                const tokens = sourceCode.tokensAndComments;
                var lastOpenerSpaceRight = false;

                tokens.forEach(function(token, i) {
                    const prevToken = tokens[i - 1];
                    const nextToken = tokens[i + 1];

                    if (token.type !== "Punctuator") {
                        return;
                    }

                    var opener = false
                    if (token.value === "(" || token.value === "{" || token.value === "[" ) {
                        opener = true
                    }

                    var closer = false
                    if (!opener && (token.value === ")" || token.value === "}" || token.value === "]" )) {
                        closer = true
                    }

                    if (!opener && !closer) {
                        return;
                    }

                    if(opener){
                        var hasSpaceRight = lastOpenerSpaceRight = sourceCode.isSpaceBetweenTokens(token, nextToken)
                        if(!hasSpaceRight && shouldOpenerHaveRightSpace(token, prevToken, nextToken) === true ){
                            lastOpenerSpaceRight = true;
                            context.report({
                                node,
                                loc: token.loc.start,
                                message: MISSING_SPACE_MESSAGE,
                                fix(fixer) {
                                    return fixer.insertTextAfter(token, " ");
                                }
                            });
                        }
                        if(hasSpaceRight && shouldOpenerHaveRightSpace(token, prevToken, nextToken) === false ){
                            lastOpenerSpaceRight = false;
                            context.report({
                                node,
                                loc: token.loc.start,
                                message: REJECTED_SPACE_MESSAGE,
                                fix(fixer) {
                                    return fixer.removeRange([token.range[1], nextToken.range[0]]);
                                }
                            });
                        }
                    }

                    if(closer){
                        var hasSpaceLeft = sourceCode.isSpaceBetweenTokens(prevToken, token)
                        if(!hasSpaceLeft && shouldCloserHaveLeftSpace(token, prevToken, lastOpenerSpaceRight) === true){
                            context.report({
                                node,
                                loc: token.loc.start,
                                message: MISSING_SPACE_MESSAGE,
                                fix(fixer) {
                                    return fixer.insertTextBefore(token, " ");
                                }
                            });    
                        }
                        if(hasSpaceLeft && shouldCloserHaveLeftSpace(token, prevToken, lastOpenerSpaceRight) === false){
                            context.report({
                                node,
                                loc: token.loc.start,
                                message: REJECTED_SPACE_MESSAGE,
                                fix(fixer) {
                                    return fixer.removeRange([prevToken.range[1], token.range[0]]);
                                }
                            });  
                        }
                    }
                    
                });
            }
        };

    }
};