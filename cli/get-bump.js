// 3rd party
const yargs = require('yargs')

// lib dependencies
const GitScraper = require('../lib/GitScraper');
const ReleaseNotesGenerator = require('../lib/ReleaseNotesGenerator');
const ShortcutClient = require('../lib/ShortcutClient');

yargs.command(
    'get-bump',
    'infers sem-version to be dumped depending on changes from last tag',
    () => {},
    getBump,
)

async function getBump (argv) {
    const gitScraper = new GitScraper();
    const rnGenerator = new ReleaseNotesGenerator(new ShortcutClient(), true)

    await gitScraper.parseCleanedReleaseCommitHistory({ bumpMode: true })

    await rnGenerator.generate(gitScraper.commitIntervalHistory)

    process.stdout.write(
        rnGenerator.getVersionBump()
    )
}