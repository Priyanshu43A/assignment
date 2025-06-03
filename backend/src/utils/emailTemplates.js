export const emailTemplates = {
  verification: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333; margin: 0;">Email Verification</h2>
      </div>
      <p style="color: #666; line-height: 1.6;">Thank you for signing up! Please use the following OTP to verify your email address:</p>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
        <strong style="color: #007bff;">${otp}</strong>
      </div>
      <p style="color: #666; line-height: 1.6;">This OTP will expire in 10 minutes.</p>
      <p style="color: #666; line-height: 1.6;">If you didn't request this verification, please ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated email, please do not reply.
      </p>
    </div>
  `,

  passwordReset: (otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333; margin: 0;">Password Reset Request</h2>
      </div>
      <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Use the following OTP to proceed:</p>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
        <strong style="color: #dc3545;">${otp}</strong>
      </div>
      <p style="color: #666; line-height: 1.6;">This OTP will expire in 10 minutes.</p>
      <p style="color: #666; line-height: 1.6;">If you didn't request a password reset, please ignore this email and ensure your account is secure.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated email, please do not reply.
      </p>
    </div>
  `,

  accountDeactivated: () => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333; margin: 0;">Account Deactivated</h2>
      </div>
      <p style="color: #666; line-height: 1.6;">Your account has been successfully deactivated.</p>
      <p style="color: #666; line-height: 1.6;">If you wish to reactivate your account, you can do so by logging in with your credentials.</p>
      <p style="color: #666; line-height: 1.6;">If you didn't request this deactivation, please contact our support team immediately.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated email, please do not reply.
      </p>
    </div>
  `,

  accountReactivated: () => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #333; margin: 0;">Account Reactivated</h2>
      </div>
      <p style="color: #666; line-height: 1.6;">Your account has been successfully reactivated.</p>
      <p style="color: #666; line-height: 1.6;">You can now log in and access all features of your account.</p>
      <p style="color: #666; line-height: 1.6;">If you didn't request this reactivation, please contact our support team immediately.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated email, please do not reply.
      </p>
    </div>
  `,
};
