import { Server } from 'socket.io';
import Room from '../Models/Room.js';

const socketServer = server => {
    const io = new Server(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', socket => {
        socket.on('userLeft', async roomId => {
            // user left action
            const room = await Room.findOne({ roomCode: roomId }).exec();
            if (room !== null) {
                if (room.roomOwner === socket.id) {
                    room.roomOwner = null;
                } else if (room.opponent === socket.id) {
                    room.opponent = null;
                }
                socket.to(roomId).emit('opponentLeave', { status: true });
                socket.leave(roomId);
                await room.save();
            }
        });

        socket.on('connectGameRoom', async roomId => {
            // user connect action
            const room = await Room.findOne({ roomCode: roomId }).exec();
            if (room !== null) {
                socket.join(roomId);
                if (room.$isEmpty('roomOwner')) room.roomOwner = socket.id;
                else room.opponent = socket.id;

                socket.to(roomId).emit('connectedOpponent', { status: true });
                socket.emit('getSocketId', { socketId: socket.id });

                await room.save();
            }

            await Room.deleteOne({ roomOwner: null, opponent: null });
        });

        socket.on('selected', ({ roomId, id }) => {
            socket.to(roomId).emit('getSelectedOpponent', { selected: id });
        });
    });
};

export default socketServer;