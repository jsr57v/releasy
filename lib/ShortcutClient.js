const Shortcut = require('clubhouse-lib');
const easyConf = require('../easy.conf');

class ShortcutClient {
    constructor() {
        this.tokens = {
            aplazame:  process.env.CLUBHOUSE_WEB_TOKEN,
            applazame: process.env.CLUBHOUSE_APP_TOKEN

        };
    }

    getStoryData(storyId) {
        return this.client.getStory(storyId);
    }

    getAllStoryData(obj, project) {
        this.client = Shortcut.create(this.tokens[project]);
        let promisesArray = [];
        let shortcutData = [];

        obj.features.forEach((feature) => {

            promisesArray.push(
                this.getStoryData(feature.storyId).then((data) => shortcutData.push({
                    name:    data.name,
                    url:     `${easyConf.shortcut_baseUrl}${project}/story/${feature.storyId}`,
                    storyId: feature.storyId,
                    type:    data.story_type,
                    PR:      feature.PR
                })).catch(()=>{})
            );
        });

        obj.fixes.forEach((fix) => {
            promisesArray.push(
                this.getStoryData(fix.storyId).then((data) => shortcutData.push({
                    name:    data.name,
                    url:     `${easyConf.shortcut_baseUrl}${project}/story/${fix.storyId}`,
                    storyId: fix.storyId,
                    type:    data.story_type,
                    PR:      fix.PR
                })).catch(()=>{})
            );
        });

        obj.chores.forEach((chore) => {
            promisesArray.push(
                this.getStoryData(chore.storyId).then((data) => shortcutData.push({
                    name:    data.name,
                    url:     `${easyConf.shortcut_baseUrl}${project}/story/${chore.storyId}`,
                    storyId: chore.storyId,
                    type:    data.story_type,
                    PR:      chore.PR
                })).catch(()=>{})
            );
        });

        obj.hotfixes.forEach((hotfix) => {
            promisesArray.push(
                this.getStoryData(hotfix.storyId).then((data) => shortcutData.push({
                    name:    data.name,
                    url:     `${easyConf.shortcut_baseUrl}${project}/story/${hotfix.storyId}`,
                    storyId: hotfix.storyId,
                    type:    'hotfix',
                    PR:      feature.PR
                })).catch(()=>{})
            );
        });

        obj.reverts.forEach((revert) => {
            promisesArray.push(
                this.getStoryData(revert.storyId).then((data) => shortcutData.push({
                    name:    data.name,
                    url:     `${easyConf.shortcut_baseUrl}${project}/story/${revert.storyId}`,
                    storyId: revert.storyId,
                    type:    'revert',
                    PR:      revert.PR
                })).catch(()=>{})
            );
        });

        return Promise
            .all(promisesArray)
            .then(() => {
                return shortcutData;
            });
    }
}

module.exports = ShortcutClient
;
