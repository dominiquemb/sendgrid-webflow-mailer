const https = require('https');
const rp = require('request-promise');
const moment = require('moment');
const globals = require('./data/globals.js');
const api = require('./api/api.js');
const mailerData = require('./data/mailerData.js');
let dummy = {};

let env = 'prod';

let { argv } = process;
if (argv) {
	if (argv[2] && argv[2] == 'dummy') {
		env = 'dummy';
		dummy = require('./data/dummyData.js');

		if (argv[3]) {
			globals.testemail = argv[3];
		} else {
			console.log('Missing dummy email address! Please specify an email like this: \'node run dummy test@test.com\'');
			process.exit();
		}
	}

} 

const getGigs = async() => {
	let returnVal = {};
	if (env == "prod") {
		await rp(api.webflow.gigs.getAll()).
		then((resp) => {
			returnVal = resp;
		}).catch((err) => {
			console.log('Error!');
			console.log(err);
		});
	} else {
		returnVal = dummy.gigs;
	}
	return returnVal;
}

const getSubscribers = async() => {
	let returnVal = {};
	if (env == "prod") {
		await rp(api.sendgrid.subscribers.getAll()).
		then((resp) => {
			returnVal = resp;
		}).catch((err) => {
			console.log('Error!');
			console.log(err);
		});
	} else {
		returnVal = dummy.subscribers;
	}
	return returnVal;
}

const getSkills = async() => {
	let returnVal = {};
	if (env == "prod") {
		await rp(api.webflow.skills.getAll()).
		then((resp) => {
			returnVal = resp;
		}).catch((err) => {
			console.log('Error!');
			console.log(err);
		});
	} else {
		returnVal = dummy.skills;
	}
	return returnVal;
}

const processSkills = resp => {
	const { items } = resp;
	if (items) {
		for (let skill of items) {
			globals.skills[skill._id] = skill.name;
		}
	}
	return globals.skills;
}

const processSubscribers = resp => {
	const { result } = resp;
	if (result) {
	globals.subscribers = result;
	}
	return globals.subscribers;
}

const processGigs = resp => {
	const { items } = resp;
	if (items) {
		for (let gig of items) {
			const { 'expected-responsibilities-2': gigSkills, 'created-on': createdOn } = gig;
			// let onedayago = moment().subtract(24, 'hour');
			// the below line is for testing purposes only. normally, we would only send out gigs from the past 24 hours.
			let onedayago = moment().subtract(10, 'year');

			if (gigSkills) {
				for(let skillId of gigSkills) {
					if (!moment(createdOn).isBefore(onedayago)) {
						let skillName = globals.skills[skillId];
						if (skillName == undefined) {
							skillName = 'all';
						}

						if (!globals.gigs[skillName]) {
							globals.gigs[skillName] = [];
						}

						globals.gigs[skillName].push(gig);
					}
				}


			}
		}
	}
	return globals.gigs;
}

const sendEmailWithGigs = (email, userGigs) => {
	let options = api.sendgrid.send();
	let emailContent = mailerData(email, userGigs);
	options = { 
		body: emailContent.body,
		...options,
	};
	rp(options).then(() => {
		console.log(`sent to user email ${email}`);
	});
}

const assignGigsToUsers = () => {
	for (let user of globals.subscribers) {
		const { 'custom_fields': customFields, email } = user;
		if (customFields) {
			let { 'Skills': skillsArray } = customFields;
			let userGigs = [];

			if (skillsArray) {
				if (typeof skillsArray == 'string') {
					skillsArray = [skillsArray];	
				}

				for (skillName of skillsArray) {

					if (typeof globals.gigs[skillName] !== 'undefined') {
						userGigs = globals.gigs[skillName].concat(userGigs);
					}
				}

				let { all } = globals.gigs;

				if (all) {
					userGigs = all.concat(userGigs);
				}

			}
			if (env == "prod") {
				sendEmailWithGigs(email, userGigs);
			} else {
				sendEmailWithGigs(globals.testemail, userGigs);
			}
		}
	}
};

getSkills().then(resp => { 
	processSkills(resp);

	getSubscribers().then(resp => { 
		processSubscribers(resp);

		getGigs().then(resp => {
			processGigs(resp);

			assignGigsToUsers();
		});
	});
});
