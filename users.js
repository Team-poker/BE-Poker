const usersList = [];

// joins the user to the specific chatroom
function joinUser(id, firstName, lastName, jobPosition, roomName) {
  const user = { id, firstName, lastName, jobPosition, roomName };

  usersList.push(user);
  console.log(usersList, "usersList");

  return user;
}

console.log("user out", usersList);

// Gets a particular user id to return the current user
function getCurrentUser(id) {
  return usersList.find((user) => user.id === id);
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
};