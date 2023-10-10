const socket = io();
io.connect();
const { user } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.on("connect", () => {
  const username = user || `Anonim#${socket.id}`;
  socket.emit("joinRoom", username);
});
socket.on("messageHistory", (messages) => {
  synchronizeMessagesWithServer(messages);
});

socket.on("message", ({ username, message }) => {
  addMessageToDOM(username, message);
});

socket.on("updateUsers", (users) => {
  updateUsersToDOM(users);
});

document.querySelector(".chatForm ").addEventListener("submit", (e) => {
  e.preventDefault();
  let messageInput = document.querySelector("#messageInput");
  let message = messageInput.value;

  socket.emit("message", { username, message });
  messageInput.value = "";
});
// Client JS
function addMessageToDOM(author, message) {
  const chatBox = document.querySelector(".chatMessages");

  chatBox.innerHTML += `
  <div class="message">
    <h1 class="messageAuthor">${author}</h1>
    <p class="messageContent">${message}</p>
  </div>`;
  chatBox.scrollTo(0, chatBox.scrollHeight);
}

function updateUsersToDOM(users) {
  const userCount = document.querySelector("#userCount");
  userCount.innerHTML = users.length;
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
    chatBox.scrollTo(0, chatBox.scrollHeight);
  });
}
