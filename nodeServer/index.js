const cors = require('cors');
const io = require('socket.io')(8000, {
    cors: {
        origin: '*',  // Allow all origins for simplicity, you can also specify specific origins
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log(name, "joined")
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name)
    });
    socket.on('send-message', message => {
        socket.broadcast.emit('received-message', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
});
