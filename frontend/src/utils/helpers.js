export const getSender = (currentUser, users) => {
  return users[0]._id === currentUser._id ? users[1] : users[0];
};
