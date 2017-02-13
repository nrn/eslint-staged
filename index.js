#!/usr/bin/env node

var cp = require('child_process')

cp.exec("git diff --staged --diff-filter=ACMTUXB --name-only -- '*.js'", { encoding: 'utf8' }, function (err, stdout, stderr) {
  if (stderr) console.error(stderr)
  if (err) {
    throw err
  }

  stdout.split('\n')
    .reduce(function (next, name, idx) {
      if (name) {
        var contents = cp.spawn('git', [ 'show', ':' + name ])
        var lint = cp.spawn('eslint', [ '--color', '--stdin', '--stdin-filename=' + name ])
        contents.stdout.pipe(lint.stdin)
        contents.stderr.pipe(process.stderr)
        return function (code) {
          lint.stdout.pipe(process.stdout)
          lint.stderr.pipe(process.stderr)
          lint.on('close', function (exitCode) {
            next(exitCode > code ? exitCode : code)
          })
        }
      } else {
        return function (code) {
          process.nextTick(function () {
            next(code)
          })
        }
      }
    }, function (code) {
      process.exit(code)
    })(0) // start it off with an expected 0 exit code.
})

