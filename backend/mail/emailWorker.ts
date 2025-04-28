
// import { emailQueue } from './emailQueue';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';




// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "manojkumarp2705@gmail.com",
//       pass: "tghzdjgbkraqhson",
//     },
//   });
  

// emailQueue.process('sendWelcomeEmail', async (job) => {
//   const { to, subject, body } = job.data;

//   console.log(`Sending email to ${to}`);

//   const mailOptions = {
//     from: process.env.semail, 
//     to,                       
//     subject,                  
//     text: body,            

//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Email sent to ${to}`);
//   } catch (err) {
//     console.error(`Failed to send email to ${to}:`, err);
//     throw err; 
//   }


//   return Promise.resolve();
// });


// emailQueue.on('completed', (job) => {
//   console.log(`Job ${job.id} completed`);
// });

// emailQueue.on('failed', (job, err) => {
//   console.error(`Job ${job.id} failed:`, err);
// });

