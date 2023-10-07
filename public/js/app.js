const socket = io();
io.connect();
const { user } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("connect", () => {
  const username = user || `Anonim#${socket.id}`;
  socket.emit("joinRoom", username);

  socket.on("messageHistory", (messages) => {
    synchronizeMessagesWithServer(messages);
  });

  socket.on("message", ({ username, message }) => {
    addMessageToDOM(username, message);
  });

  socket.on("updateUsers", (users) => {
    // updateUsersToDOM(users);
  });

  document.querySelector(".chatForm ").addEventListener("submit", (e) => {
    e.preventDefault();
    let messageInput = document.querySelector("#messageInput");
    let message = messageInput.value;

    socket.emit("message", { username, message });
    messageInput.value = "";
  });
});
// Client JS
function addMessageToDOM(author, message) {
  const chatBox = document.querySelector(".chatMessages");

  chatBox.innerHTML += `
  <div class="message">
    <h1 class="messageAuthor">${author}</h1>
    <p class="messageContent">${message}</p>
  </div>`;
}

function updateUsersToDOM(users) {
  const userList = document.querySelector("#userList");

  const html = users.map((user) => `<li>${user.username}</li>`).join("");
  userList.innerHTML = html;
}

function synchronizeMessagesWithServer(messages) {
  const chatBox = document.querySelector(".chatMessages");
  chatBox.innerHTML = "";

  messages.forEach((message) => {
    chatBox.innerHTML += `
      <div class="message">
        <h1 class="messageAuthor">${message.author}</h1>
        <p class="messageContent">${message.message}</p>
      </div>`;
  });
}
