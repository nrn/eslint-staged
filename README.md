# eslint-staged
A simple way to run eslint on staged changes.

```
npm install --save-dev eslint-staged
```

Pairs great with (husky)[npm.im/husky]. Install husky, and add a precommit
script to your package.json:

```
{
  "scripts": {
    "precommit": "eslint-staged"
  }
}
```

This lets you make sure you always lint the changes you're actually
committing, not just your working tree. Run it any time with
`npm run -s precommit`.

