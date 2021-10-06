const usersList = [];

// joins the user to the specific chatroom
function joinUser(id, firstName, lastName, jobPosition, roomName, dealer) {
  if (usersList.length === 0) dealer = true;
  const user = { id, firstName, lastName, jobPosition, roomName, dealer };

  usersList.push(user);
  console.log(usersList, "usersList");

  return user;
}

console.log("user out", usersList);

// Gets a particular user id to return the current user
function getCurrentUser(id) {
  return usersList.find((user) => user.id === id);
}

function getUsersList() {
  return usersList;
}

function handleUserDisconnection(id) {
  // Если ушел дилер - нужен новый дилер
  const needNewDealer = usersList.every((user) => !user.dealer);
  if (needNewDealer && usersList.length > 0) usersList[0].dealer = true;

  return usersList;
}

function clearUsers() {
  usersList.splice(0, usersList.length);
}

function removeUser(id) {
  const index = usersList.findIndex((user) => user.id === id);

  if (index !== -1) {
    usersList.splice(index, 1);
  }
  return usersList;
}

// called when the user leaves the chat and its user object deleted from array
function userDisconnect(id) {
  const index = usersList.findIndex((user) => user.id === id);

  if (index !== -1) {
    return usersList.splice(index, 1)[0];
  }
}

module.exports = {
  joinUser,
  getCurrentUser,
  userDisconnect,
  getUsersList,
  handleUserDisconnection,
  clearUsers,
  removeUser,
};
