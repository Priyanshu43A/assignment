import nodemailer from "nodemailer";
import { emailTemplates } from "./emailTemplates.js";

let transporter;

// Validate environment variables
const validateEnv = () => {
  // Force development mode if NODE_ENV is not set
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "development";
  }
  console.log("Environment:", process.env.NODE_ENV);
};

// Create test account if in development mode
const createTestAccount = async () => {
  console.log("Initializing email configuration...");

  // Validate environment and set defaults
  validateEnv();

  // Always use Ethereal in development mode
  if (process.env.NODE_ENV !== "production") {
    try {
      console.log("Creating Ethereal test account...");
      const testAccount = await nodemailer.createTestAccount();

      console.log("\n=== Ethereal Test Account Details ===");
      console.log("Email:", testAccount.user);
      console.log("Password:", testAccount.pass);
      console.log("SMTP Host:", testAccount.smtp.host);
      console.log("SMTP Port:", testAccount.smtp.port);
      console.log("Web Interface:", testAccount.web);
      console.log("================================\n");

      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      // Verify connection configuration
      console.log("Verifying Ethereal connection...");
      await transporter.verify();
      console.log("✅ Ethereal connection verified successfully");
    } catch (error) {
      console.error("❌ Error creating Ethereal test account:", error);
      throw new Error("Failed to create test email account");
    }
  } else {
    // Only use production SMTP if explicitly set to production
    console.log("Using production SMTP configuration...");
    const requiredVars = [
      "SMTP_HOST",
      "SMTP_PORT",
      "SMTP_USER",
      "SMTP_PASS",
      "SMTP_FROM",
    ];
    const missingVars = requiredVars.filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error(
        "❌ Missing required environment variables:",
        missingVars.join(", ")
      );
      throw new Error("Missing required SMTP configuration variables");
    }

    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify production connection
    try {
      console.log("Verifying production SMTP connection...");
      await transporter.verify();
      console.log("✅ Production SMTP connection verified successfully");
    } catch (error) {
      console.error("❌ Error verifying production SMTP:", error);
      throw new Error("Failed to verify production SMTP connection");
    }
  }
};

// Initialize transporter
console.log("Starting email service initialization...");
await createTestAccount();
console.log("Email service initialized successfully");

const sendEmail = async (to, subject, html) => {
  console.log("\n=== Sending Email ===");
  console.log("To:", to);
  console.log("Subject:", subject);

  const mailOptions = {
    from:
      process.env.NODE_ENV === "development"
        ? "noreply@ethereal.email"
        : process.env.SMTP_FROM,
    to,
    subject,
    html,
  };

  try {
    console.log("Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV === "development") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log("\n=== Email Preview Details ===");
      console.log("Preview URL:", previewUrl);
      console.log("Message ID:", info.messageId);
      console.log("===========================\n");
      return { info, previewUrl };
    }

    return { info };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw new Error("Failed to send email");
  }
};

export const sendVerificationEmail = async (email, otp) => {
  return sendEmail(
    email,
    "Verify Your Email",
    emailTemplates.verification(otp)
  );
};

export const sendPasswordResetEmail = async (email, otp) => {
  return sendEmail(
    email,
    "Password Reset Request",
    emailTemplates.passwordReset(otp)
  );
};

export const sendAccountDeactivatedEmail = async (email) => {
  return sendEmail(
    email,
    "Account Deactivated",
    emailTemplates.accountDeactivated()
  );
};

export const sendAccountReactivatedEmail = async (email) => {
  return sendEmail(
    email,
    "Account Reactivated",
    emailTemplates.accountReactivated()
  );
};
