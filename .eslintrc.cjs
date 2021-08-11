module.exports = {
    env: {
        es2021: true,
        node: true,
        jest: true,
    },
    extends: ['airbnb-base', 'eslint:recommended', 'plugin:jest/recommended'],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['jest'],
    rules: {
        'arrow-parens': 'off',
        eqeqeq: 'error',
        'function-paren-newline': 'off',
        indent: ['error', 4],
        'linebreak-style': [2, 'unix'],
        'no-console': [
            'error',
            {
                allow: ['info', 'warn', 'error', 'time', 'timeEnd'],
            },
        ],
        'no-duplicate-imports': 'error',
        'no-extra-parens': 'error',
        'no-return-await': 'error',
        'no-plusplus': 'off',
        'no-shadow': [
            'error',
            {
                builtinGlobals: false,
                hoist: 'functions',
                allow: [],
            },
        ],
        'operator-linebreak': [2, 'before', { overrides: { '?': 'after' } }],
        'import/prefer-default-export': 'off',
        'import/extensions': [0, { js: 'always' }],
        'import/no-extraneous-dependencies': 'off',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
    },
};
