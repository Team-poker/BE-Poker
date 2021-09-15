const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const port = process.env.PORT || 3000;
const { getCurrentUser, userDisconnect, joinUser } = require("./users.js");

app.use(cors());

io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ username, roomname }) => {
    //* create user
    const user = joinUser(socket.id, username, roomname);
    console.log(socket.id, "=id");
    socket.join(user.room);
  })

  socket.on("chat", (text) => {
    //gets the room user and the message sent
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", {
      userId: user.id,
      username: user.username,
      text: text,
    });
  });

  socket.on("disconnect", () => {
    //the user is deleted from array of users and a left room message displayed
    const user = userDisconnect(socket.id);
  });
})

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});