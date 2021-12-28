/* eslint-disable key-spacing */
/* eslint-disable sort-keys */

module.exports = {
    env: {
        browser:         true,
        'cypress/globals': true,
        es2021:          true,
        jquery:          true,
        mocha:           true,
        node:            true
    },
    extends: [
        'eslint:recommended',
        'plugin:chai-friendly/recommended',
        'plugin:jsdoc/recommended',
        'plugin:node/recommended'
    ],
    parserOptions: {
        ecmaVersion: 12, // Modern ECMAScript features
        sourceType:  'module' // Allow Import syntax
    },
    plugins: [
        'chai-friendly',
        'cypress',
        'sort-class-members'
    ],
    settings: {
        jsdoc: {
            tagNamePreference: {
                augments: {
                    message: '@extends is to be used over @augments as it is more evocative of classes',
                    replacement: 'extends'
                }
            }
        }
    },
    rules: {

        // Chai.js
        'chai-friendly/no-unused-expressions': ['error', {allowTernary: true}],

        // Cypress
        'cypress/assertion-before-screenshot': 'warn',
        'cypress/no-assigning-return-values':  'error',
        'cypress/no-async-tests':              'error',
        'cypress/no-force':                    'warn',
        'cypress/no-unnecessary-waiting':      'error',

        // ESLint
        'accessor-pairs':         'error',
        'array-bracket-spacing':  'error',
        'brace-style':            'error',
        camelcase:              'error',
        'class-methods-use-this': 'error',
        'comma-dangle':           'error',
        'comma-spacing':          'error',
        'comma-style':            'error',
        curly:                  'error',
        'dot-location':           ['error', 'property'],
        'dot-notation':           'error',
        'eol-last':               'error',
        eqeqeq:                 'error',
        'func-call-spacing':      'error',
        indent:                 ['error', 4],
        'key-spacing':            ['error', {align: 'value'}],
        'keyword-spacing':        'error',
        'max-len':                ['error', {
            code:          120,
            ignorePattern: '^export|^const|^import',
            ignoreUrls:    true
        }],
        'new-cap':                       ['error', {capIsNewExceptionPattern: '^constants.'}],
        'new-parens':                    'error',
        'no-array-constructor':          'error',
        'no-console':                    'error',
        'no-duplicate-imports':          'error',
        'no-else-return':                'error',
        'no-eval':                       'error',
        'no-extend-native':              'error',
        'no-extra-bind':                 'error',
        'no-extra-label':                'error',
        'no-extra-parens':               'error',
        'no-floating-decimal':           'error',
        'no-implied-eval':               'error',
        'no-iterator':                   'error',
        'no-label-var':                  'error',
        'no-lone-blocks':                'error',
        'no-multi-spaces':               ['error', {ignoreEOLComments: true}],
        'no-multi-str':                  'error',
        'no-multiple-empty-lines':       ['error', {max: 1}],
        'no-new':                        'error',
        'no-new-func':                   'error',
        'no-new-object':                 'error',
        'no-new-require':                'error',
        'no-new-wrappers':               'error',
        'no-octal-escape':               'error',
        'no-proto':                      'error',
        'no-return-assign':              'error',
        'no-self-compare':               'error',
        'no-sequences':                  'error',
        'no-tabs':                       'error',
        'no-template-curly-in-string':   'error',
        'no-throw-literal':              'error',
        'no-trailing-spaces':            'error',
        'no-undef-init':                 'error',
        'no-undefined':                  'error',
        'no-unmodified-loop-condition':  'error',
        'no-unneeded-ternary':           'error',
        'no-useless-call':               'error',
        'no-useless-constructor':        'error',
        'no-useless-rename':             'error',
        'no-void':                       'error',
        'no-whitespace-before-property': 'error',
        'object-curly-spacing':          'error',
        'one-var':                       ['error', 'never'],
        'operator-linebreak':            ['error', 'after'],
        quotes:                        ['error', 'single'],
        semi:                          ['error', 'always', {omitLastInOneLineBlock: true}],
        'semi-spacing':                  'error',
        'sort-imports':                  ['error', {ignoreCase: true}],
        'sort-keys':                     ['error', 'asc', {caseSensitive: false, natural: true}],
        'sort-vars':                     'error',
        'space-before-blocks':           'error',
        'space-before-function-paren':   ['error', 'never'],
        'space-in-parens':               'error',
        'space-infix-ops':               'error',
        'space-unary-ops':               ['error', {
            nonwords: true,
            words:    true
        }],
        'spaced-comment':         ['error', 'always', {markers: ['/']}],
        'template-curly-spacing': 'error',
        yoda:                   'error',

        // JSDoc
        'jsdoc/check-tag-names':   ['warn', {definedTags:['mermaid']}],
        'jsdoc/match-description': ['warn', {
            // First letter in uppercase + any lowercase letters + any character + dot (.)
            matchDescription: '^[A-Z][a-z].*\\.',
            tags:             {
                description: true,
                param:       true,
                returns:     true
            }
        }],
        'jsdoc/no-bad-blocks':      'warn',
        'jsdoc/no-undefined-types': ['error',
            {
                definedTypes: [
                    'Chainable',
                    'JQuery',
                    'RequestBody',
                    'Subject'
                ]
            }
        ],
        'jsdoc/require-asterisk-prefix':                 'warn',
        'jsdoc/require-description':                     'warn',
        'jsdoc/require-hyphen-before-param-description': ['warn', 'never'],
        'jsdoc/tag-lines':                               ['warn', 'always', {
            noEndLines: true,
            tags:       {
                class:    {lines: 'never'},
                param:    {lines: 'never'}
            }
        }],

        // NodeJS
        'node/exports-style':                     'error',
        'node/file-extension-in-import':          ['error', 'never'],
        'node/no-callback-literal':               'error',
        'node/no-unsupported-features/es-syntax': ['error', {ignores: ['modules']}],
        'node/prefer-global/buffer':              'error',
        'node/prefer-global/console':             'error',
        'node/prefer-global/process':             'error',
        'node/prefer-global/text-decoder':        'error',
        'node/prefer-global/url':                 'error',
        'node/prefer-global/url-search-params':   'error',
        'node/prefer-promises/dns':               'error',
        'node/prefer-promises/fs':                'error',

        // Sort class members
        'sort-class-members/sort-class-members': ['error', {
            accessorPairPositioning: 'getThenSet',
            order: [
                {group: '[static-properties]', sort: 'alphabetical'},
                {group: '[static-methods]', sort: 'alphabetical'},
                {group: '[properties]', sort: 'alphabetical'},
                {group: '[conventional-private-properties]', sort: 'alphabetical'},
                {name: 'constructor'},
                {group: 'methods]', sort: 'alphabetical'},
                {group: '[conventional-private-methods]', sort: 'alphabetical'}
            ]
        }]
    }
};
