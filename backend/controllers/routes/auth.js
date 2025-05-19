/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import { Router } from 'express';
import { generateToken } from '../utils/token.js';
import { isValidEmail } from '../utils/validation.js';
import { User } from '../../models/User.js';
import { generateOTP , verifyOTP } from '../utils/otp.js';
import OptVerficationEmail from '../mails/auth.mails.js';
import { authMiddleware } from '../midleware/auth.middleware.js';

const router = Router();

// Initialize authentication with email
router.post('/auth/init', async (req, res) => {
    try {
        const { email } = req.query;

        email =await isValidEmail.parse(email);
        // Find user or create if doesn't exist
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user with minimal info
            user = await User.create({
                email,
                emailVerified: false,
                createdAt: new Date(),
                lastLoginAttempt: new Date()
            });

        } else {
            // Update last login attempt time
            user.lastLoginAttempt = new Date();
            await user.save();
        }
        
        // Generate OTP
        const { otp, expiresAt } = generateOTP();
        
        // Store OTP hash in user document
        user.otpHash = otp.hash;
        user.otpExpiresAt = expiresAt;
        await user.save();
        
        // Send OTP to email
        await OptVerficationEmail(otp.code);

        
        return res.status(200).json({ 
            success: true, 
            message: 'OTP sent to email',
            isNewUser: user.emailVerified === false,
            userId: user._id
        });
        
    } catch (error) {
        console.error('Auth init error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Verify OTP and issue token
router.post('/auth/verify', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Invalid email format' });
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        
        // Verify OTP
        const isValid = verifyOTP({
            inputCode: otp,
            hash: user.otpHash,
            expiresAt: user.otpExpiresAt
        });
        
        if (!isValid) return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
        
        // Mark email as verified if first time
        if (!user.emailVerified) {
            user.emailVerified = true;
            user.emailVerifiedAt = new Date();
        }
        
        // Clear OTP data
        user.otpHash = null;
        user.otpExpiresAt = null;
        user.lastLoginAt = new Date();
        await user.save();
        
        // Generate access token
        const token = generateToken(user.id);
        
        return res.status(200).json({
            success: true,
            message: 'Authentication successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                isNewUser: !user.emailVerifiedAt
            }
        });
    } catch (error) {
        console.error('Auth verify error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.post('/auth/user-id' , authMiddleware, async function(req, res)  {
    try {
        let user = await User.findOne({id : req.userId}).lean();
        if (!user) {
            return res.status(400).json({
                success: false, 
                message: 'Could not find User Account'
            });
        }
        return res.status(200).json({
            success: false, 
            message: 'Could not find User Account',
            data : {
                user
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
})


export default router;