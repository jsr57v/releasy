const Confluence = require('confluence-api');
const easyConf = require('../easy.conf');
const moment = require('moment');

class ConfluenceNotifier {

    constructor(application) {
        this.application = application;
        this.confluenceLoginData = {
            username: process.env.CONFLUENCE_USERNAME,
            password: process.env.CONFLUENCE_PASSWORD,
            baseUrl:  process.env.CONFLUENCE_URL
        };
        this.confluence = new Confluence(this.confluenceLoginData);
        this.superParentSpace = 'RM';
    }

    notify(confluenceData) {
        this
            .confluence
            .postContent(
                this.superParentSpace,
                `${confluenceData.raw.release.date} - ${confluenceData.raw.release.name}`,
                confluenceData.html,
                this.getConfluenceMainPageIdByAppName(confluenceData.raw.appName),
                (err) => console.log(err)
            );
    }

    getConfluenceMainPageIdByAppName(appName) {
        return easyConf.confluence_mainPageID[appName];
    }
}

module.exports = ConfluenceNotifier;
