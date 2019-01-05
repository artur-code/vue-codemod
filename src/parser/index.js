const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const parse5 = require('parse5')
const stat = promisify(fs.stat);
const parser = require("@babel/parser")

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

exports.parse = async (path) => {
  const files = await getFiles(path)

  files.forEach(file => {
    fs.readFile(file, 'utf8', (err, source) => {
      if (err) {
        console.error(err);
      } else {

       const nodes = getNodesFromSource(source)
       const scriptNode = nodes.find(node => node.nodeName === 'script')
       const codeSrt = parse5.serialize(scriptNode)

       const result = parser.parse(codeSrt, {
          // parse in strict mode and allow module declarations
          sourceType: "module",

          plugins: [
            // enable flow syntax
            "flow"
          ]
        });

        console.log(result);
      }
    });
  })
}
