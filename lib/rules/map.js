/**
 * @fileoverview Check lodash map method
 * @author Dmitry Zaytsev
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "Check lodash map method",
      category: "Collection map",
      recommended: false
    },
    fixable: "code",  // or "code" or "whitespace"
    schema: []
  },

  create: function (context) {
    // variables should be defined here
    const sourceCode = context.getSourceCode()

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const getReplaceText = nodes => {
      const [nodeCode, collectionCode, mapFnCode] = nodes.map(n => sourceCode.getText(n))

      // *TODO: add tab formatting | Created at: 25.Sep.2019
      return `Array.isArray(${collectionCode})\n\t? ${collectionCode}.map(${mapFnCode})\n\t: ${nodeCode}`
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      CallExpression(node) {
        const { arguments: [collection, mapFn], callee: { object, property } } = node

        if (object.name !== '_') return
        if (property.name !== 'map') return
        if (!collection || !mapFn) return // collection and map function

        context.report({
          node,
          message: 'Use native Array map instead',
          fix(fixer) {
            return fixer.replaceText(node, getReplaceText([node, collection, mapFn]))
          }
        })
      }
    };
  }
};
