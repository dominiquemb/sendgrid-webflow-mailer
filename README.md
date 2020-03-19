This is a node script which fetches data from Webflow items, and applies the data to a Sendgrid email template, sending out emails to a Sendgrid subscribers list.

You can easily download this repository and test it out yourself with the following commands:

```
1. git clone https://github.com/dominiquemb/sendgrid-webflow-mailer.git
2. cd sendgrid-webflow-mailer
3. sudo npm install
4. node app.js dummy youremail@youremail.com
```

You must use a valid email in order for the test to work properly!

The email content, sender info and recipient info is defined in this file:

```
data/mailerData.js
```

The API keys are defined here:

```
api/api.js
```

And finally, the dummy data (for testing) is defined here:

```
data/dummyData.js
```
