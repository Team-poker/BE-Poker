const httpServer = require('http').createServer();
const io = require('socket.io')(3000);
const app = require('express')();

io.on('connection', socket => {
    socket.send('Hello');
})

io.on('send', (socket) => {
    socket.send('Hello!');
});

io.on('message', data => {
    console.log(data);
});

httpServer.listen(3000);



