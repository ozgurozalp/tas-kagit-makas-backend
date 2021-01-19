import mongoose from 'mongoose';

const room = new mongoose.Schema(
    {
        roomCode: String,
        roomOwner: {
            type: String,
            default: null,
        },
        roomOwnerSelect: {
            type: Number,
            default: null,
        },
        opponent: {
            type: String,
            default: null,
        },
        opponentSelect: {
            type: Number,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Room = mongoose.model('Room', room);

export default Room;
