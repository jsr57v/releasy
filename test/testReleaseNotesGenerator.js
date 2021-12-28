
const ReleaseNotesGenerator = require('../lib/ReleaseNotesGenerator');
const ShortcutClient = require('../lib/ShortcutClient');
const Notifier = require('../lib/Notifier');

const GS_commitIntervalHistory = require('./wcheckout_commitHistory');
const GS_commitIntervalHistory_noReleaseNotes = require('./wcheckout_commitHistory_noReleaseNotes');
const GS_versionName = 'V1';
const APP = 'webapp-checkout';

/**
 * @param argv
 */
async function testNotes(argv) {
    const rnGenerator = new ReleaseNotesGenerator(new ShortcutClient(), false, 'changelog');

    // await rnGenerator.generate(gitScraper.commitIntervalHistory, argv.app, gitScraper.versionName)
    const releaseNotes = await rnGenerator.generate(GS_commitIntervalHistory, APP, GS_versionName);
    console.log(releaseNotes);
}

/**
 * @param argv
 */
async function testNotifier(argv) {

    console.log('RELEASE NOTES:');
    const rnGenerator = new ReleaseNotesGenerator(new ShortcutClient());
    const releaseNotes = await rnGenerator.generate(GS_commitIntervalHistory, APP, GS_versionName);
    // const releaseNotes = await rnGenerator.generate(GS_commitIntervalHistory_noReleaseNotes, APP, GS_versionName);
    // console.log(releaseNotes);

    console.log('NOTIFIER:');
    const notifier = new Notifier();
    await notifier.notifyRelease(releaseNotes); // OJO si usas esto, utiliza el canal de pruebas en easy.conf
    // await notifier.notifyRelease(releaseNotes, false);
}

// testNotes();
testNotifier();
