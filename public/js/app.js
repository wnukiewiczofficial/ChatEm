const socket = io();

const {username} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.emit('joinRoom', username);

socket.on('message', ({username, message}) => {
  addMessageToDOM(username, message);
});

socket.on('updateUsers', users => {
  updateUsersToDOM(users);
});

document.querySelector('.chatForm').addEventListener('submit', (e) => {
  e.preventDefault();
  let messageInput = document.querySelector('#messageInput');
  let message = messageInput.value;

  socket.emit('message', {username, message});
  messageInput.value = '';
});

function addMessageToDOM(author, message){
  let chatBox = document.querySelector('.chatMessages');

  chatBox.innerHTML += `
  <div class="message">
    <h1 class="messageAuthor">${author}</h1>
    <p class="messageContent">${message}</p>
  </div>`;
}

function updateUsersToDOM(users){
  let userList = document.querySelector('#userList');

  let html = users.map(user => `<li>${user.username}</li>`).join('');
  userList.innerHTML = html;
}
