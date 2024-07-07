import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "autocartadder@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});

export const sendEmailVerificationCode = async (
  recipentEmail: string,
  verificationCode: string
) => {
  try {
    let info = await transporter.sendMail({
      from: "autocartadder@gmail.com",
      to: recipentEmail,
      subject: "Email verification",
      text: `Your verification code is: ${verificationCode}. The code expires in 5 minutes.`,
    });
    return true;
  } catch (error) {
    console.log("error sending email", error);
    return false;
  }
};
