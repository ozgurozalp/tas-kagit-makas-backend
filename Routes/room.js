import { Router } from 'express';
import createRoomCode from '../helpers/createRoomCode.js';
import Room from '../Models/Room.js';

const roomRoute = Router();

roomRoute.post('/create', async (req, res) => {
    try {
        const data = {
            roomCode: createRoomCode(),
        };
        const room = new Room(data);
        await room.save();
        return res.json(data);
    } catch (e) {
        console.log(e);
        return res.json(e);
    }
});

roomRoute.post('/is-exist/:id', async (req, res) => {
    const { id } = req.params;
    const data = {
        status: false,
        isReady: false,
    };

    const room = await Room.findOne({ roomCode: id }).exec();
    if (room !== null) {
        data.status = true;
        if (
            (!room.$isEmpty('roomOwner') && room.$isEmpty('opponent')) ||
            (!room.$isEmpty('opponent') && room.$isEmpty('roomOwner'))
        ) {
            data.isReady = true;
        } else if (!room.$isEmpty('opponent') && !room.$isEmpty('roomOwner')) {
            data.isRunning = true;
        }
    }
    return res.json(data);
});

roomRoute.get('/is-ready/:id', async (req, res) => {
    const { id } = req.params;
    const data = {
        isReady: false,
    };

    const room = await Room.findOne({ roomCode: id }).exec();

    if (!room) return res.json(data);

    if (
        (!room.$isEmpty('roomOwner') && room.$isEmpty('opponent')) ||
        (!room.$isEmpty('opponent') && room.$isEmpty('roomOwner'))
    ) {
        data.isReady = true;
    }
    return res.json(data);
});

roomRoute.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    const room = await Room.deleteOne({ roomCode: id });
    return res.json({
        status: room !== null ? room.deletedCount !== 0 : 0,
    });
});

roomRoute.get('/is-opponent/:id', async (req, res) => {
    const { id } = req.params;
    const room = await Room.findOne({ roomCode: id }).exec();

    return res.json({
        isOpponent: room !== null && !room.$isEmpty('roomOwner'),
    });
});

export default roomRoute;
