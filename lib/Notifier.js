const {WebClient} = require('@slack/web-api');
const ConfluenceNotifier = require('./ConfluenceNotifier');
const easyConf = require('../easy.conf');

class Notifier {
    constructor() {
        this.slackClient = new WebClient(process.env.SLACK_TOKEN);
        this.confluenceClient = new ConfluenceNotifier();
    }

    notifyRelease(templates, doNotify = true) {
        // slack
        const message = this._composeSlackMessage(
            templates.slack.title,
            templates.slack.featuresText,
            templates.slack.fixesText,
            templates.slack.choresText,
            templates.slack.revertsText,
            templates.slack.hotfixesText);

        if (doNotify && easyConf.test.notifySlack) {
            this.slackClient.chat.postMessage(message)
                .then(
                    () => setTimeout(
                        () => this.slackClient.chat.postMessage({
                            text:    templates.slack.ccText,
                            channel: easyConf.slack_channel
                        })
                        ,
                        1000)
                );
        } else if (easyConf.test.notifySlack) {
            console.log('>>> slack message');
            console.log(message);
            message.blocks.forEach((obj) => {
                console.log(obj.text);
            });
            console.log('<<<');
        }

        // confluence
        if (doNotify && easyConf.test.notifyConfluence) {
            this.confluenceClient.notify(templates.confluence);
        } else if (easyConf.test.notifyConfluence) {
            console.log('>>> Confluence message');
            console.log(templates.confluence);
            console.log('<<<');
        }
    }

    /**
     * Composes the slack message
     *
     * @param {*} title
     * @param {*} featuresText
     * @param {*} fixesText
     * @param {*} choresText
     * @param {*} hotfixesText
     * @param {*} revertsText
     * @returns
     */
    _composeSlackMessage(title, featuresText, fixesText, choresText, hotfixesText, revertsText) {

        const titleBlock = [{
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': title + ' ' // avoids template problems when title is empty
            }
        },
        {
            'type': 'divider'
        }
        ];

        const fixesBlock = [{
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '*:bug: Bugfixes:*'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': fixesText
            }
        },
        {
            'type': 'divider'
        }
        ];

        const choresBlock = [{
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '*:wrench: Chores:*'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': choresText
            }
        },
        {
            'type': 'divider'
        }
        ];

        const featuresBlock = [{
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '*:boom: New Features:*'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': featuresText
            }
        },
        {
            'type': 'divider'
        }];

        const hotfixesBlock = [{
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '*:fire::fire:Hotfixes: :fire::fire:*'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': hotfixesText
            }
        },
        {
            'type': 'divider'
        }];

        const revertsBlock = [{
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '*:back: Reverts: :back:*'
            }
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': revertsText
            }
        },
        {
            'type': 'divider'
        }];

        const emptyReleaseBlock = [{
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': '\n' + 'Sorry, but no release notes were found :disappointed: \n'
            }
        },
        {
            'type': 'divider'
        }
        ];

        const blocksArray = [];

        // title
        blocksArray.push(...titleBlock);

        // content
        if (hotfixesText) {
            blocksArray.push(...hotfixesBlock);
        }
        if (featuresText) {
            blocksArray.push(...featuresBlock);
        }
        if (fixesText) {
            blocksArray.push(...fixesBlock);
        }
        if (choresText) {
            blocksArray.push(...choresBlock);
        }
        if (revertsText) {
            blocksArray.push(...revertsBlock);
        }

        // empty release? add a default block
        if (! hotfixesText && ! featuresText && ! fixesText && ! choresText && ! revertsText) {
            blocksArray.push(...emptyReleaseBlock);
        }

        return {
            'channel': easyConf.slack_channel,
            'blocks':  blocksArray
        };
    }

}

module.exports = Notifier;
