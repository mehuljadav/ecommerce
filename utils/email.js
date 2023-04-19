const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
   constructor(user, url) {
      this.to = user.Email;
      this.from = `Mehul Jadav <process.env.EMAIL_FROM>`;
      this.firstName = `${user.name}`.split(' ')[0];
      this.url = url;
   }

   newTransport() {
      if (process.env.NODE_ENV === 'production') {
         //we will use sendgrid, testing mails may cost so we will use nodemailer in developement
      } else {
         return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASS,
            },
         });
      }
   }

   //send actual email
   // template can be welcome email, resetpassword
   async send(template, subject) {
      // 1. bring pug html email Template
      const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
         firstName: this.firstName,
         url: this.url,
         subject,
      });
      // 2. set Email Options
      const mailOptions = {
         from: this.from,
         to: this.to,
         subject,
         html,
         text: htmlToText.fromString(html),
      };
      // 3. create Transport and send email
      await this.newTransport().sendMail(mailOptions);
   }

   async sendWelcome() {
      await this.send('welcome', `Welcome to Mehul's Ecommerce store`);
   }
};
