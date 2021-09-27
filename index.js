const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const port = process.env.PORT || 3000;
const { getCurrentUser, userDisconnect, joinUser } = require("./users.js");

io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ firstName, lastName, jobPosition, roomName }) => {
    //* create user
    const user = joinUser(socket.id, firstName, lastName, jobPosition, roomName);
    console.log(socket.id, "=id");
    socket.join(user.roomName);

    socket.emit("message", {
      userId: '0',
      username: 'Poker',
      lastName: 'Pointing', 
      jobPosition: 'admin',
      text: `Welcome ${user.firstName}`,
    });
  })

  socket.on("chat", (message) => {
    //gets the room user and the message sent
    const user = getCurrentUser(socket.id);

    io.to(user.roomName).emit("message", {
      userId: user.id,
      firstName: user.firstName, 
      lastName: user.lastName, 
      jobPosition: user.jobPosition,
      text: message.text,
    });
  });

  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const user = userDisconnect(socket.id);
  });
})

server.listen(port, () => {
  console.log(`Socket.IO server running at https://pointing-poker123.herokuapp.com/`);
});