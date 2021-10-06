const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const port = process.env.PORT || 3000;
const {
  getCurrentUser,
  userDisconnect,
  joinUser,
  getUsersList,
  handleUserDisconnection,
  clearUsers,
  removeUser,
} = require("./users.js");

const {updateVotes} = require('./votes.js');

io.on("connection", (socket) => {
  socket.removeAllListeners();
  //for a new user joining the room
  socket.on(
    "joinRoom",
    ({ firstName, lastName, jobPosition, roomName, dealer }) => {
      //* create user

      const user = joinUser(
        socket.id,
        firstName,
        lastName,
        jobPosition,
        roomName,
        dealer
      );
      console.log(socket.id, "=id");
      socket.join(user.roomName);
      socket.emit("currentUser", {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        jobPosition: user.jobPosition,
        roomName: "testroom",
        dealer: user.dealer,
      });

      const usersList = getUsersList();
      socket.emit("usersList", usersList);

      // При присоединении нового игрока передаем всем в комнате информацию о нем
      socket.broadcast.to(user.roomName).emit("newUser", {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        jobPosition: user.jobPosition,
        roomName: "testroom",
        dealer: user.dealer,
      });

      socket.emit("message", {
        userId: "0",
        firstName: "Pointing",
        lastName: "Poker",
        jobPosition: "admin",
        text: `Welcome ${user.firstName}`,
      });

      socket.broadcast.to(user.roomName).emit("message", {
        userId: "0",
        firstName: "Pointing",
        lastName: "Poker",
        jobPosition: "admin",
        text: `${user.firstName} ${user.lastName} has joined the chat`,
      });

      // При получении настроек игры от дилера - передаем всем игрокам
      socket.on("gameSettings", ({ cards, issues }) => {
        socket.broadcast.to(user.roomName).emit("startGame", { cards, issues });
      });

      // Оповещаем игроков, когда дилер выбрал Issue на странице игры
      socket.on("newActiveIssue", (name) => {
        socket.broadcast.to(user.roomName).emit("setIssue", name);
      });

      socket.on('updateTitle', (newTitle) => {t
        socket.broadcast.to(user.roomName).emit("updateTitle", newTitle);
      });

      // Получаем vote и возвращаем клиенту обновленный массив votes
      socket.on("userVote", (vote) => {
        const newVotes = updateVotes(vote);
        console.log(newVotes, '= VOTES');
        io.to(user.roomName).emit("newVotes", newVotes);
      });

      // Оповещение всех участников, когда дилер отменил игру
      socket.on("gameCanceled", () => {
        io.to(user.roomName).emit("gameCanceled");
        clearUsers();
      });

      // Обработчик выхода из игры по кнопке Exit
      socket.on('exitGame', () => {
        socket.emit('confirmedExit');
        const newUsers = removeUser(socket.id);
        io.to(user.roomName).emit("playerLeft", newUsers);
      }); 

      socket.on("disconnect", () => {
        const newUsers = handleUserDisconnection(socket.id);
        io.to(user.roomName).emit("playerLeft", newUsers);
      });
    }
  );

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
});

server.listen(port, () => {
  console.log(
    `Socket.IO server running at https://pointing-poker123.herokuapp.com/`
  );
});
