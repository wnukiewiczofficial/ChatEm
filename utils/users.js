const users = [];


function userJoin(id, username){
  const user = {id, username};
  users.push(user);
  return user;
}

function userDisconnect(id){
  let index = users.findIndex(user => user.id == id);
  if(index != -1) return users.splice(index, 1)[0];
}

function getUser(id){
  return users.find(user => user.id == id);
}

function getUserList(){
  return users;
}

module.exports = {
  userJoin,
  userDisconnect,
  getUser,
  getUserList
};
