const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');

const { sendgridAPIKey } = require('../config');

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: sendgridAPIKey
  })
);

/**
 * sends email to a user through nodemailer-sendgrid mail service
 * Fire & Forget Function
 * @param {string | [string]} to - email id(s) of receiver(s)
 * @param {*} subject - subject of the mail
 * @param {*} html - html string of the email content
 */
const sendMail = (to, subject, html) => {
  const from = 'GMKIT Bank <hemantvayali@gmail.com>';
  const msgData = {
    from, to, subject, html
  };
  transport.sendMail(msgData)
    .catch((error) => {
      console.log(error);
    });
};

module.exports = sendMail;
