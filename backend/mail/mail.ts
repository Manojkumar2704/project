const nodemailer = require("nodemailer");
import dotenv from "dotenv"
dotenv.config()
import fs from "fs";
import path from "path";



const transporter = nodemailer.createTransport({
    service:"gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.semail,
      pass: process.env.spass,
    },
  });

 
  
  const sendMail = async (product: { name: string; image: string[],price:string }) => {
    let html = fs.readFileSync(
      path.join(__dirname, "mail1.html"),
      "utf8"
    );
    const attachments = product.image.map((imageUrl, index) => ({
        filename: `image${index + 1}.jpg`, 
        path: imageUrl, 
      }));
    html = html
      .replaceAll("{{productName}}", product.name)
      .replaceAll("{{productPrice}}", product.price)

    const info = await transporter.sendMail({
      from: process.env.semail,
      to: process.env.semail,
      subject: "NEW Product Added",
      text: `A new product has been added: ${product.name}`,
      html: html,
      attachments:attachments
    });
  
    console.log("Mail sent successfully");
  };

  const registerMail = async (email:string,username:string) => {
    let html = fs.readFileSync(
      path.join(__dirname, "mail2.html"),
      "utf8"
    );

    const info = await transporter.sendMail({
      from: process.env.semail,
      to: email,
      subject: "Wellcome "+username,
      html: html,
    });
  
    console.log("Mail sent successfully");
  };
  

  export  {sendMail,registerMail}