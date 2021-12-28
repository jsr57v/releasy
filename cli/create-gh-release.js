// 3rd party
const yargs = require('yargs')


//lib dependencies
const GithubReleaser = require('../lib/GithubReleaser')
yargs.command(
    'github-release',
    'Creates a GitHub release based on the content of package.json ( for the versioning )',
    (cmd) => cmd.options({
        app: {
            alias: 'A',
            demand: true,
        },
    }),
    createGithubRelease,
)

async function createGithubRelease (argv) {
    const ghReleaser = new GithubReleaser(argv.app)
    const releaseText = ghReleaser.getReleaseText()
    await ghReleaser.sendRelease(releaseText)
}   