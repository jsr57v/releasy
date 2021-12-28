// 3rd party
const yargs = require('yargs')


//lib dependencies
const GitScraper = require('../lib/GitScraper');
const ReleaseNotesGenerator = require('../lib/ReleaseNotesGenerator');
const ShortcutClient = require('../lib/ShortcutClient');

yargs.command(
    'generate-changelog',
    'Generates a CHANGELOG.MD in the local repository',
    (cmd) => cmd.options({
        app: {
            alias: 'A',
            demand: true,
        },
    }),
    generateChangelog,
)

async function generateChangelog (argv) {
    const gitScraper = new GitScraper();
    const rnGenerator = new ReleaseNotesGenerator(new ShortcutClient(), false, "changelog")

    await gitScraper.parseCleanedReleaseCommitHistory()
    await rnGenerator.generate(gitScraper.commitIntervalHistory, argv.app, gitScraper.versionName)
}   