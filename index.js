const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*'
  }
});
const port = process.env.PORT || 3000;
const log = console.log;

const onConnection = (socket) => {
  // выводим сообщение о подключении пользователя
  log('User connected')

  // получаем название комнаты из строки запроса "рукопожатия"
  const { lobbyId } = socket.handshake.query
  // сохраняем название комнаты в соответствующем свойстве сокета
  socket.lobbyId = lobbyId

  // присоединяемся к комнате (входим в нее)
  socket.join(lobbyId)

  // регистрируем обработчики
  // обратите внимание на передаваемые аргументы
  registerMessageHandlers(io, socket)
  registerUserHandlers(io, socket)

  // обрабатываем отключение сокета-пользователя
  socket.on('disconnect', () => {
    // выводим сообщение
    log('User disconnected')
    // покидаем комнату
    socket.leave(lobbyId)
  })
}

io.on('connection', onConnection);

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});