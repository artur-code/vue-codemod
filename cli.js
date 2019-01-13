#!/usr/bin/env node
const parser = require("./src/parser")

require('yargs')
    .usage('$0 <cmd> [args]')
    .command('transform [path]', 'run transform vue project by codemod scripts', (yargs) => {
      yargs.positional('path', {
        type: 'string',
        default: '',
        describe: 'files or directory to transform'
      })
    }, function (argv) {
      // TODO check script - path or name existing transform
      const scriptFunction = require(argv.script).defaults
      parser.parse(argv.path, scriptFunction)
    })
    .option('script', {
        alias: 's',
        type: 'string',
        demandOption: true,
        describe: 'path to the transform file, see available scripts below'
    })
    .help()
    .argv
