const nodemailer = require("nodemailer");
require("dotenv").config();
const { NODEMAILER_EMAIL, NODEMAILER_PASS } = process.env;


const sendEmail = async (subscriptionEmail, subject, html) => {
  
  const config = {
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465, //587,
    secure: true, //false,
    auth: {
      user: NODEMAILER_EMAIL,
      pass: NODEMAILER_PASS,
    },
    logger: true,
    debug: true,
  };
  
  const transporter = nodemailer.createTransport(config);
  
  const emailOptions = {
      from: NODEMAILER_EMAIL,
      to: subscriptionEmail,
      subject,
      html,
  };

  await transporter.sendMail(emailOptions);
  return true;  
};

module.exports = sendEmail;