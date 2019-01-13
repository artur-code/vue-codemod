exports.defaults = function(ast, api, options = {}) {
  const { toSource, traverse, types } = api

  traverse.default(ast, {
    enter(path) {
      console.log(path)
    }
  })
}
