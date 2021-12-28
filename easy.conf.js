// slack IDs
const PEDROMATEO = 'UP63BS8MV';
const YUSTE = 'UKVSLTUDR';
const JESUS = 'U06FFH6KF';
const AIRIZAR = 'UFC7YDRME';
const ISANCHEZ = 'U01QC7KCQ6M';
const JIGLESIAS = 'U022G0GNEUV';

// conf
module.exports = {
    shortcut_baseUrl:      'https://app.shortcut.com/',
    confluence_mainPageID: {
        'aplazame-js-internal': '1251213365',
        'backend':              '1251147777',
        'clients-history':      '1944387585',
        'customers-webapp':     '823590920',
        'event-handler-cqrs':   '1944322049',
        'webapp-checkout':      '823590913',
        // 'webapp-behaviours' FIXME add confluence page
        'webapp-vendors':       '823427227'
    },
    github_baseUrl: 'https://github.com/aplazame/',
    slack_cc:       {
        'aplazame-js-internal': [PEDROMATEO, JIGLESIAS, YUSTE, JESUS],
        'backend':              [PEDROMATEO, JIGLESIAS, AIRIZAR],
        'clients-history':      [PEDROMATEO, JIGLESIAS, AIRIZAR],
        'customers-webapp':     [PEDROMATEO, JIGLESIAS, YUSTE, JESUS, ISANCHEZ],
        'event-handler-cqrs':   [PEDROMATEO, JIGLESIAS, AIRIZAR],
        'webapp-behaviours':    [PEDROMATEO, JIGLESIAS, YUSTE, JESUS],
        'webapp-checkout':      [PEDROMATEO, JIGLESIAS, YUSTE, JESUS],
        'webapp-vendors':       [PEDROMATEO, JIGLESIAS, YUSTE, JESUS, ISANCHEZ]
    },

    slack_channel: 'CFM03590V',
    // slack_channel: 'C0119CWELH5', // use this for testing purposes

    test: {
        notifySlack:      true,
        notifyConfluence: false
    },

    LOG: false
};
