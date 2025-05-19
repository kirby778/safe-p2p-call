/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah */

import crypto from 'crypto'

export const generateOTP = () => {
    // Generate a 6-digit OTP
    const code =GenerateOtp();
    
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Create hash of the OTP with salt
    const hash = crypto.createHmac('sha256', salt)
        .update(code.toString())
        .digest('hex');
    
    // Store salt with hash (format: salt:hash)
    const saltedHash = `${salt}:${hash}`;
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 *60 *1000);
    
    
    return {
        otp: {
            code,
            hash: saltedHash
        },
        expiresAt
    };
};


export const verifyOTP = (params) => {
    const { inputCode, hash, expiresAt } = params;
    
    // Check if OTP is expired
    if (new Date() > new Date(expiresAt)) return false;
    
    // Extract salt from stored hash
    const [salt, originalHash] = hash.split(':');
    
    // Create hash of the input code with the same salt
    const newHash = crypto.createHmac('sha256', salt)
        .update(inputCode.toString())
        .digest('hex');
    
    // Compare hashes
    return newHash === originalHash;
};

export function GenerateOtp() {
  function giveOtp() {
    return Math.floor(Math.random() * 999999)
  }
  let otp = giveOtp()
  for (let i = 0; true; i++) {
    if (otp > 99999 && otp < 1000000) {
      return otp;
    }
    else otp = giveOtp();
  }
}