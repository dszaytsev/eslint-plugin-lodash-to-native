/**
 * @fileoverview Check lodash map method
 * @author Dmitry Zaytsev
 */
"use strict";

// hardcoded because I have no idea how to detect indent size
const INDENT_SIZE = 2

module.exports = {
  meta: {
    docs: {
      description: "Check lodash map method",
      category: "Collection map",
      recommended: false
    },
    fixable: "code",
    schema: []
  },

  create(context) {
    let isUnderscoreRedefined = false

    const sourceCode = context.getSourceCode()
    const getNodeCode = node => sourceCode.getText(node)

    const getReplaceText = (indent, nodes) => {
      const [collectionCode, mapFnCode] = nodes.map(getNodeCode)

      return `Array.isArray(${collectionCode})\n${indent}? ${collectionCode}.map(${mapFnCode})\n${indent}: `
    }

    const getIndent = node => {
      const startColumn = node.parent.loc.start.column

      return ' '.repeat(startColumn + INDENT_SIZE)
    }

    const hasMapCondition = node => {
      if (
        node.type !== 'ConditionalExpression' ||
        node.test.type !== 'CallExpression' ||
        node.test.callee.object.name !== 'Array' ||
        node.test.callee.property.name !== 'isArray'
      ) return false

      return true
    }

    return {
      "CallExpression[callee.object.name='_'][callee.property.name='map']"(node) {
        const { arguments: [collection, mapFn] } = node

        if (isUnderscoreRedefined) return
        if (!collection || !mapFn) return
        if (hasMapCondition(node.parent)) return

        // todo find this and check:
        // context.getScope().through[0].identifier.name

        context.report({
          node,
          message: 'Use native Array map instead',
          fix(fixer) {
            // *TODO: написать стратежку, подвязанную на typeof variable | Created at: 26.Sep.2019
            return fixer.insertTextBefore(node, getReplaceText(
              getIndent(node),
              [collection, mapFn]
            ))
          }
        })
      },
      "VariableDeclaration[declarations.0.id.name='_']"(node) {
        if (isUnderscoreRedefined) return
        else isUnderscoreRedefined = true
      },
      "AssignmentExpression:matches([left.name='_'], [left.object.name=/window|global/])"(node) {
        if (isUnderscoreRedefined) return

        if (
          node.left.type === 'MemberExpression' &&
          node.left.property.name !==  '_'
        ) return

        isUnderscoreRedefined = true
      }
    };
  }
};
