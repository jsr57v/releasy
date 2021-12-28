#!/usr/bin/env node

const yargs = require('yargs');

require('dotenv').config();

require('./cli/get-tags');
require('./cli/get-bump');
require('./cli/notify');
require('./cli/create-gh-release');
require('./cli/generate-changelog')

yargs
    .demandCommand(1, 'must provide a valid command')
    .strict()
    .help()
    .argv;