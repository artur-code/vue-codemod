const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const parse5 = require('parse5')
const stat = promisify(fs.stat);
const parser = require("@babel/parser")
const traverse = require("@babel/traverse");
const types = require("@babel/types")
const babelGenerator = require("@babel/generator")

// recursively get all files in a directory
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

function getNodesFromSource (source) {
  return parse5.parseFragment(source).childNodes
}

function toSource(ast) {
  const source = babelGenerator(ast).code
  // TODO source to file
}

exports.parse = async (path, script) => {
  const files = (await stat(path)).isDirectory() ? await getFiles(path) : [path]
  files.forEach(file => {

    // TODO validate file format
    fs.readFile(file, 'utf8', (err, source) => {
      if (err) {
        console.error(err);
      } else {
       const nodes = getNodesFromSource(source)
       const scriptNode = nodes.find(node => node.nodeName === 'script')
       const codeSrt = parse5.serialize(scriptNode)

        console.log(codeSrt, 'Source')

       const ast = parser.parse(codeSrt, {
          // parse in strict mode and allow module declarations
          sourceType: "module",

          plugins: [
            'decorators-legacy',
            "flow"
          ]
        });

        // TODO need bind to toSource function file specific arguments
        script(ast, {
          traverse,
          toSource,
          types
        })
      }
    })
  })
}
