const api = {
	sendgrid: {
		authkey: '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',
		host: 'https://api.sendgrid.com',
		headers: () => {
			let resp = {
				'Authorization': `Bearer ${api.sendgrid.authkey}`,
				'Content-Type': 'application/json',
			};
			return resp;
		},
		subscribers: {
			getAll: () => {
				let resp = {
					headers: api.sendgrid.headers(),
					uri: `${api.sendgrid.host}/v3/marketing/contacts`,
					method: 'GET',
					json: true,
				};
				return resp;
			},
		},
		send: () => {
			let resp = {
				headers: api.sendgrid.headers(),
				uri: `${api.sendgrid.host}/v3/mail/send`,
				method: 'POST',
				json: true,
			};
			return resp;
		},
	},
	webflow: {
		authkey: '' /* Enter your authkey here! */, 
		host: 'https://api.webflow.com',
		headers: () => {
			let resp = {
				'Authorization': `Bearer ${api.webflow.authkey}`,
				'accept-version': '1.0.0',
			};
			return resp;
		},
		gigs: {
			getAll: () => {
				let resp = {
					headers: api.webflow.headers(),
					uri: `${api.webflow.host}/collections/YOUR-GIGS-COLLECTION-ID-HERE/items`,
					method: 'GET',
					json: true,
				};
				return resp;
			},
		},
		skills: {
			getAll: () => {
				let resp = {
					headers: api.webflow.headers(),
					uri: `${api.webflow.host}/collections/YOUR-SKILLS-COLLECTION-ID-HERE/items`,
					method: 'GET',
					json: true,
				};
				return resp;
			},
		},
	}
};

module.exports = api;

