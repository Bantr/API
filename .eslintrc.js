module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    "parserOptions": {
        "project": "./tsconfig.json"
    },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    "settings": {
        "import/extensions": [
            ".js",
            ".ts"
        ],
        "import/parsers": {
            "@typescript-eslint/parser": [
                ".ts"
            ]
        },
        "import/resolver": {
            "typescript": {
                "directory": "./tsconfig.json"
            },
            "node": {
                "extensions": [
                    ".js",
                    ".ts"
                ]
            }
        }
    },
    rules: {
        "@typescript-eslint/no-unused-vars": "error",
        '@typescript-eslint/interface-name-prefix': [2, { 'prefixWithI': 'always' }],
        'comma-dangle': [
            2,
            {
                arrays: 'never',
                objects: 'never',
                imports: 'never',
                exports: 'never',
                functions: 'never'
            }
        ],
        "semi": "off",
        "@typescript-eslint/semi": ["error"],
        "object-curly-spacing": ["error", "always"],
        "@typescript-eslint/return-await": "error",
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": false
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/explicit-function-return-type": ["off"]
    }
};