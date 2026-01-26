const nodemailer = require("nodemailer");
require("dotenv").config();
const { NODEMAILER_EMAIL, NODEMAILER_PASS} = process.env;

//import { Resend } from 'resend';
//require("dotenv").config();
//const { RESEND_API_KEY, RESEND_EMAIL } = process.env;
//const resend = new Resend(RESEND_API_KEY);

// const sendEmail = async (subscriptionEmail, subject, html) => {
   
//   const emailOptions = {
//     from: RESEND_EMAIL,
//     to: subscriptionEmail,
//     subject,
//     html,
//   };
  
//   const { data, error } = await resend.emails.send(emailOptions)

//   if (error) {
//     console.error({ error });
//   }

//   console.log({ data });
// };

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
    logger: true,  // Логування в консоль
    debug: true    // Деталі налагодження
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