import dotenv from "dotenv";
import nodemailer from "nodemailer";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
