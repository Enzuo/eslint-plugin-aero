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
            description: "enforce consistent spacing inside parentheses",
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
                    exceptions: {
                        type: "array",
                        items: {
                            enum: ["{}", "[]", "()", "empty"]
                        },
                        uniqueItems: true
                    }
                },
                additionalProperties: false
            }
        ]
    },

    create(context) {

        const MISSING_SPACE_MESSAGE = "There must be a space inside this paren.",
            REJECTED_SPACE_MESSAGE = "There should be no spaces inside this paren.",
            ALWAYS = context.options[0] === "always",

            exceptionsArrayOptions = (context.options.length === 2) ? context.options[1].exceptions : [],
            options = {};
        let exceptions;

        if (exceptionsArrayOptions.length) {
            options.braceException = exceptionsArrayOptions.indexOf("{}") !== -1;
            options.bracketException = exceptionsArrayOptions.indexOf("[]") !== -1;
            options.parenException = exceptionsArrayOptions.indexOf("()") !== -1;
            options.empty = exceptionsArrayOptions.indexOf("empty") !== -1;
        }

        /**
         * Produces an object with the opener and closer exception values
         * @param {Object} opts The exception options
         * @returns {Object} `openers` and `closers` exception values
         * @private
         */
        function getExceptions() {
            const openers = [],
                closers = [];


            openers.push("{");
            closers.push("}");



            openers.push("[");
            closers.push("]");



            openers.push("(");
            closers.push(")");


            if (options.empty) {
                openers.push(")");
                closers.push("(");
            }

            return {
                openers,
                closers
            };
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
            return token.type === "Punctuator" && exceptions.openers.indexOf(token.value) >= 0;
        }

        /**
         * Determines if a token is one of the exceptions for the closer paren
         * @param {Object} token The token to check
         * @returns {boolean} True if the token is one of the exceptions for the closer paren
         */
        function isCloserException(token) {
            return token.type === "Punctuator" && exceptions.closers.indexOf(token.value) >= 0;
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
            if (sourceCode.isSpaceBetweenTokens(left, token)) {
                return false;
            }

            if (ALWAYS) {
                if (right.type === "Punctuator" && right.value === ")") {
                    return false;
                }
                return !isOpenerException(right);
            } else {
                return isOpenerException(right);
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
                return false;
            }
        }

        /**
         * Determines if an opener paren should not have an existing space after it
         * @param {Object} left The paren token
         * @param {Object} right The token after it
         * @returns {boolean} True if the paren should reject the space
         */
        function shouldOpenerRejectSpace(left, right) {
            if (right.type === "Line") {
                return false;
            }

            if (!isTokenOnSameLine(left, right)) {
                return false;
            }

            if (!sourceCode.isSpaceBetweenTokens(left, right)) {
                return false;
            }

            if (ALWAYS) {
                return isOpenerException(right);
            } else {
                return !isOpenerException(right);
            }
        }

        /**
         * Determines if an closer paren should not have an existing space after it
         * @param {Object} left The token before the paren
         * @param {Object} right The paren token
         * @returns {boolean} True if the paren should reject the space
         */
        function shouldCloserRejectSpace(left, right) {
            if (left.type === "Punctuator" && left.value === "(") {
                return false;
            }

            if (!isTokenOnSameLine(left, right)) {
                return false;
            }

            if (!sourceCode.isSpaceBetweenTokens(left, right)) {
                return false;
            }

            if (ALWAYS) {
                return isCloserException(left);
            } else {
                return !isCloserException(left);
            }
        }

        //--------------------------------------------------------------------------
        // Public
        //--------------------------------------------------------------------------

        return {
            Program: function checkSpaces(node) {
                exceptions = getExceptions();
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