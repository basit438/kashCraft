import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import User from "../../../src/models/user.model.js"
// Generate Verification Token
export const generateVerificationToken = (userEmail) => {
  return jwt.sign({ email: userEmail }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Send Verification Email
export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "ECOMMERCE Account Verification",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://yourstore.com/logo.png" alt="Your Store Logo" style="max-width: 150px;">
        </div>
        <h2 style="text-align: center; color: #333;">Welcome to [Your Store Name]!</h2>
        <p style="font-size: 16px; color: #555;">Hi User <strong></strong>,</p>
        <p style="font-size: 16px; color: #555;">Thank you for registering with <strong>[Your Store Name]</strong>. Please verify your email address to activate your account.</p>
        <div style="text-align: center; margin: 20px 0;">s
          <a href="${verificationLink}" style="background: #007BFF; color: #ffffff; text-decoration: none; font-size: 18px; padding: 12px 25px; border-radius: 5px; display: inline-block;">Verify Your Email</a>
        </div>
        <p style="font-size: 14px; color: #777; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <p style="text-align: center; font-size: 14px; color: #777;">This Link will expire in 1 hour.</p>
        <p style="text-align: center; font-size: 14px; color: #777;">Need help? <a href="https://yourstore.com/support" style="color: #007BFF;">Contact Support</a></p>
        <p style="text-align: center; font-size: 14px; color: #777;">&copy; ${new Date().getFullYear()} [Your Store Name]. All rights reserved.</p>
      </div>
    `,
    };
    

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};