const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const {userJoin, userDisconnect, getUser, getUserList} = require('./utils/users');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

  socket.on('joinRoom', username => {
    const user = userJoin(socket.id, username);
    let message = "has joined the chat!";
    socket.broadcast.emit('message', { username, message});

    const users = getUserList();
    io.emit('updateUsers', users);
  });


  socket.on('message', ({username, message}) => {
    io.emit('message', {username, message});
  });

  socket.on('disconnect', () => {
    const user = userDisconnect(socket.id);
    if(user){
      const username = user.username;
      let message = "has disconnected the chat!";
      io.emit('message', {username, message});
      
      const users = getUserList();
      io.emit('updateUsers', users);
    }
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
