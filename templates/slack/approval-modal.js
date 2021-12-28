module.exports = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "Wanna release?",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Which application would you like to deploy?\n\n *Please select it!*"
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "static_select",
					"placeholder": {
						"type": "plain_text",
						"text": "Choose the app!",
						"emoji": true
					},
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "webapp-checkout",
								"emoji": true
							},
							"value": "webapp-checkout"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "aplazame-js-internal",
								"emoji": true
							},
							"value": "aplazame-js-internal"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "webapp-vendors",
								"emoji": true
							},
							"value": "webapp-vendors"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "customers-webapp",
								"emoji": true
							},
							"value": "customers-webapp"
						}
					]
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Related People:*\n Releasy needs approval from at least *1 PO*, *1 QA* and *1 Developer* / *Team Leader*, so please *select at least three people*."
			}
		},
		{
			"type": "input",
			"element": {
				"type": "multi_users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select users",
					"emoji": true
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Approvers",
				"emoji": true
			}
		},
		{
			"type": "divider"
		}
	]
}