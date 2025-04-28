// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import cron from "node-cron";
import { emailQueue } from './emailQueue';

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.semail,
    pass: process.env.spass,
  },
});

const sendMail = async (product: {
  name: string;
  image: string[];
  price: string;
}) => {
  let html = fs.readFileSync(path.join(__dirname, "mail1.html"), "utf8");
  const attachments = product.image.map((imageUrl, index) => ({
    filename: `image${index + 1}.jpg`,
    path: imageUrl,
  }));
  html = html
    .replaceAll("{{productName}}", product.name)
    .replaceAll("{{productPrice}}", product.price);

  const info = await transporter.sendMail({
    from: process.env.semail,
    to: process.env.semail,
    subject: "NEW Product Added",
    text: `A new product has been added: ${product.name}`,
    html: html,
    attachments: attachments,
  });

  console.log("Mail sent successfully",info);
};


const cronMail = (email:string) => {
  const html=fs.readFileSync(path.join(__dirname,"mail4.html"),"utf8")
  cron.schedule("0 */2 * * *", () => {
    transporter.sendMail({
      from: process.env.semail,
      to: email,
      subject: "This is a cron function",
      text: "This email is sent every 2nd hour by cron job.",
      html:html
    }, (error,info) => {
      if (error) {
        console.error("Error sending mail:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
  console.log("Scheduled job to run every minute.");
};




emailQueue.process('sendWelcomeEmail', async (job) => {
  const html = fs.readFileSync(path.join(__dirname, "mail2.html"), "utf8");
  const { to, subject, body } = job.data;

  console.log(`Sending email to ${to}`);

  const mailOptions = {
    from: process.env.semail, 
    to,                       
    subject,                  
    text: body,    
    html: html,        
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
    throw err; 
  }
  return Promise.resolve();
});
emailQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

export { sendMail ,cronMail ,transporter};
