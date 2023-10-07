const messageHistory = [];

function getMessages() {
  return messageHistory;
}

function addMessage(author, message) {
  if (messageHistory.length >= 20) deleteFirstMessage();
  messageHistory.push({ author, message });
  return messageHistory[messageHistory.length - 1];
}

function deleteFirstMessage() {
  return messageHistory.shift();
}

function clear() {
  messageHistory.length = 0;
  return messageHistory;
}

module.exports = {
  getMessages,
  addMessage,
  deleteFirstMessage,
  clear,
};
