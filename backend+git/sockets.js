// sockets.js
const db = require("./config/db");
const { createWhatsappSession } = require('./middleWare/whatsappSession');

let io;

const initializeSocket = (server) => {
    io = require('socket.io')(server, {
        cors: {
            origin: (origin, callback) => {
                const allowedOrigins = [
                    "http://localhost:3000", 
                    "http://react.unrealautomation.com", 
                    "http://react.unrealautomation.com:3000", 
                    "https://react.unrealautomation.com", 
                    "https://react.unrealautomation.com:3000"
                ];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ["GET", "POST"],
        }
    });

    io.on('connection', (socket) => {
        console.log("a user connected", socket.id);
        
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });
        
        socket.on('connected', (data) => {
            console.log("Connected to the server", data);
            socket.emit("Hello", "Hello from server");
        });

        socket.on('createSession', (data) => {
            const { id } = data;
            createWhatsappSession(id, socket);
        });

        socket.on('getAllChats', async (data) => {
            const id = data.insid;
            const client = allSessionsObject[id];
            const allChats = await client.getChats();
            socket.emit('allChats', { allChats });
        });

        socket.on('fetchInstance', async (data) => {
            const uuid = data.uuid;
            const sql = "SELECT * FROM instances WHERE uuid = ?";
            db.query(sql, [uuid], async (err, result) => {
                if (err) return console.error(err);
                if (result.length > 0) {
                    socket.emit("instanceFetched", {
                        message: "Instance Found",
                        result: result,
                    });
                } else {
                    console.log("No Instance Found");
                }
            });
        });

        socket.on('removeInstance', async (data) => {
            const sql = "DELETE FROM instances WHERE insid = ?";
            db.query(sql, [data], (err, result) => {
              if (err) throw err;
              console.log("Instance removed from database");
              socket.emit("instanceRemoved", {
                title: "Instance Removed",
                message: "Instance removed successfully"
              });
            });
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

module.exports = {
    initializeSocket,
    getIo,
};
