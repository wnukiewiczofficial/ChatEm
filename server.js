const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const {
  getMessages,
  addMessage,
  deleteFirstMessage,
  clearChat,
} = require("./utils/messagehistory");
const { addUser, deleteUser, getUser, getUserList } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", (username) => {
    addUser(socket.id, username);

    const serverMessages = getMessages();
    socket.emit("messageHistory", serverMessages);
    const users = getUserList();
    io.emit("updateUsers", users);
  });

  socket.on("message", ({ username, message }) => {
    addMessage(username, message);
    io.emit("message", { username, message });
  });

  socket.on("disconnect", () => {
    const user = deleteUser(socket.id);
    if (user) {
      const users = getUserList();
      if (users.length === 0) clear();
      io.emit("updateUsers", users);
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
