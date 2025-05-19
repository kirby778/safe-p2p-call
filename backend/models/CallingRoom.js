// بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ InshaAllah

import mongoose from 'mongoose'
import { v4 as uuidV4 } from 'uuid';

const CallingRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        default : () => uuidV4()
    },
    callerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    contact_id: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date
    }
}, {
    timestamps: true // adds createdAt and updatedAt
});

export const CallingRoom = mongoose.model('CallingRoom' , CallingRoomSchema)
export default CallingRoom;
