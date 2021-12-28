// 3rd party
const yargs = require('yargs');

// lib dependencies
const GitScraper = require('../lib/GitScraper');
const ReleaseNotesGenerator = require('../lib/ReleaseNotesGenerator');
const ShortcutClient = require('../lib/ShortcutClient');
const Notifier = require('../lib/Notifier');

yargs.command(
    'notify',
    'notifies via slack changes between last 2 tags',
    (cmd) => cmd.options({
        app: {
            alias:  'a',
            demand: true
        }
    }),
    nofifyRelease
);

/**
 * @param argv
 */
async function nofifyRelease(argv) {
    const notifier = new Notifier();
    const gitScraper = new GitScraper();
    const rnGenerator = new ReleaseNotesGenerator(new ShortcutClient());

    await gitScraper.parseCleanedReleaseCommitHistory();
    const releaseNotes = await rnGenerator.generate(gitScraper.commitIntervalHistory, argv.app, gitScraper.versionName);
    await notifier.notifyRelease(releaseNotes);
}

