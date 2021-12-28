// 3rd party
const yargs = require('yargs')
const semver = require('semver')

// lib dependencies
const GitScraper = require('../lib/GitScraper');

yargs.command(
    'get-tags',
    'gets a list of git tags',
    (cmd) => cmd.options({
        last: {},
        abbref: {},
        indent: { alias: 'i' },
        'sort-by': { alias: 's' },
    }),
    getTags,
)

async function getTags (argv) {
    const { last = null, abbref = null, sortBy = null } = argv
    const tags = await GitScraper.getTags({
        last,
        abbref,
        sortBy: sortBy === 'version'
            ? (a,b) => semver.gt(a.version, b.version)
            : sortBy && ((a, b) => a > b ? 1 : -1 )
        ,
    })

    process.stdout.write(
        JSON.stringify(tags, null, argv.indent ? '  ' : '')
    )
}