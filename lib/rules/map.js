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
    const getNodeCodes = (...nodes) => nodes.map(getNodeCode)

    const getConditionalReplaceText = (indent, [collectionCode, mapFnCode]) => {
      return `Array.isArray(${collectionCode})\n${indent}? ${collectionCode}.map(${mapFnCode})\n${indent}: `
    }

    const getArrayReplaceText = ([collectionCode, mapFnCode]) => {
      return `${collectionCode}.map(${mapFnCode})`
    }

    const getIndent = node => {
      const startColumn = node.parent.loc.start.column

      return ' '.repeat(startColumn + INDENT_SIZE)
    }

    const isInCondition = node => {
      if (
        node.type !== 'ConditionalExpression' ||
        node.test.type !== 'CallExpression' ||
        node.test.callee.object.name !== 'Array' ||
        node.test.callee.property.name !== 'isArray'
      ) return false

      return true
    }

    const isDeclared = (variable, reference) => {
      return variable.identifiers[0].range[1] <= reference.identifier.range[1]
    }

    const getTypeOfVariable = node => {
      const scope = context.getScope()
      const reference = scope.references.find(r => node.name === r.identifier.name)
      const variable = reference.resolved

      if (variable === null) return null
      if (!isDeclared(variable, reference)) return null

      try {
        return reference.resolved.defs[0].node.init.type
      } catch {
        return null
      }
    }

    const getNodeType = node => {
      if (node.type === 'Identifier') return getTypeOfVariable(node)
      if (/(Array|Object)Expression/.test(node.type)) return node.type

      return null
    }

    return {
      "CallExpression[callee.object.name='_'][callee.property.name='map']"(node) {
        const { arguments: [collection, mapFn] } = node

        if (isUnderscoreRedefined) return
        if (!collection || !mapFn) return
        if (isInCondition(node.parent)) return

        const type = getNodeType(collection)

        if (type === 'ObjectExpression') return

        const nodeCodes = getNodeCodes(collection, mapFn)
        const indent = getIndent(node)

        context.report({
          node,
          message: 'Use native Array.prototype.map instead',
          fix(fixer) {
            return type === 'ArrayExpression'
              ? fixer.replaceText(node, getArrayReplaceText(nodeCodes))
              : fixer.insertTextBefore(node, getConditionalReplaceText(indent, nodeCodes))
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
          node.left.property.name !== '_'
        ) return

        isUnderscoreRedefined = true
      }
    };
  }
};
