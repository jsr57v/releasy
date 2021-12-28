const ejs = require('ejs');
const moment = require('moment');
const easyConf = require('../easy.conf');
const ChangelogGenerator = require('./ChangelogGenerator');

class ReleaseNotesGenerator {

    constructor(CHClient, bumpMode, mode) {
        this.appName = '';
        this.releaseNotesRawObj = {
            easyConf,
            features: [],
            fixes:    [],
            chores:   [],
            hotfixes: [],
            reverts:  [],
            release:  {
                name: '',
                date: moment().format('DD/MM/YY'),
                time: moment().add(1, 'hours').format('HH:mm'),
                link: ''
            }
        };
        this.mode = mode;
        this.bumpMode = bumpMode;
        this.commitIntervalHistory = [];
        this.regExps = {
            // 'features': /^\s*\[feat\/ch(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            // 'fixes': /^\s*\[fix\/ch(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            // 'chores' : /^\s*\[chore\/ch(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            // 'hotfixes': /^\s*\[hotfix\/ch(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            // 'reverts': /^\s*Revert\s*\"\[(?:hotfix|feat|fix|bug)\/ch(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            // 'orphans': /^\s*\[feat|chore|hotfix|fix].*(?:\(\#(\d{1,8})\))?.*/
            'features': /^\s*\[feat\/(?:ch|sc-?)(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            'fixes':    /^\s*\[fix\/(?:ch|sc-?)(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            'chores':   /^\s*\[chore\/(?:ch|sc-?)(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            'hotfixes': /^\s*\[hotfix\/(?:ch|sc-?)(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            'reverts':  /^\s*Revert\s*\"\[(?:hotfix|feat|fix|bug)\/(?:ch|sc-?)(\d{1,8})\].*(?:\(\#(\d{1,8})\))?.*/,
            'orphans':  /^\s*\[feat|chore|hotfix|fix].*(?:\(\#(\d{1,8})\))?.*/
        };
        this.CHClient = CHClient;
        this.CHData = [];
        this.parsedReleaseNotes = {};
    }

    async generate(commitHistory, appName, versionName) {

        this.appName = appName;
        this.setCommitHistory(commitHistory);

        this.findInCommitHistory('features');
        this.findInCommitHistory('fixes');
        this.findInCommitHistory('chores');
        this.findInCommitHistory('hotfixes');
        this.findInCommitHistory('reverts');
        this.CHRawData = await this.getShortcutData();
        this.CHData = [...this.CHRawData[0], ...this.CHRawData[1]];
        if (0) {
            console.log('>>> ShortcutData');
            console.log(this.CHData);
            console.log('<<<');
        }

        this.transformRawReleaseNotes();
        this.parsedReleaseNotes.appName = appName;
        this.parsedReleaseNotes.release.name = versionName;
        this.renderTemplate(versionName, appName);
        if (this.mode === 'changelog') {
            if (0) {
                console.log('>>> parsedReleaseNotes');
                console.log(this.parsedReleaseNotes);
                console.log('<<<');
            }
            const changelog = await ChangelogGenerator.generateChangelog(this.parsedReleaseNotes);
            await ChangelogGenerator.uploadChangelog(changelog);
        }

        if (this.bumpMode) {
            return {};
        }

        let confluenceTemplate = {};
        confluenceTemplate = await this.renderConfluenceTemplate();

        const result = {
            slack:      await this.renderSlackTemplate(),
            confluence: {
                html: confluenceTemplate,
                raw:  this.parsedReleaseNotes
            }
        };

        return result;
    }

    findInCommitHistory(type) {
        this.commitIntervalHistory.forEach((commit) => {

            const featuresMatch = commit.message.match(this.regExps[type]);
            if (featuresMatch) {
                this.releaseNotesRawObj[type].push({
                    message: featuresMatch[0],
                    storyId: featuresMatch[1],
                    PR:      featuresMatch[2]
                });
            }
        });
        return this.releaseNotesRawObj;
    }

    getVersionBump() {
        const releaseNotesObj = this.parsedReleaseNotes;
        if (releaseNotesObj.features.length > 0) {
            return 'minor';
        }
        return 'patch';

    }

    renderTemplate(tag, repo) {
        this.parsedReleaseNotes.release.link = `\<${easyConf.github_baseUrl}${repo}/releases/tag/${tag}|${tag}\>`;
    }

    renderConfluenceTemplate() {
        try {
            const confluencePromise = ejs.renderFile(
                `${__dirname}/../templates/changelog/confluence.ejs`,
                this.parsedReleaseNotes, {rmWhitespace: true, async: true}
            );
            return confluencePromise;
        } catch (e) {
            console.log(e);
        }
    }

    renderSlackTemplate() {
        const renderedTemplate = {
            hasHotfix:    false,
            title:        '',
            featuresText: undefined,
            fixesText:    undefined,
            choresText:   undefined,
            hotfixesText: undefined,
            ccText:       undefined
        };

        const templatePromises = [];

        const titlePromise = ejs.renderFile(`${__dirname}/../templates/release-notes/title.ejs`, this.parsedReleaseNotes, {rmWhitespace: true})
            .then((title) => {
                renderedTemplate.title = title;
            });

        templatePromises.push(titlePromise);

        if (this.parsedReleaseNotes.features.length > 0) {
            const featuresTextPromise = ejs.renderFile(`${__dirname}/../templates/release-notes/features.ejs`, this.parsedReleaseNotes, {rmWhitespace: true})
                .then((featuresText) => {
                    renderedTemplate.featuresText = featuresText;
                });

            templatePromises.push(featuresTextPromise);
        }

        if (this.parsedReleaseNotes.chores.length > 0) {
            const choresTextPromise = ejs.renderFile(`${__dirname}/../templates/release-notes/chores.ejs`, this.parsedReleaseNotes, {rmWhitespace: true})
                .then((choresText) => {
                    renderedTemplate.choresText = choresText;
                });

            templatePromises.push(choresTextPromise);
        }

        if (this.parsedReleaseNotes.fixes.length > 0) {
            const fixesTextPromise = ejs.renderFile(`${__dirname}/../templates/release-notes/fixes.ejs`, this.parsedReleaseNotes, {rmWhitespace: true})
                .then((fixesText) => {
                    renderedTemplate.fixesText = fixesText;
                });
            templatePromises.push(fixesTextPromise);
        }

        if (this.parsedReleaseNotes.hotfixes.length > 0) {
            renderedTemplate.hasHotfix = true;
            const hotfixesTextPromise = ejs.renderFile(`${__dirname}/../templates/release-notes/hotfixes.ejs`, this.parsedReleaseNotes, {rmWhitespace: true})
                .then((hotfixesText) => {
                    renderedTemplate.hotfixesText = hotfixesText;
                });
            templatePromises.push(hotfixesTextPromise);
        }

        if (this.parsedReleaseNotes.reverts.length > 0) {
            const revertsTextPromise = ejs.renderFile(`${__dirname}/../templates/release-notes/reverts.ejs`, this.parsedReleaseNotes, {rmWhitespace: true})
                .then((revertsText) => {
                    renderedTemplate.revertsText = revertsText;
                });
            templatePromises.push(revertsTextPromise);
        }

        if (this.parsedReleaseNotes.appName) {
            const ccTextPromise = ejs.renderFile(`${__dirname}/../templates/release-notes/cc.ejs`, this.parsedReleaseNotes, {rmWhitespace: true})
                .then((ccText) => {
                    renderedTemplate.ccText = ccText;
                });
            templatePromises.push(ccTextPromise);
        }

        return Promise
            .all(templatePromises)
            .then(() => {
                return renderedTemplate;
            });
    }

    setCommitHistory(commitHistory) {
        this.commitIntervalHistory = commitHistory;
    }

    transformRawReleaseNotes() {
        const filteredReleaseNotes = Object.assign({}, this.releaseNotesRawObj);

        filteredReleaseNotes.fixes = [];
        filteredReleaseNotes.features = [];
        filteredReleaseNotes.chores = [];
        filteredReleaseNotes.hotfixes = [];
        filteredReleaseNotes.reverts = [];

        this.CHData
            .filter((storyData) => storyData.type === 'feature')
            .forEach((story) => {
                filteredReleaseNotes.features.push({
                    message:   `\<${story.url}|${story.name}\>`,
                    url:       `\<a target="_blank" href='${story.url}'\>${story.name}\</a\>`,
                    changelog: `[${story.name}](${story.url})`,
                    PR:        story.PR,
                    PRLink:    `${easyConf.github_baseUrl}${this.appName}/pull/${story.PR}`
                });
            });
        this.CHData
            .filter((storyData) => storyData.type === 'bug')
            .forEach((story) => {
                filteredReleaseNotes.fixes.push({
                    message:   `\<${story.url}|${story.name}\>`,
                    url:       `\<a target="_blank" href='${story.url}'\>${story.name}\</a\>`,
                    changelog: `[${story.name}](${story.url})`,
                    PR:        story.PR,
                    PRLink:    `${easyConf.github_baseUrl}${this.appName}/pull/${story.PR}`
                });
            });
        this.CHData
            .filter((storyData) => storyData.type === 'chore')
            .forEach((story) => {
                filteredReleaseNotes.chores.push({
                    message:   `\<${story.url}|${story.name}\>`,
                    url:       `\<a target="_blank" href='${story.url}'\>${story.name}\</a\>`,
                    changelog: `[${story.name}](${story.url})`,
                    PR:        story.PR,
                    PRLink:    `${easyConf.github_baseUrl}${this.appName}/pull/${story.PR}`
                });
            });
        this.CHData
            .filter((storyData) => storyData.type === 'hotfix')
            .forEach((story) => {
                filteredReleaseNotes.hotfixes.push({
                    message:   `\<${story.url}|${story.name}\>`,
                    url:       `\<a target="_blank" href='${story.url}'\>${story.name}\</a\>`,
                    changelog: `[${story.name}](${story.url})`,
                    PR:        story.PR,
                    PRLink:    `${easyConf.github_baseUrl}${this.appName}/pull/${story.PR}`
                });
            });

        this.CHData
            .filter((storyData) => storyData.type === 'revert')
            .forEach((story) => {
                filteredReleaseNotes.reverts.push({
                    message:   `\<${story.url}|${story.name}\>`,
                    url:       `\<a target="_blank" href='${story.url}'\>${story.name}\</a\>`,
                    changelog: `[${story.name}](${story.url})`,
                    PR:        story.PR,
                    PRLink:    `${easyConf.github_baseUrl}${this.appName}/pull/${story.PR}`
                });
            });

        const cleanFilteredReleaseNotes = this.cleanReverts(filteredReleaseNotes);
        this.parsedReleaseNotes = cleanFilteredReleaseNotes;

    }

    async getShortcutData() {
        return await Promise.all([
            this.CHClient.getAllStoryData(this.releaseNotesRawObj, 'aplazame'),
            this.CHClient.getAllStoryData(this.releaseNotesRawObj, 'applazame')
        ]);
    }

    cleanReverts(parsedReleaseNotes) {
        let userStoriesReverted = []; // esta variable nunca se devuelve, tiene sentido?

        parsedReleaseNotes.reverts.forEach((revert) => {
            parsedReleaseNotes.hotfixes = parsedReleaseNotes.hotfixes.filter((hotfix) => {
                if (revert.message !== hotfix.message) {
                    return true;
                }
                userStoriesReverted.push(hotfix);
                return false;
            });
            parsedReleaseNotes.features = parsedReleaseNotes.features.filter((feature) => {
                if (revert.message !== feature.message) {
                    return true;
                }
                userStoriesReverted.push(feature);
                return false;
            });
            parsedReleaseNotes.fixes = parsedReleaseNotes.fixes.filter((fix) => {
                if (revert.message !== fix.message) {
                    return true;
                }
                userStoriesReverted.push(fix);
                return false;
            });
            parsedReleaseNotes.chores = parsedReleaseNotes.chores.filter((chore) => {
                if (revert.message !== chore.message) {
                    return true;
                }
                userStoriesReverted.push(chore);
                return false;
            });
        });
        return parsedReleaseNotes;
    }
}

module.exports = ReleaseNotesGenerator;
