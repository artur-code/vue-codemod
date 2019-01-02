#!/usr/bin/env node

require('yargs')
    .usage('$0 <cmd> [args]')
    .command('transform [path]', 'run transform vue project by codemod scripts', (yargs) => {
      yargs.positional('path', {
        type: 'string',
        default: '',
        describe: 'files or directory to transform'
      })
    }, function (argv) {
      console.log('hello', argv.path)
    })
    .option('script', {
        alias: 's',
        type: 'string',
        demandOption: true,
        describe: 'path to the transform file, see available scripts below'
    })
    .help()
    .argv