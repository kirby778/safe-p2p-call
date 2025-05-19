/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { FROM_EMAIL } from "../config/env.js";
import transporter from "../config/transporter.js";


export default async function OptVerificationEmail(email, otpCode) {
    try {
        const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <h2 style="color: #2e7d32; text-align: center;">🔐 CodeCaller Verification</h2>
          <p>Hello,</p>
          <p>You're trying to sign in or verify your identity with <strong>CodeCaller</strong>.</p>
          <p>Please use the following One-Time Password (OTP) to continue:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; padding: 14px 28px; font-size: 24px; background-color: #2e7d32; color: #fff; border-radius: 6px; font-weight: bold;">
              ${otpCode}
            </span>
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn’t request this, please ignore this email.</p>
          <hr style="margin: 30px 0;">
          <p style="text-align: center; color: #999;">© ${new Date().getFullYear()} CodeCaller. All rights reserved.</p>
        </div>
        </div>
        `;

        let info = await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Your CodeCaller Authentication Code',
            text: `Your CodeCaller OTP is: ${otpCode}. It expires in 10 minutes.`,
            html: htmlContent,
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return { success: false, error };
    }
}
