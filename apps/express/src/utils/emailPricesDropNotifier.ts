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

export const sendEmailPricesDropNotifier = async (
  recipentEmail: string,
  url: string
) => {
  try {
    let info = await transporter.sendMail({
      from: "autocartadder@gmail.com",
      to: recipentEmail,
      subject: "Prices Dropped!",
      text: `The price for the item in : ${url} has matched your criteria. The item is added to your cart.`,
    });
    return true;
  } catch (error) {
    console.log("error sending email", error);
    return false;
  }
};
