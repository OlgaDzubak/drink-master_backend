const nodemailer = require("nodemailer");
require("dotenv").config();
const { NODEMAILER_EMAIL, NODEMAILER_PASS } = process.env;


const sendEmail = async (subscriptionEmail, subject, html) => {
  
  const config = {
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASS,
    },
  };
  
  const transporter = nodemailer.createTransport(config);

  const emailOptions = {
      from: NODEMAILER_EMAIL,
      to: subscriptionEmail,
      subject,
      html,
  };

  await transporter.sendMail(emailOptions);
            //  .then(info => console.log(info))
  //  .catch(err => console.log(err));
  return true;  
};

module.exports = sendEmail;