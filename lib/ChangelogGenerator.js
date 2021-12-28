const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

class ChangelogGenerator {
    constructor() {}

    static async generateChangelog(content) {
        let oldContent = '';
        if (ChangelogGenerator.changelogAlreadyExists()) {
            oldContent = ChangelogGenerator.getOldChangelogCleanedContent();
        }
        const renderedChangelog = await ChangelogGenerator.renderNewChangelog(content, oldContent);
        const renderedLatestMD = await ChangelogGenerator.renderNewLatestMD(content);
        if (ChangelogGenerator.changelogAlreadyExists()) {
            ChangelogGenerator.deleteCurrentChangelog();
        }
        ChangelogGenerator.writeNewChangelog(renderedChangelog);
        ChangelogGenerator.writeNewLatestMD(renderedLatestMD);
        return renderedChangelog;
    }

    static async uploadChangelog(app) {
        /* await execShell('git add CHANGELOG.MD')
        await execShell('git commit -m "Adding changelog [skip ci]"')
        await execShell(`git push https://`)*/
    }

    static changelogAlreadyExists() {
        return fs
            .existsSync(
                path.join(
                    process.cwd(),
                    'CHANGELOG.MD'
                )
            );
    }

    static getOldChangelogCleanedContent() {
        let content = fs.readFileSync(
            path.join(
                process.cwd(),
                'CHANGELOG.MD'
            ), 'utf-8'
        );
        content = content.replace('# Changelog', '');
        return content;
    }

    static writeNewChangelog(renderedChangelog) {
        return fs.writeFileSync('CHANGELOG.MD', renderedChangelog);
    }

    static deleteCurrentChangelog() {
        return fs.unlinkSync('CHANGELOG.MD');
    }

    static renderNewChangelog(changelogContent, oldContent) {
        return ejs.renderFile(`${__dirname}/../templates/changelog/changelog.ejs`, {
            ...changelogContent,
            previousChangelog: oldContent
        },
        {rmWhitespace: true});
    }

    static renderNewLatestMD(content) {
        return ejs.renderFile(`${__dirname}/../templates/changelog/latest.ejs`, {
            ...content
        },
        {rmWhitespace: true});
    }

    static writeNewLatestMD(renderedChangelog) {
        return fs.writeFileSync('LATEST.MD', renderedChangelog);
    }
}

module.exports = ChangelogGenerator;
