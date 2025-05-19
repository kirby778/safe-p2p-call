/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import transporter from "../config/transporter.js";


export default async function OptVerficationEmail(otpCode) {
    try {
        let info =await transporter.sendMail({
            to: email,
            subject: 'Your authentication code',
            text: `Your OTP code is: ${otpCode}. It will expire in 10 minutes.`,
            html: `<h1>Your authentication code</h1><p>Your OTP code is: <strong>${otpCode}</strong></p><p>It will expire in 10 minutes.</p>`
        });
        console.log(`Message send to ${info.messageId}`);
        return true
    } catch (error) {
        console.error(error);
        return false;
    }
}