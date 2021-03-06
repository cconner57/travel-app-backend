const express = require('express');
const { contactUser, contactPass } = require('./config');

const router = express.Router();

const nodemailer = require('nodemailer');

router.post('/', (req, res) => {
	const transporter = nodemailer.createTransport({
		host: 'Gmail',
		auth: {
			user: contactUser,
			pass: contactPass,
		},
	});
	const name = req.body.name;
	const email = req.body.email;
	const message = req.body.message;
	const mail = {
		from: email,
		to: 'covidtrackerapp1@gmail.com',
		subject: 'Contact Form Message',
		html: `<p>Name: ${name}</p><p>Message: ${message}</p>`,
	};
	transporter.sendMail(mail, (error) => {
		if (error) {
			res.json({ status: 'failed' });
		} else {
			res.json({ status: 'sent' });
		}
	});
});

module.exports = router;
