module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'style',
        'chore',
        'docs',
        'refactor',
        'perf',
        'test',
        'ci',
        'revert',
        'build'
      ]
    ],
    'type-case': [0],
    'type-empty': [2, 'never'],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0],
    'subject-case': [0],
    'header-max-length': [2, 'always', 200]
  }
}; 