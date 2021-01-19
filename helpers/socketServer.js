import { Server } from 'socket.io';
import Room from '../Models/Room.js';
const items = [
    {
        id: 1,
        name: 'Taş',
        beats: 3,
    },
    {
        id: 2,
        name: 'Kağıt',
        beats: 1,
    },
    {
        id: 3,
        name: 'Makas',
        beats: 2,
    },
];

function isWinner(selection, opponentSelection) {
    return selection.beats === opponentSelection.id;
}

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
                    room.roomOwnerSelect = null;
                } else if (room.opponent === socket.id) {
                    room.opponent = null;
                    room.opponentSelect = null;
                }
                await room.save();
                socket.to(roomId).emit('opponentLeave', { status: true });
                socket.leave(roomId);
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

        socket.on('selected', async ({ roomId, id }) => {
            socket.to(roomId).emit('getSelectedOpponent', { selected: id });
            const room = await Room.findOne({ roomCode: roomId }).exec();
            if (room !== null) {
                if (room.roomOwner === socket.id) {
                    room.roomOwnerSelect = id;
                } else if (room.opponent === socket.id) {
                    room.opponentSelect = id;
                }
                await room.save();

                if (!room.$isEmpty('roomOwnerSelect') && !room.$isEmpty('opponentSelect')) {
                    let ownerSelect = items.find(item => item.id === room.roomOwnerSelect),
                        opponentSelect = items.find(item => item.id === room.opponentSelect);

                    const clientData = {
                        [room.roomOwner]: {
                            isWinner: isWinner(ownerSelect, opponentSelect),
                        },
                        [room.opponent]: {
                            isWinner: isWinner(opponentSelect, ownerSelect),
                        },
                        isTie: false,
                    };
                    clientData.isTie = clientData[room.roomOwner].isWinner === clientData[room.opponent].isWinner;

                    room.roomOwnerSelect = null;
                    room.opponentSelect = null;
                    io.in(roomId).emit('resultIsReady', clientData);
                    await room.save();
                    console.log(clientData);
                }
            }
        });
    });
};

export default socketServer;
