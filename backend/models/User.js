import mongoose, { Schema, Document } from 'mongoose';



const UserSchema = new Schema({
    id: {
        type: String,
        required: true,
        default: function () {
            const characters = 'ABCDEFGHI0123456789JKLMNOPQRS0123456789TUVWXYZabcde0123456789fghijklmnop0123456789qrstuvwxyz0123456789';
            let userId = '';
            for (let i = 0; i < 9; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                userId += characters.charAt(randomIndex);
            }
            return userId.toUpperCase();
        },
        unique : true ,
        index : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerifiedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date
    },
    lastLoginAttempt: {
        type: Date
    },
    otpHash: {
        type: String
    },
    otpExpiresAt: {
        type: Date
    },
    socket_ids : {
        video_calling_socket : String,
    },
    
    status : {
        type : String,
        enum : ['online' , 'busy' , 'offline']
    }
});

export const User = mongoose.model('User', UserSchema);