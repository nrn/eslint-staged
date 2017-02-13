var cp = require('child_process')

cp.exec("git diff --staged --diff-filter=ACMTUXB --name-only -- '*.js'", { encoding: 'utf8' }, function (err, stdout, stderr) {
  if (err) {
    throw err
  }
  console.error(stderr)
  stdout.split('\n')
    .reduce(function (next, name, idx) {
      return function (code) {
        if (name) {
          var contents = cp.spawn('git', [ 'show', ':' + name ])
          var lint = cp.spawn('eslint', [ '--color', '--stdin', '--stdin-filename=' + name ])
          contents.stdout.pipe(lint.stdin)
          contents.stderr.pipe(process.stderr)
          lint.stdout.pipe(process.stdout)
          lint.stderr.pipe(process.stderr)
          lint.on('close', function (exitCode) {
            next(exitCode > code ? exitCode : code)
          })
        } else {
          process.nextTick(function () {
            next(code)
          })
        }
      }
    }, function (code) {
      process.exit(code)
    })(0) // start it off with an expected 0 exit code.
})

